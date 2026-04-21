# 08. 新增一个服务

## 适用对象

准备在当前 monorepo 里新增一个后端服务的开发者。

## 前置条件

- 已读过 [07-gow-cli-guide.md](./07-gow-cli-guide.md)
- 本机已装好 `gow`
- 已知道本项目的三服务结构

## 读完后你能做什么

- 判断一个需求到底该“扩 `core-service`”还是“新开服务”
- 使用 `gow CLI` 起新服务骨架
- 把新服务真正接入当前仓库，而不是只生成一堆文件

## 先做一个判断：真的需要新服务吗？

在当前仓库里，很多需求其实更适合继续扩 `core-service`，而不是新建第四个服务。

### 优先继续扩 `core-service` 的情况

- 只是新增一个资源型 CRUD
- 只是多一个领域对象，但调用链和部署方式与现有 `core-service` 一样
- 不需要独立扩缩容
- 不需要隔离故障域

### 更适合新建服务的情况

- 需要独立部署或独立扩缩容
- 依赖和资源模型明显不同
- 有明显的边界隔离需求
- 希望把某块能力从 `core-service` 中拆出去

如果你还不确定，默认先扩 `core-service` 更稳。

## 本项目推荐做法

新增服务时，推荐以 `gow CLI` 作为第一步：

```powershell
gow add service <service-name> ...
```

但这里一定要牢记：

> `gow` 只负责起骨架；让新服务变成“本仓库真正可运行的一部分”，还需要你继续补齐一系列项目接入点。

## 第 1 步：用 `gow` 起服务骨架

常见命令形态一般类似：

```powershell
gow add service search -s grpc -d ent -d redis
```

如果你准备创建一个对外聚合型服务，常见形态可能类似：

```powershell
gow add service portal -s rest -s grpc -d redis
```

> 注意：`gow` 版本之间参数可能有差异。  
> 请始终以 `gow --help`、`gow add --help`、`gow add service --help` 为准。

## 第 2 步：确认生成结果是否落到正确位置

新服务最终必须处在这种结构下：

```text
app/<service-name>/service/
├─ cmd/server
├─ configs
├─ internal/data
├─ internal/server
├─ internal/service
└─ Makefile
```

如果 `gow` 生成出来的目录结构和上面不一致，你要手工调整到这个形状，否则根 `Makefile` 无法自动发现它。

## 第 3 步：让根 `Makefile` 能发现它

根 `Makefile` 只会扫描：

```text
app/*/*/Makefile
```

所以新服务至少要满足：

1. 路径是 `app/<service-name>/service`
2. 目录里存在 `Makefile`
3. `Makefile` 最好复用：

```make
include ../../../app.mk
```

如果这一步没对齐，后续的：

- `make build`
- `make wire`
- `make docker`

都不会顺畅。

## 第 4 步：补齐服务标识

新服务如果要参与服务发现，必须补 `pkg/serviceid`。

至少要改：

- [`pkg/serviceid/service_id.go`](../../pkg/serviceid/service_id.go)

例如新增：

```go
const (
    SearchService = "search-service"
)
```

如果下游要通过发现名访问它，通常还会继续用：

```go
serviceid.NewDiscoveryName(serviceid.SearchService)
```

## 第 5 步：对齐 `cmd/server/main.go`

新服务的 `main.go` 最重要的几件事是：

1. 用 `bootstrap.NewContext(...)` 初始化上下文
2. 写对 `Project`
3. 写对 `AppId`
4. 在需要时注册自定义配置

当前现有服务的写法可以直接参考：

- `app/admin/service/cmd/server/main.go`
- `app/app/service/cmd/server/main.go`
- `app/core/service/cmd/server/main.go`

你至少要保证：

```go
Project: serviceid.ProjectName
AppId:   serviceid.<YourServiceConstant>
```

如果你的新服务需要像 `core-service` 那样注册额外配置，再补：

```go
ctx.RegisterCustomConfig(...)
```

否则不要机械复制。

## 第 6 步：补齐配置文件

`gow` 起完骨架后，不代表配置就已经符合本项目约定。  
你至少要检查 `configs` 目录里的这些文件是否齐全：

- `server.yaml`
- `registry.yaml`
- `logger.yaml`
- `trace.yaml`
- `client.yaml`
- `remote.yaml`

按需再补：

- `data.yaml`
- `oss.yaml`
- `authenticator.yaml`

### 推荐复制策略

- 新服务如果是“业务承载层”，优先参考 `app/core/service/configs`
- 新服务如果是“对外聚合层”，优先参考 `app/admin/service/configs` 或 `app/app/service/configs`

### 一个务实建议

先让配置“足够跑起来”，再逐步裁剪。  
不要一上来就尝试把每个 YAML 缩到最小，否则会浪费很多时间在启动缺项上。

## 第 7 步：定义协议与业务边界

### 如果新服务是内部业务服务

优先在：

```text
api/protos/<domain>/service/v1
```

下定义它的 gRPC 契约。

### 如果新服务是对外聚合服务

还要补：

- `api/protos/admin/service/v1`
- 或 `api/protos/app/service/v1`

里的 HTTP 契约。

改完 proto 后执行：

```powershell
make api
make openapi
```

## 第 8 步：补齐 Wire 注入

`gow` 生成完骨架后，最容易漏掉的是 Wire。

你通常要检查三层 provider set：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`

以及聚合入口：

- `cmd/server/wire.go`

然后执行：

```powershell
cd app/<service-name>/service
make wire
```

如果你的服务需要：

- REST server
- gRPC server
- SSE server
- Asynq server

都要在 provider set 中显式引入对应构造函数。

## 第 9 步：补齐 server 注册点

### 新服务内部自己暴露的协议

如果服务对外暴露 REST 或内部暴露 gRPC，就要在它自己的：

- `internal/server/rest_server.go`
- `internal/server/grpc_server.go`

里注册具体服务。

### 其他服务访问它

如果 `admin-service` 或 `app-service` 要调用这个新服务，还要在它们各自的：

- `internal/data/data.go`
- `internal/data/providers/wire_set.go`

中增加新的 gRPC client 构造函数，并把目标 discovery name 从 `core-service` 改成新服务的 service id。

这一步非常关键。  
如果你只创建了新服务，却没有给调用方加 client，它永远不会真的被用到。

## 第 10 步：接入 Docker Compose

如果你希望新服务也能进入容器化联调或部署流程，需要继续改：

- `docker-compose.yaml`

通常要补：

- service 名称
- `build.args.SERVICE_NAME`
- 端口映射
- 依赖服务
- 环境变量

如果只是日常本地开发且只用宿主机 `make run`，这一步可以延后，但最终上线前迟早要补。

## 第 11 步：本地验证

推荐按下面顺序验证：

### 1. 生成代码

```powershell
make api
cd app/<service-name>/service
make wire
make build
```

### 2. 启动依赖

```powershell
cd ../../..
make docker-libs
```

### 3. 启动新服务

```powershell
cd app/<service-name>/service
make run
```

### 4. 如果有上游调用方，再启动上游

例如：

- `admin-service`
- `app-service`

### 5. 验证服务发现与接口

至少确认：

- 服务可以正常启动
- etcd 中能发现它
- 上游调用方能正确连通
- Swagger / gRPC 能看到新能力

## 新服务最小检查清单

- [ ] 目录位于 `app/<service>/service`
- [ ] 存在 `Makefile`
- [ ] `pkg/serviceid` 已补 service id
- [ ] `cmd/server/main.go` 的 `AppId` 已对齐
- [ ] `configs/*.yaml` 已补齐
- [ ] proto 已定义并生成
- [ ] Wire provider set 已补齐并重新生成
- [ ] server 注册点已完成
- [ ] 如需容器运行，`docker-compose.yaml` 已接入
- [ ] 本地可以实际跑起来

## 一个推荐策略

如果你是第一次做这件事，最稳的方式不是“完全相信 `gow` 输出”，而是：

1. 用 `gow` 起骨架。
2. 选一个最接近的新服务类型。
3. 对照现有服务逐项补齐差异。

在这个仓库里，这通常比从零手抄目录更稳，也比盲目信任脚手架更安全。
