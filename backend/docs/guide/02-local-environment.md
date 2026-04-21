# 02. 本地开发环境

## 适用对象

准备第一次在本地启动这个后端仓库的开发者。

## 前置条件

- 已安装 Git
- 能正常使用 PowerShell 或 Bash
- 本机允许 Docker 运行容器

## 读完后你能做什么

- 装齐本项目需要的基础工具
- 知道推荐的安装入口和最少依赖
- 知道启动前要检查哪些命令是否可用

## 必需工具

建议至少准备以下工具：

- Go 1.25.x 或兼容版本
- Docker / Docker Compose
- `buf`
- `ent`
- `wire`
- `golangci-lint`
- `gow`
- Protobuf 编译器及相关插件

其中一部分工具可以通过仓库脚本自动安装。

## 推荐安装方式

### Windows

优先使用仓库脚本：

```powershell
.\scripts\env\install_windows_dev.ps1
```

这个脚本会安装或配置：

- Docker
- Go
- `buf`
- `ent`
- `golangci-lint`
- `gow`
- 多个 protobuf 生成插件

### Linux / macOS

优先使用：

```bash
bash scripts/env/install_unix_dev.sh
```

### 只补 Go 侧工具

如果你的系统环境已经准备好，只想安装 Go CLI 工具，可以在仓库根目录执行：

```powershell
make init
```

`make init` 会继续调用：

- `make plugin`
- `make cli`

把 protobuf 插件和常用 CLI 安装到本机。

## `gow CLI` 安装

本项目已经把 `gow` 作为标准开发工具写进了：

- 根 `Makefile`
- `scripts/env/install_unix_dev.sh`
- `scripts/env/install_windows_dev.ps1`

如果需要单独安装，可执行：

```powershell
go install github.com/tx7do/kratos-cli/gowind/cmd/gow@latest
```

安装后建议先检查：

```powershell
gow --help
```

如果提示命令不存在，通常是下面这个目录没有加入 `PATH`：

- `$(go env GOPATH)/bin`

## 最低可运行检查

在开始前至少确认以下命令可用：

```powershell
go version
docker --version
buf --version
ent --help
golangci-lint version
```

如果你准备使用 `gow` 起新服务骨架，再补一条：

```powershell
gow --help
```

## 本地依赖服务

推荐通过 `make docker-libs` 启动依赖：

```powershell
make docker-libs
```

这会基于 `docker-compose.libs.yaml` 拉起：

- PostgreSQL
- Redis
- Elasticsearch
- MinIO
- etcd
- Jaeger

## 一个容易踩坑的地方

当前默认配置里，很多数据源地址写的是容器 DNS 名称：

- PostgreSQL: `host=postgres port=5432`
- Redis: `redis:6379`

这意味着：

- 如果你在容器里跑服务，这些地址通常可直接使用。
- 如果你在宿主机直接执行 `make run`，某些机器上未必能解析 `postgres` / `redis` 这两个名字。

遇到这种情况时，最直接的处理方式是把对应服务的 `configs/data.yaml` 临时改成：

- `localhost:5432`
- `localhost:6379`

然后再本地启动服务。

etcd 的默认配置已经是 `localhost:2379`，与本地开发更匹配。

## IDE 与 Proto 编辑建议

如果你使用 GoLand 编辑 `api/protos`，建议顺手阅读：

- [`scripts/proto/README.md`](../../scripts/proto/README.md)

它说明了为什么需要导出 Buf 远程依赖到 `api/third_party/buf`，否则 GoLand 经常会出现 `Cannot resolve import`。
