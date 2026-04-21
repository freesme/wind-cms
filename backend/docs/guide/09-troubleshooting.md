# 09. 常见问题排查

## 适用对象

已经开始跑服务、生成代码或新增接口，但遇到实际错误的开发者。

## 前置条件

- 已完成前面章节的基础阅读

## 读完后你能做什么

- 快速定位问题落在哪一层
- 按症状找到最可能的修复动作

## 排查顺序建议

遇到问题时，不要一上来就改代码。先按这个顺序判断：

1. 依赖服务是否起来了
2. 配置是否指向正确地址
3. 生成代码是否同步
4. Wire 是否重新生成
5. 服务注册点是否补齐
6. 上下游 discovery name 是否正确

## 问题 1：`gow` 命令不存在

### 现象

执行：

```powershell
gow --help
```

提示找不到命令。

### 处理

先安装：

```powershell
go install github.com/tx7do/kratos-cli/gowind/cmd/gow@latest
```

再检查 `PATH` 是否包含：

- `$(go env GOPATH)/bin`

如果你不想单独装，也可以直接执行仓库脚本：

- `.\scripts\env\install_windows_dev.ps1`
- `bash scripts/env/install_unix_dev.sh`

## 问题 2：本机运行服务时连不上 PostgreSQL 或 Redis

### 现象

- `dial tcp: lookup postgres: no such host`
- `lookup redis: no such host`

### 原因

默认 `configs/data.yaml` 使用了容器 DNS 名：

- `postgres`
- `redis`

本机宿主进程不一定能解析它们。

### 处理

把对应服务的 `configs/data.yaml` 临时改成：

- PostgreSQL -> `localhost:5432`
- Redis -> `localhost:6379`

然后重启服务。

## 问题 3：`admin-service` / `app-service` 启动了，但接口调用报找不到下游服务

### 现象

- HTTP 接口 500
- 日志里出现 etcd / discovery / grpc dial 错误

### 排查

1. `core-service` 是否已经先启动
2. `registry.yaml` 是否仍指向 `localhost:2379`
3. `pkg/serviceid` 中 discovery name 是否写对
4. 调用方 `internal/data/data.go` 是否还在连旧服务名

### 处理

对已有项目，优先确认 `core-service` 已先启动。  
如果是你自己新加的服务，再确认：

- `serviceid.<NewService>` 已创建
- client 构造函数使用了 `serviceid.NewDiscoveryName(serviceid.<NewService>)`

## 问题 4：改了 proto，但代码里还是旧接口

### 现象

- 编译时提示方法不存在
- `api/gen/go` 没变化
- Swagger 页面没出现新接口

### 处理

在仓库根目录重新执行：

```powershell
make api
make openapi
```

如果你偏好 `gow`：

```powershell
gow api
```

## 问题 5：改了 provider set，但启动时报依赖注入错误

### 现象

- `wire_gen.go` 没包含新构造函数
- 编译或启动时提示依赖缺失

### 处理

进入对应服务目录重新生成：

```powershell
cd app/<service>/service
make wire
```

同时检查：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`
- `cmd/server/wire.go`

是不是只改了一半。

## 问题 6：GoLand 里 proto import 全是红线，但命令行生成正常

### 原因

IDE 不会自动解析 Buf 远程依赖。

### 处理

按文档执行：

- [`scripts/proto/README.md`](../../scripts/proto/README.md)

通常就是先导出到：

```text
api/third_party/buf
```

再让 GoLand 把它当作 import roots。

## 问题 7：Swagger 页面打不开

### 排查

1. 对应服务是否已启动
2. `server.yaml` 里的 `enable_swagger` 是否是 `true`
3. `make openapi` 是否已经执行
4. `cmd/server/assets/openapi.yaml` 是否存在

### 处理

先重新生成：

```powershell
make openapi
```

再重启服务。

## 问题 8：新接口已经实现，但就是访问不到

### 常见原因

- 只改了 `core-service`，没在 `admin-service` / `app-service` 暴露
- 只改了 proto，没改实现
- 只改了实现，没重新生成 proto
- 新增的是全新 service 类型，但忘了在 `rest_server.go` / `grpc_server.go` 注册

### 处理思路

按链路反查：

```text
proto
-> 生成代码
-> core 实现
-> admin/app 包装
-> server 注册
-> 本地启动验证
```

只要有一环没补齐，接口就会“看起来像加了，实际上不可用”。

## 问题 9：新服务已经生成，但根 `Makefile` 不管它

### 原因

根 `Makefile` 只识别：

```text
app/*/*/Makefile
```

### 处理

确认：

- 路径是 `app/<service>/service`
- 目录下存在 `Makefile`
- `Makefile` 正常引用 `../../../app.mk`

## 问题 10：新服务能启动，但其他服务永远调不到它

### 常见原因

- 没有在 `pkg/serviceid` 中定义它
- 调用方仍然连 `core-service`
- etcd 没注册成功
- 新服务没有按当前项目的 `bootstrap` 方式初始化

### 处理

逐项检查：

1. `pkg/serviceid/service_id.go`
2. 新服务 `cmd/server/main.go` 里的 `AppId`
3. 调用方 `internal/data/data.go` 里的 `CreateGrpcClient(...)`
4. `registry.yaml`

## 一条最有效的经验

在这个仓库里，很多问题的本质都不是“业务逻辑写错了”，而是“生成链路断了”或“注册链路断了”。

所以排查时优先问自己三件事：

1. 我是不是忘了重新生成？
2. 我是不是忘了注册？
3. 我是不是连错了服务名？
