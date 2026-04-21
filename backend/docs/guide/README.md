# 后端服务教程

这套文档面向第一次接手 `go-wind-cms/backend` 的开发者，目标不是讲 Kratos 的通用概念，而是让你尽快搞清楚这个仓库里的三套服务怎么协作、怎么跑起来、怎么改接口、怎么加新服务。

## 你会得到什么

读完这套文档后，你应该能独立完成下面几件事：

1. 理解 `admin`、`app`、`core` 三个服务的职责和调用链。
2. 在本地启动依赖服务，并分别运行后端服务做联调。
3. 找到配置文件、生成代码、Wire 注入、OpenAPI 文档的真实入口。
4. 新增一个接口，并判断它应该改 `core`、`admin`、`app` 中的哪一层。
5. 使用 `gow CLI` 为仓库新增一个服务骨架，并补齐本项目需要的接入点。

## 推荐阅读顺序

| 文档 | 适合什么时候读 | 读完后你能做什么 |
| --- | --- | --- |
| [01-architecture-overview.md](./01-architecture-overview.md) | 刚接手项目 | 看懂三服务架构、服务发现和接口分层 |
| [02-local-environment.md](./02-local-environment.md) | 准备开始开发 | 装好 Go、Docker、Buf、Ent、Wire、`gow` 等工具 |
| [03-run-services-locally.md](./03-run-services-locally.md) | 第一次本地启动 | 跑起依赖、启动三服务、打开 Swagger |
| [04-project-layout-and-config.md](./04-project-layout-and-config.md) | 想快速找文件 | 快速定位 `cmd`、`configs`、`internal`、`api`、`pkg` |
| [05-codegen-and-dev-workflow.md](./05-codegen-and-dev-workflow.md) | 开始改代码 | 知道什么时候跑 `make api`、`make ent`、`make wire` |
| [06-create-a-new-api.md](./06-create-a-new-api.md) | 要新增接口 | 走完整个 proto -> 实现 -> 注册 -> 验证 链路 |
| [07-gow-cli-guide.md](./07-gow-cli-guide.md) | 要用 `gow` | 了解 `gow` 在本项目里的定位和推荐用法 |
| [08-create-a-new-service.md](./08-create-a-new-service.md) | 要加新服务 | 用 `gow` 起骨架并接入本仓库 |
| [09-troubleshooting.md](./09-troubleshooting.md) | 遇到启动/生成问题 | 快速排查常见故障 |

## 首次上手 10 分钟路径

在仓库根目录 `backend` 执行：

```powershell
make dep
make docker-libs
```

然后依次打开三个终端：

```powershell
cd app/core/service
make run
```

```powershell
cd app/admin/service
make run
```

```powershell
cd app/app/service
make run
```

启动成功后，优先访问：

- Admin Swagger: `http://localhost:6600/docs/`
- App Swagger: `http://localhost:6700/docs/`
- Jaeger: `http://localhost:16686/`
- MinIO Console: `http://localhost:9001/`

## 先记住这三个事实

1. `core-service` 是主要业务实现层，提供 gRPC 与异步任务能力。
2. `admin-service` 和 `app-service` 主要负责对外暴露 HTTP/SSE 接口，并通过 etcd 发现 `core-service` 后发起 gRPC 调用。
3. 这个仓库非常依赖代码生成。改了 proto、Ent schema、Wire provider 之后，不重新生成通常就跑不通。

## 配套说明文档

本目录只写“如何开发和接手本项目”。更细的脚本说明已经放在现有文档里：

- 环境和 Docker 脚本总览：[`scripts/README.md`](../../scripts/README.md)
- Proto 远程依赖导出和 GoLand 配置：[`scripts/proto/README.md`](../../scripts/proto/README.md)
- 仓库级命令和基础说明：[`README.md`](../../README.md)
