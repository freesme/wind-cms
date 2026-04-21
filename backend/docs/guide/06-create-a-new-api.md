# 06. 新增一个接口

## 适用对象

准备在当前后端里新增一个 API / RPC 的开发者。

## 前置条件

- 已能看懂现有三服务架构
- 已知道如何执行 `make api`、`make wire`

## 读完后你能做什么

- 判断一个新接口该放在 `core`、`admin` 还是 `app`
- 走完整个 proto -> 生成 -> 实现 -> 注册 -> 验证 的闭环

## 先做两个判断

在动手之前，先回答两个问题。

### 问题 1：这个接口是谁调用的？

- 管理端调用：通常属于 `admin-service`
- 前台/客户端调用：通常属于 `app-service`
- 内部服务间调用：通常属于 `core-service` 的 gRPC 能力

### 问题 2：这是“新增方法”还是“新增服务”？

- 给已有服务增加一个方法：通常只改现有 proto 和现有 service struct
- 新增一个全新的服务类型：除了 proto 和实现，还要新增注册点、client 构造、Wire 节点

## 本项目的推荐分层

### 情况 A：新增对外 HTTP 接口，但底层能力已经存在

典型场景：

- `core-service` 已经有 `PostService.Publish`
- 你只是想让 `admin-service` 暴露一个后台 HTTP 路由

这种情况下：

1. 在 `api/protos/admin/service/v1/i_post.proto` 或 `api/protos/app/service/v1/i_post.proto` 增加 HTTP 方法。
2. 在对应的 `app/admin/service/internal/service/post_service.go` 或 `app/app/service/internal/service/post_service.go` 中转发到已有的 gRPC client。
3. 重新生成代码。

### 情况 B：底层业务能力不存在

典型场景：

- 你要新增一个真正的业务动作，例如“发布帖子”
- `core-service` 当前根本没有对应 RPC

这种情况下，应该先在 `core-service` 侧定义和实现 RPC，再视需要暴露给 `admin-service` / `app-service`。

## 真实例子：以帖子接口为模板理解

当前项目的帖子链路可以作为新增接口的参考：

- 业务 RPC 契约：[`api/protos/content/service/v1/post.proto`](../../api/protos/content/service/v1/post.proto)
- 前台 HTTP 契约：[`api/protos/app/service/v1/i_post.proto`](../../api/protos/app/service/v1/i_post.proto)
- `core-service` 实现：[`app/core/service/internal/service/post_service.go`](../../app/core/service/internal/service/post_service.go)
- `app-service` 包装层：[`app/app/service/internal/service/post_service.go`](../../app/app/service/internal/service/post_service.go)

你会看到：

- `core-service` 真正访问 repo
- `app-service` 主要负责转发 gRPC client 调用

## 标准步骤

### 第 1 步：修改 proto

#### 1. 先改业务 RPC proto

如果底层能力不存在，先在领域 proto 中定义方法，例如：

- `api/protos/content/service/v1/post.proto`
- `api/protos/identity/service/v1/user.proto`

这里定义：

- 请求 message
- 响应 message
- gRPC service method

#### 2. 再改对外 HTTP proto

如果这个能力需要对外暴露，再在下面其中一个目录新增方法：

- `api/protos/admin/service/v1/i_*.proto`
- `api/protos/app/service/v1/i_*.proto`

这里要加上：

- `google.api.http` 路由映射
- 请求/响应 message 的复用或转换

### 第 2 步：重新生成代码

在仓库根目录执行：

```powershell
make api
make openapi
```

或者使用项目支持的 `gow` 入口：

```powershell
gow api
```

这一步会更新：

- `api/gen/go`
- Admin/App 的 OpenAPI 资产

### 第 3 步：实现 `core-service`

如果你改的是已有服务，例如 `PostService`，通常只需要在现有文件里补一个方法，例如：

- `app/core/service/internal/service/post_service.go`

如果新方法还需要新增 repo 能力，则继续补：

- `app/core/service/internal/data/*_repo.go`

如果你引入了新的 repo 或依赖构造函数，再更新：

- `app/core/service/internal/data/providers/wire_set.go`
- `app/core/service/internal/service/providers/wire_set.go`

然后执行：

```powershell
cd app/core/service
make wire
```

### 第 4 步：注册 `core-service` 的 gRPC 服务

分两种情况：

#### 情况 A：只是给已有 service 新增方法

例如 `PostService` 新增一个方法。  
这时通常**不需要**改 `grpc_server.go`，因为 `PostService` 本来就已经注册过了。

#### 情况 B：新增一个全新的 gRPC service 类型

这时要在：

- [`app/core/service/internal/server/grpc_server.go`](../../app/core/service/internal/server/grpc_server.go)

里补对应的 `RegisterXXXServiceServer(...)`。

### 第 5 步：实现 `admin-service` 或 `app-service`

如果接口要对外暴露，再到对应包装层补方法：

- `app/admin/service/internal/service/*.go`
- `app/app/service/internal/service/*.go`

这里的常见写法是：

1. 通过 `internal/data/data.go` 创建 gRPC client
2. 在 `internal/service` 中持有这个 client
3. HTTP 方法中直接调用 `client.Method(...)`

如果新增的是一个全新的下游 client，还要补：

- `internal/data/data.go`
- `internal/data/providers/wire_set.go`
- `internal/service/providers/wire_set.go`

然后重新执行：

```powershell
cd app/admin/service
make wire
```

或：

```powershell
cd app/app/service
make wire
```

### 第 6 步：注册 HTTP 服务

同样分两种情况：

#### 情况 A：给已有 HTTP service 增方法

例如 `PostService` 原本就在 `rest_server.go` 里注册了。  
这时通常**不需要**新增注册语句。

#### 情况 B：新增一个全新的 HTTP service

需要在以下文件中补注册：

- [`app/admin/service/internal/server/rest_server.go`](../../app/admin/service/internal/server/rest_server.go)
- [`app/app/service/internal/server/rest_server.go`](../../app/app/service/internal/server/rest_server.go)

常见形式是：

```go
adminV1.RegisterXXXServiceHTTPServer(srv, xxxService)
appV1.RegisterXXXServiceHTTPServer(srv, xxxService)
```

## 特殊情况：文件上传类接口

大多数接口可以依赖 proto 生成的 HTTP handler。  
但像文件上传这类接口，当前项目里已经有一个明确的例外：

- `app/admin/service/internal/server/rest_server.go`
- `registerFileTransferServiceHandler(...)`

这里已经写明：代码生成器生成的 handler 不适合处理某些文件上传请求。  
所以如果你的新接口属于“多段表单 / 文件流”类型，要优先检查是否需要手工注册 handler，而不是完全依赖生成代码。

## 推荐验证步骤

### 编译验证

```powershell
make test
```

### 运行验证

1. 启动 `core-service`
2. 启动 `admin-service` 或 `app-service`
3. 打开对应 Swagger 页面
4. 直接在 Swagger 中调用新增接口

### 回归验证

如果你改动的是已有 service，建议顺手验证该 service 的旧接口没有被破坏。

## 新增接口检查清单

在提交之前，逐项确认：

- [ ] proto 已修改
- [ ] `make api` 已执行
- [ ] `make openapi` 已执行
- [ ] `core-service` 业务实现已补齐
- [ ] 若新增构造函数，Wire provider set 已更新
- [ ] 若新增 service 类型，`grpc_server.go` / `rest_server.go` 已注册
- [ ] Swagger 能看到新接口
- [ ] 本地联调能真正打通
