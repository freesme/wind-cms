# 04. 项目结构与配置文件

## 适用对象

已经能跑起服务，但还不知道该去哪里改代码、改配置、找生成文件的人。

## 前置条件

- 已阅读 [01-architecture-overview.md](./01-architecture-overview.md)

## 读完后你能做什么

- 快速定位一个服务的入口、配置、业务实现、依赖注入代码
- 明白哪些目录能手改，哪些目录应该靠生成

## 仓库顶层目录

```text
backend/
├─ app/          # 三个后端服务
├─ api/          # proto 与生成代码
├─ pkg/          # 共享包
├─ scripts/      # 环境、Docker、部署、proto 辅助脚本
├─ sql/          # 示例数据
├─ Makefile      # 仓库级命令入口
└─ app.mk        # 服务级 Makefile 复用模板
```

### `app/`

这里放所有服务。目前有：

- `app/admin/service`
- `app/app/service`
- `app/core/service`

### `api/`

这里放接口契约和生成产物：

- `api/protos`: 所有 proto 源文件
- `api/gen/go`: 由 proto 生成的 Go 代码
- `api/buf.yaml` / `api/buf.lock`: Buf 配置和依赖锁定

### `pkg/`

共享能力，例如：

- `pkg/serviceid`: 服务名与发现名
- `pkg/middleware`: 公共中间件
- `pkg/oss`: MinIO 封装

### `scripts/`

主要包括：

- `scripts/env`: 开发环境安装脚本
- `scripts/docker`: Docker 启动脚本
- `scripts/proto`: Proto 辅助脚本
- `scripts/deploy`: 部署脚本

## 单个服务的目录结构

以 `app/core/service` 为例，结构基本如下：

```text
app/core/service/
├─ cmd/server
├─ configs
├─ internal/data
├─ internal/server
├─ internal/service
└─ Makefile
```

### `cmd/server`

这是服务启动入口。

常见文件：

- `main.go`: 创建 `bootstrap.Context`，设置 `Project`、`AppId`、`Version`
- `wire.go`: Wire 注入入口
- `wire_gen.go`: Wire 生成文件，不要手改
- `assets/openapi.yaml`: OpenAPI 生成产物，不要手改

### `configs`

这是运行期配置目录。三个服务的文件名大体一致。

#### `server.yaml`

定义：

- REST / gRPC / SSE / Asynq 监听地址
- 中间件开关
- Swagger 开关

#### `data.yaml`

定义：

- PostgreSQL 连接
- Redis 连接
- Elasticsearch 连接

当前项目里，`core-service` 的 `data.yaml` 最完整；`admin-service` 和 `app-service` 主要配置 Redis。

#### `registry.yaml`

定义服务发现与注册中心，当前默认使用 etcd：

```yaml
registry:
  type: "etcd"
  etcd:
    endpoints:
      - "localhost:2379"
```

#### `trace.yaml`

定义追踪配置，通常配合 Jaeger 使用。

#### `logger.yaml`

定义日志级别、格式、输出方式。

#### `oss.yaml`

定义 MinIO / 对象存储配置。

#### `client.yaml`

定义客户端调用相关配置。

#### `remote.yaml`

定义远程配置读取相关信息。

#### `authenticator.yaml`

只有 `core-service` 额外带了这个文件，用于认证器相关配置。

## `internal` 三层的职责

### `internal/data`

面向数据与下游依赖，常见职责包括：

- 数据库访问
- Redis 访问
- gRPC client 创建
- MinIO 客户端创建
- 服务发现 client 创建

对 `admin-service` / `app-service` 来说，这一层更像“调用 `core-service` 的 client 层”。  
对 `core-service` 来说，这一层才是数据库和缓存的真正入口。

### `internal/service`

业务服务层。

- 在 `core-service` 中，它通常实现 gRPC server。
- 在 `admin-service` / `app-service` 中，它通常把 HTTP 请求转成对 `core-service` 的 gRPC 调用。

例如：

- [app/core/service/internal/service/post_service.go](../../app/core/service/internal/service/post_service.go)
- [app/app/service/internal/service/post_service.go](../../app/app/service/internal/service/post_service.go)

### `internal/server`

协议适配与注册层。

常见文件：

- `rest_server.go`
- `grpc_server.go`
- `asynq_server.go`
- `sse_server.go`

这里最重要的事情是“注册服务”，例如：

- `RegisterPostServiceServer(...)`
- `RegisterPostServiceHTTPServer(...)`

## Wire 相关目录

每层通常都会有 `providers/wire_set.go`：

- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`
- `internal/server/providers/wire_set.go`

你可以把它们理解为：

- data 层有哪些构造函数
- service 层有哪些构造函数
- server 层有哪些构造函数

最终由 `cmd/server/wire.go` 聚合生成 `wire_gen.go`。

## 哪些文件可以直接改，哪些不要手改

### 可以直接改

- `api/protos/**/*.proto`
- `app/*/service/internal/**/*.go`
- `app/*/service/configs/*.yaml`
- `pkg/**/*.go`
- `scripts/**/*.sh` / `*.ps1`

### 不要手改

- `api/gen/go/**/*`
- `app/*/service/cmd/server/wire_gen.go`
- `app/*/service/cmd/server/assets/openapi.yaml`
- `app/core/service/internal/data/ent/**/*`

这些文件应通过生成命令更新。

## 根 `Makefile` 如何发现服务

根 `Makefile` 通过：

```make
SRCS_MK := $(foreach dir, app, $(wildcard $(dir)/*/*/Makefile))
```

自动发现 `app/*/*/Makefile`。  
这意味着新服务想被仓库级命令纳入管理，至少要满足：

- 路径位于 `app/<service>/service`
- 目录下存在 `Makefile`
- 这个 `Makefile` 通常引用 `../../../app.mk`

这点在“新增服务”章节里会反复用到。
