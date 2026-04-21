# 03. 本地运行后端服务

## 适用对象

已经准备好本地环境，准备第一次把三套后端服务跑起来的人。

## 前置条件

- 已完成 [02-local-environment.md](./02-local-environment.md)
- Docker 可以正常启动容器

## 读完后你能做什么

- 以项目推荐顺序启动依赖和服务
- 找到本地联调的关键地址
- 判断服务是否真的启动成功

## 推荐启动顺序

### 第 1 步：下载依赖

在仓库根目录执行：

```powershell
make dep
```

### 第 2 步：启动基础设施

```powershell
make docker-libs
```

如果想确认依赖已经起来，可以执行：

```powershell
docker compose -f docker-compose.libs.yaml ps
```

### 第 3 步：启动 core-service

```powershell
cd app/core/service
make run
```

为什么先跑它：

- `admin-service` 和 `app-service` 都要通过 etcd 发现并调用 `core-service`
- `core-service` 没起来时，上层接口通常无法正常工作

### 第 4 步：启动 admin-service

```powershell
cd app/admin/service
make run
```

### 第 5 步：启动 app-service

```powershell
cd app/app/service
make run
```

## 本地关键地址

### 开发时最常访问的地址

| 组件 | 地址 |
| --- | --- |
| Admin Swagger | `http://localhost:6600/docs/` |
| Admin OpenAPI | `http://localhost:6600/docs/openapi.yaml` |
| App Swagger | `http://localhost:6700/docs/` |
| App OpenAPI | `http://localhost:6700/docs/openapi.yaml` |
| Jaeger | `http://localhost:16686/` |
| MinIO Console | `http://localhost:9001/` |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |
| Elasticsearch | `http://localhost:9200/` |
| etcd | `localhost:2379` |

### 服务本地端口

| 服务 | 协议 | 配置文件里的默认地址 |
| --- | --- | --- |
| admin-service | REST | `0.0.0.0:6600` |
| admin-service | SSE | `:6601` |
| app-service | REST | `0.0.0.0:6700` |
| app-service | SSE | `:6701` |
| core-service | gRPC | `0.0.0.0:0` |
| core-service | Asynq | `redis://:*Abcd123456@redis:6379/1` |

`admin-service` 和 `app-service` 的 gRPC 地址也设置成了随机端口 `0.0.0.0:0`，因为它们的主入口不是给外部直接访问的 gRPC。

## 验证启动是否成功

最简单的验证顺序如下：

1. 打开 Admin Swagger，确认页面能加载。
2. 打开 App Swagger，确认页面能加载。
3. 打开 Jaeger，确认追踪面板可访问。
4. 访问任意一个公开 GET 接口，确认不是 500 或服务发现错误。

你也可以通过容器和端口做基础检查：

```powershell
docker ps
```

```powershell
Get-NetTCPConnection -LocalPort 6600,6700,2379,5432,6379,9001,16686
```

## 常见本地启动方式

### 模式 A：依赖在 Docker，服务在本机

这是最适合日常开发的模式：

```text
docker-compose.libs.yaml -> 起 PostgreSQL / Redis / MinIO / etcd / Jaeger
本机终端 -> 跑 core/admin/app
```

优点：

- IDE 调试最方便
- 改代码后无需重建服务镜像
- 更容易逐服务定位问题

### 模式 B：全部跑在 Docker

仓库也支持完整 Compose 部署，但这套文档不把它作为日常开发主线。部署细节可参考：

- [`scripts/README.md`](../../scripts/README.md)
- `docker-compose.yaml`

## 本地联调建议

推荐固定保留 4 个终端窗口：

1. `docker-libs`
2. `core-service`
3. `admin-service`
4. `app-service`

这样当某个上游报错时，可以立即判断问题出在：

- 依赖服务
- `core-service`
- `admin-service`
- `app-service`

## 如果本机直跑服务连不上数据库/Redis

优先检查两件事：

1. `configs/data.yaml` 是否仍然写着 `postgres`、`redis` 这类容器名。
2. 你的宿主机是否能解析这些容器名。

如果不能解析，直接把地址改成 `localhost` 版本最省时间。
