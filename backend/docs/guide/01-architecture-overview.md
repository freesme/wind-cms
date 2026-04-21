# 01. 架构总览

## 适用对象

第一次接手本项目、还不清楚三个服务如何协作的开发者。

## 前置条件

- 已知道仓库根目录是 `backend`
- 对 Go / HTTP / gRPC 有基础认知即可

## 读完后你能做什么

- 看懂 `admin`、`app`、`core` 的职责边界
- 判断新增接口应该落在哪一层
- 知道服务发现、配置、代码生成之间的关系

## 整体结构

仓库采用单仓多服务结构，核心目录如下：

```text
backend/
├─ app/
│  ├─ admin/service
│  ├─ app/service
│  └─ core/service
├─ api/
│  ├─ protos/
│  └─ gen/
├─ pkg/
├─ scripts/
└─ sql/
```

三套服务分别对应：

- `app/admin/service`: 后台管理接口，对外提供 REST + SSE，主要给管理端或后台页面调用。
- `app/app/service`: 前台接口，对外提供 REST + SSE，主要给站点前台或客户端调用。
- `app/core/service`: 核心业务能力层，主要提供 gRPC 服务和 Asynq 异步任务，不直接承担对外 REST 入口。

## 服务职责

### admin-service

- 服务标识：`admin-service`
- 主要入口：`app/admin/service/cmd/server/main.go`
- 本地 REST 端口：`6600`
- 本地 SSE 端口：`6601`
- Swagger：`http://localhost:6600/docs/`

它的职责不是自己保存业务数据，而是把后台 HTTP 请求转换成对 `core-service` 的 gRPC 调用，再做认证、鉴权、审计日志、SSE 推送等外围能力。

### app-service

- 服务标识：`app-service`
- 主要入口：`app/app/service/cmd/server/main.go`
- 本地 REST 端口：`6700`
- 本地 SSE 端口：`6701`
- Swagger：`http://localhost:6700/docs/`

它和 `admin-service` 的模式类似，但服务对象是前台业务。多数内容类查询、用户资料类查询，都是 `app-service` 作为 HTTP 入口，再转发到 `core-service`。

### core-service

- 服务标识：`core-service`
- 主要入口：`app/core/service/cmd/server/main.go`
- 主要协议：gRPC + Asynq
- 数据依赖：PostgreSQL、Redis、Elasticsearch、MinIO

它是真正的业务承载层。`core-service` 的 `internal/service` 目录里实现了大量 gRPC server，例如：

- 认证：`AuthenticationService`
- 身份：`UserService`、`TenantService`
- 内容：`PostService`、`CategoryService`
- 资源：`FileService`
- 审计：`ApiAuditLogService`

这些服务统一在 [app/core/service/internal/server/grpc_server.go](../../app/core/service/internal/server/grpc_server.go) 注册。

## 一次典型调用链

以帖子查询为例，调用链大致如下：

```text
HTTP 请求
  -> api/protos/app/service/v1/i_post.proto
  -> app/app/service/internal/service/post_service.go
  -> gRPC client 调 core-service
  -> api/protos/content/service/v1/post.proto
  -> app/core/service/internal/service/post_service.go
  -> app/core/service/internal/data/post_repo.go
  -> PostgreSQL / Redis / Elasticsearch
```

这条链有两个关键事实：

1. 对外 HTTP 协议定义在 `api/protos/admin/service/v1` 或 `api/protos/app/service/v1`。
2. 真正的业务 RPC 定义通常在 `api/protos/<domain>/service/v1`，由 `core-service` 实现。

## 接口分层规则

可以把 proto 分成两类：

### 1. 对外接口 proto

位于：

- `api/protos/admin/service/v1/i_*.proto`
- `api/protos/app/service/v1/i_*.proto`

特点：

- 带 `google.api.http` 注解
- 直接生成 HTTP handler 和 OpenAPI
- 更关注路由、鉴权、调用体验

### 2. 业务能力 proto

位于：

- `api/protos/authentication/service/v1`
- `api/protos/content/service/v1`
- `api/protos/identity/service/v1`
- 其他领域目录

特点：

- 主要给 `core-service` 提供 gRPC 服务契约
- 通常不直接定义对外 HTTP 路由
- 更关注业务模型和服务边界

## 服务发现与标识

本项目通过 etcd 做服务注册与发现。关键标识在 `pkg/serviceid`：

- 项目名：`gowind-cms`
- 后台服务：`admin-service`
- 前台服务：`app-service`
- 核心服务：`core-service`

`admin-service` 和 `app-service` 内部的 gRPC client 基本都通过：

```go
rpc.CreateGrpcClient(..., serviceid.NewDiscoveryName(serviceid.CoreService), ...)
```

去发现并调用 `core-service`。

## 依赖组件

本地联调时通常会先启动这些依赖：

- PostgreSQL: 主数据存储
- Redis: 缓存、令牌、任务队列
- Elasticsearch: 搜索和索引
- MinIO: 对象存储
- etcd: 服务注册与发现
- Jaeger: 链路追踪

它们都由 `docker-compose.libs.yaml` 管理。

## 生成代码在架构中的作用

这个项目不是“写完代码直接运行”的风格，很多内容都来自生成：

- `api/gen/go`: proto 生成的 Go 代码
- `app/*/service/cmd/server/assets/openapi.yaml`: OpenAPI 文档资产
- `app/*/service/cmd/server/wire_gen.go`: Wire 生成的依赖注入代码
- `app/core/service/internal/data/ent/*`: Ent 生成的 ORM / schema 代码

所以你只要改了契约或 provider，通常就要重新生成，不然架构本身就是断的。
