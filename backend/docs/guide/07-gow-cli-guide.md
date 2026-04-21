# 07. `gow CLI` 使用指南

## 适用对象

准备在本项目里使用 `gow` 做脚手架、代码生成或服务初始化的开发者。

## 前置条件

- 本机已安装 Go
- 已知道仓库根目录是 `backend`

## 读完后你能做什么

- 理解 `gow` 在这个仓库里的角色
- 知道什么时候用 `gow`，什么时候用 `make`
- 知道新服务章节里为什么推荐先用 `gow`

## `gow` 在本项目中的定位

`gow` 不是可有可无的附加工具，它已经被仓库当作标准开发工具纳入：

- 根 `Makefile` 的 `cli` 目标会安装它
- `scripts/env/install_unix_dev.sh` 会安装它
- `scripts/env/install_windows_dev.ps1` 会安装它
- 根 `README.md` 明确给出了 `gow api` 的使用方式

所以，在本项目里可以把 `gow` 理解为：

- 用于**脚手架和快捷生成**
- 与 `make` 互补，而不是替代

## 安装方式

### 推荐方式

通过仓库安装脚本或 `make init` 安装。

### 手工安装

```powershell
go install github.com/tx7do/kratos-cli/gowind/cmd/gow@latest
```

安装后建议立刻执行：

```powershell
gow --help
```

## 当前仓库已经确认可用的 `gow` 场景

### 1. API 代码生成

根 `README.md` 已明确写出：

```powershell
gow api
```

这说明本项目至少把 `gow` 当作 API 生成入口之一。

### 2. 新服务脚手架

团队约定的推荐方式是：**新增服务优先使用 `gow CLI` 起骨架**，而不是手动从零抄目录。

原因很直接：

- 它能更快生成 Kratos 风格的初始目录
- 可以减少手工搭结构时的低级遗漏
- 更适合作为“第一步”

但你必须同时记住一件事：

> `gow` 负责起步，不负责自动完成本仓库的全部接入工作。

## `gow` 和 `make` 的关系

最简单的理解方式如下：

| 工具 | 主要职责 |
| --- | --- |
| `gow` | 起骨架、快捷生成、统一工具链入口 |
| `make` | 跟随当前仓库完成构建、生成、测试、运行 |

### 推荐实践

- 改 proto：优先 `make api` / `make openapi`，也可使用 `gow api`
- 起新服务：优先 `gow`
- 编译、测试、运行：优先 `make build`、`make test`、`make run`
- Wire / Ent：继续使用服务目录下的 `make wire`、`make ent`

## 推荐命令模板

下面是本项目建议掌握的 `gow` 命令形态。

### 查看帮助

```powershell
gow --help
```

### 生成 API

```powershell
gow api
```

### 新建项目（了解即可）

本仓库已经存在，因此日常不需要再执行 `gow new`。  
但理解它有助于你看懂 `gow` 的工具定位。

常见用法通常类似：

```powershell
gow new myproject -m github.com/your-org/myproject
```

### 新增服务（重点）

常见用法通常类似：

```powershell
gow add service order -s grpc -d ent -d redis
```

或者：

```powershell
gow add service gateway -s rest -s grpc -d redis
```

> 注意：`gow` 的具体参数格式可能随版本变化。  
> 如果你的本地版本和上面的模板不一致，请始终以 `gow --help`、`gow add --help`、`gow add service --help` 的输出为准。

## 在本项目里使用 `gow` 的正确姿势

### 做

- 用 `gow` 快速起一个新服务骨架
- 用 `gow api` 快速触发 API 生成
- 把 `gow` 当成“减少重复劳动”的工具

### 不要做

- 不要假设 `gow` 会自动更新本项目所有配置
- 不要认为 `gow` 生成后就不需要 `make wire`
- 不要认为 `gow` 会自动把新服务接入 `docker-compose.yaml`
- 不要认为 `gow` 会自动帮你补 `pkg/serviceid`、下游 gRPC client、OpenAPI 发布链路

## 新服务创建后仍需手工完成的事情

即使 `gow` 已经生成了骨架，通常仍然需要你继续补这些内容：

1. 对齐到 `app/<service>/service` 目录结构。
2. 检查 `Makefile` 是否引用 `../../../app.mk`。
3. 在 `cmd/server/main.go` 中设置 `Project`、`AppId`、`Version`。
4. 更新 `pkg/serviceid` 常量。
5. 补齐 `configs/*.yaml`。
6. 补齐 `internal/*/providers/wire_set.go` 与 `cmd/server/wire.go`。
7. 执行 `make wire`。
8. 必要时接入 `docker-compose.yaml`。

这些内容会在下一章展开。

## 一个务实建议

如果你的本地环境还没有装好 `gow`，不要硬等。  
本项目大多数日常开发任务仍可通过 `make` 完成。  
只有“起新服务骨架”这一步，`gow` 的收益特别大。

换句话说：

- 日常改接口、改逻辑：`make` 优先
- 起新服务：`gow` 优先
