# 05. 代码生成与日常开发流程

## 适用对象

准备开始改 proto、改数据模型、改 Wire 或者准备提 PR 的开发者。

## 前置条件

- 已知道仓库结构和三服务职责
- 已能本地运行至少一个服务

## 读完后你能做什么

- 判断某类改动之后该跑什么命令
- 明白哪些命令在仓库根目录执行，哪些命令在服务目录执行
- 避免“代码改了但生成文件没更新”的低级错误

## 常用命令一览

### 仓库根目录执行

```powershell
make dep
make test
make cover
make lint
make api
make openapi
make ts
make build
make docker-libs
```

### 服务目录执行

```powershell
cd app/core/service
make ent
make wire
make build
make run
```

其他两个服务目录用法一致：

- `app/admin/service`
- `app/app/service`

## 每个命令在做什么

### `make dep`

下载模块依赖，等价于：

```powershell
go mod download
```

### `make test`

执行整仓测试：

```powershell
go test ./...
```

### `make cover`

执行测试并生成 `coverage.out`。

### `make lint`

运行 `golangci-lint`。提交前建议至少跑一次。

### `make api`

在 `api/` 目录执行 `buf generate`，生成：

- `api/gen/go`
- HTTP / gRPC / validate 等相关代码

### `make openapi`

生成 OpenAPI 文档资产，最终体现在：

- `app/admin/service/cmd/server/assets/openapi.yaml`
- `app/app/service/cmd/server/assets/openapi.yaml`

### `make ts`

生成 TypeScript 客户端代码，主要服务前后端协作。

### `make ent`

在服务目录下根据 Ent schema 重新生成 ORM 代码。  
通常只有 `core-service` 这类真正持久化数据的服务会频繁用到。

### `make wire`

根据 provider set 重新生成 `wire_gen.go`。

### `make build`

编译服务。根目录执行时会遍历所有服务；服务目录执行时只编译当前服务。

## `gow api` 在本项目中的定位

根 `README.md` 已经明确说明，本项目支持两类 API 生成入口：

1. `Makefile`
2. `gow cli`

也就是说，下面这条命令是项目认可的：

```powershell
gow api
```

推荐理解方式如下：

- 想最稳地跟随当前仓库，优先用 `make api`、`make openapi`。
- 想统一走 `gow` 工具链，也可以用 `gow api`。
- 如果两者输出不一致，以当前仓库实际生成结果和 `buf` 配置为准。

## 改动类型 -> 你该跑什么

| 你改了什么 | 必跑命令 | 常见补充 |
| --- | --- | --- |
| `api/protos/**/*.proto` | `make api` | `make openapi`、必要时 `make ts` |
| `internal/data/ent/schema` | `make ent` | 然后执行 `make build` 或 `make test` |
| `providers/wire_set.go`、`cmd/server/wire.go` | `make wire` | 然后执行 `make build` |
| 普通业务 Go 代码 | 无强制生成 | 建议 `make test` |
| 配置文件 `configs/*.yaml` | 无生成 | 直接重启服务验证 |

## 推荐日常开发闭环

### 场景 1：改普通业务逻辑

```powershell
go test ./...
make run
```

### 场景 2：改 proto

```powershell
make api
make openapi
go test ./...
```

### 场景 3：加新依赖注入节点

```powershell
cd app/core/service
make wire
make build
```

### 场景 4：改 Ent schema

```powershell
cd app/core/service
make ent
make build
```

## 提交前的最小检查清单

建议至少完成：

1. 相关生成文件已更新。
2. `make test` 通过。
3. `make lint` 没有新增问题。
4. 变更涉及 HTTP 接口时，Swagger 可以正常打开。
5. 如果改了 proto，`api/gen/go` 与 OpenAPI 产物已经同步提交。

## 常见遗漏项

### 忘了重新生成 proto

症状：

- 编译提示接口不存在
- 生成的 pb.go 与 proto 不一致

处理：

```powershell
make api
make openapi
```

### 忘了重新生成 Wire

症状：

- `wire_gen.go` 里找不到新构造函数
- 启动时依赖注入失败

处理：

```powershell
cd app/<service>/service
make wire
```

### GoLand 里 proto import 红线，但 `buf generate` 正常

这通常是 IDE 没导入 Buf 远程依赖，不是项目真的坏了。处理方式见：

- [`scripts/proto/README.md`](../../scripts/proto/README.md)
