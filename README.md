# SAP 文档 MCP 服务器

一个快速、轻量的 MCP 服务器：使用高效的 BM25 全文检索，为官方 SAP 文档（SAPUI5、CAP、OpenUI5 API & 示例、wdi5）提供统一访问入口。

**本地 Streamable HTTP（默认：3122，可通过 MCP_PORT 配置）**：http://127.0.0.1:3122/mcp  
**本地 HTTP 状态接口**：http://127.0.0.1:3001/status  

---

## 功能

### 🔍 **统一的文档检索**
- **search** – 在所有官方 SAP 文档源中搜索，并提供智能过滤
- **fetch** – 获取完整文档/片段，并进行智能格式化

### 🌐 **社区与 Help Portal**  
- **sap_community_search** – 实时检索 SAP Community 帖子，并返回前 3 个结果的完整内容（必要时智能截断至 75k 字符）
- **sap_help_search** – 在 SAP Help Portal 文档中进行全面搜索  
- **sap_help_get** – 获取完整的 SAP Help 页面及其元数据（必要时智能截断至 75k 字符）

---

## 本地编译和运行

<details>
<summary><b>编译</b></summary>

> Windows 环境请使用 **Git Bash**（或 WSL）执行下面的命令；不要在 **PowerShell/CMD** 里直接运行 `./setup.sh`（`.sh` 需要 bash）。

```bash
# 在仓库根目录执行
npm ci
./setup.sh # 执行该脚本以克隆 GitHub 文档子模块
# npm run build
```
</details>
<details>
<summary><b>本地运行（STDIO + 本地 HTTP 状态 + Streamable HTTP）</b></summary>

```bash
# 启动 MCP 服务器（STDIO）
node dist/src/server.js

# 或启动 Streamable HTTP 服务器
npm run start:streamable
```
</details>


---



## 在 MCP 客户端中连接

✅ **本地/STDIO**：运行 `node dist/src/server.js`，并在客户端配置 command + args  
✅ **本地/Streamable HTTP**：运行 `npm run start:streamable`，并在客户端指向 `http://127.0.0.1:3122/mcp`

下面提供常见客户端的可复制配置（本地 STDIO 与本地 Streamable HTTP 两种方式）。

---

## Claude（桌面/网页 “Connectors”）

<details>
<summary><b>本地（STDIO）— 添加本地 MCP 服务器</b></summary>

将 Claude 指向以下命令与参数：

```
command: node
args: ["<absolute-path-to-your-repo>/dist/src/server.js"]
```

Claude 的 [user quickstart](https://modelcontextprotocol.io/docs/tutorials/use-remote-mcp-server) 展示了如何通过 command/args 的形式添加本地服务器。

</details>

<details>
<summary><b>本地（Streamable HTTP）— 最新 MCP 协议</b></summary>

对于支持 Streamable HTTP 的最新 MCP 协议（2025-03-26）：

1. 启动 Streamable HTTP 服务器：
```bash
npm run start:streamable
```

2. 添加自定义 Connector，并填入 URL：
```
http://127.0.0.1:3122/mcp
```

这种方式性能更好，并支持最新的 MCP 特性（包括会话管理与可恢复能力）。

</details>

---

## Cursor

<details>
<summary><b>本地（STDIO）</b></summary>

编辑 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "sap-docs": {
      "command": "node",
      "args": ["/absolute/path/to/dist/src/server.js"]
    }
  }
}
```

</details>

---

## Codex CLI

<details>
<summary><b>安装 Codex CLI</b></summary>

```bash
brew install --cask codex
```

</details>

<details>
<summary><b>添加该 MCP 服务器（命令方式）</b></summary>

**选项 A — Streamable HTTP（推荐）**

1. 启动本地 Streamable HTTP 服务器：
```bash
npm run start:streamable
```

2. 在 Codex 中注册：
```bash
codex mcp add mcp-sap-docs --url http://127.0.0.1:3122/mcp
```

**选项 B — 本地 STDIO**

```bash
codex mcp add mcp-sap-docs -- node /absolute/path/to/dist/src/server.js
```
Codex 会在需要时拉起该服务进程（请确保已先构建好 `dist/`）。

验证：
```bash
codex mcp list
codex mcp get mcp-sap-docs
```

</details>

<details>
<summary><b>添加该 MCP 服务器（直接编辑配置文件）</b></summary>

编辑 `~/.codex/config.toml`，并添加以下二选一配置：

**Streamable HTTP**
```toml
[mcp_servers.mcp-sap-docs]
url = "http://127.0.0.1:3122/mcp"
```

**本地 STDIO**
```toml
[mcp_servers.mcp-sap-docs]
command = "node"
args = ["/absolute/path/to/dist/src/server.js"]
```

</details>

---


## VS Code（GitHub Copilot Chat）

<details>
<summary><b>本地配置 — 离线使用</b></summary>

### 本地 STDIO Server
```json
{
  "servers": {
    "sap-docs-local": {
      "type": "stdio",
      "command": "node",
      "args": ["<absolute-path>/dist/src/server.js"]
    }
  }
}
```

### 本地 HTTP Server
```json
{
  "servers": {
    "sap-docs-http": {
      "type": "http",
      "url": "http://127.0.0.1:3122/mcp"
    }
  }
}
```
（请先运行 `npm run start:streamable` 启动本地服务器）

### 其他配置方式
- **命令面板**：运行 `MCP: Add Server` → 选择 server type → 填写详情 → 选择 scope
- **用户级配置**：运行 `MCP: Open User Configuration` 为所有工作区做全局配置

完整文档参考微软的 ["Use MCP servers in VS Code"](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)。

</details>

---

## Raycast

<details>
<summary><b>本地（STDIO）</b></summary>

打开 Raycast → 执行命令 “Manage Servers (MCP)” → 导入以下 JSON

```json
{
  "mcpServers": {
    "sap-docs": {
      "command": "node",
      "args": ["/absolute/path/to/dist/src/server.js"]
    }
  }
}
```

</details>

Raycast 默认会在每次调用 MCP 工具时要求确认。你可以开启自动确认：

打开 Raycast → Raycast Settings → AI → Model Context Protocol → 勾选 “Automatically confirm all tool calls”

---

## 功能特性

### 🔍 高级搜索能力
- **统一检索**：在所有官方 SAP 文档中统一搜索，并提供智能 ABAP 版本过滤
- **BM25 全文检索**：基于 SQLite FTS5，速度快且相关性高（平均查询约 ~15ms）
- **上下文感知评分**：自动停用词过滤与短语检测
- **版本过滤**：默认展示最新 ABAP，只有在明确请求版本时才按指定版本过滤

### 🌐 实时外部集成
- **SAP Community**：使用 “Best Match” 算法并结合互动指标获取内容
- **SAP Help Portal**：通过 API 直接访问 SAP 产品文档（S/4HANA、BTP、Analytics Cloud）
- **高效处理**：批量获取内容 + 智能缓存，保证响应速度

### 💡 智能增强
- **内容增强**：代码高亮与示例分类
- **智能排序**：上下文感知评分与按来源加权
- **性能优化**：轻量的 SQLite FTS5，无需外部 ML 依赖

---

## 包含内容

该 MCP 服务器为多个产品领域提供 **全面的 SAP 开发文档** 统一访问能力。所有来源会通过 `search` 工具同时检索，并进行智能过滤与排序。

### 📊 文档覆盖概览

| 来源类别 | 来源数 | 文件数 | 说明 |
|---------|--------|--------|------|
| **ABAP 开发** | 4 | 40,800+ | 官方 ABAP 关键字文档（8 个版本）、速查表、Fiori 展示、社区指南 |
| **UI5 开发** | 6 | 12,000+ | SAPUI5 文档、OpenUI5 API/示例、TypeScript、Tooling、Web Components、自定义控件 |
| **CAP 开发** | 2 | 250+ | CAP 文档与 Fiori Elements Showcase |
| **云与部署** | 3 | 500+ | SAP Cloud SDK（JS/Java）、AI SDK、Cloud MTA Build Tool |
| **测试与质量** | 2 | 260+ | wdi5 端到端测试框架、SAP 风格指南 |

### 🔍 ABAP 开发来源
- **Official ABAP Keyword Documentation**（`/abap-docs`）- 覆盖 8 个版本（7.52-7.58 + latest）的 **40,761+** ABAP 文件，并支持智能版本过滤  
  📁 **GitHub**：[marianfoo/abap-docs](https://github.com/marianfoo/abap-docs)
- **ABAP Cheat Sheets**（`/abap-cheat-sheets`）- 32 份全面速查表，涵盖 ABAP 核心概念、SQL、OOP、RAP 等  
  📁 **GitHub**：[SAP-samples/abap-cheat-sheets](https://github.com/SAP-samples/abap-cheat-sheets)
- **ABAP RAP Fiori Elements Showcase**（`/abap-fiori-showcase`）- ABAP RAP（RESTful Application Programming）完整注解参考  
  📁 **GitHub**：[SAP-samples/abap-platform-fiori-feature-showcase](https://github.com/SAP-samples/abap-platform-fiori-feature-showcase)
- **DSAG ABAP Guidelines**（`/dsag-abap-leitfaden`）- 德国 ABAP 社区最佳实践与开发标准  
  📁 **GitHub**：[1DSAG/ABAP-Leitfaden](https://github.com/1DSAG/ABAP-Leitfaden)

### 🎨 UI5 开发来源
- **SAPUI5 Documentation**（`/sapui5-docs`）- **1,485+** 文件：官方开发者指南、控件与最佳实践  
  📁 **GitHub**：[SAP-docs/sapui5](https://github.com/SAP-docs/sapui5)
- **OpenUI5 Framework**（`/openui5`）- **20,000+** 文件：OpenUI5 源码，含 500+ 控件 API（JSDoc）与 2,000+ demokit 示例  
  📁 **GitHub**：[SAP/openui5](https://github.com/SAP/openui5)
- **UI5 TypeScript Integration**（`/ui5-typescript`）- 官方 TypeScript 接入指南、类型定义与迁移文档  
  📁 **GitHub**：[UI5/typescript](https://github.com/UI5/typescript)
- **UI5 Tooling**（`/ui5-tooling`）- UI5 Tooling 的项目搭建、构建与开发流程完整文档  
  📁 **GitHub**：[SAP/ui5-tooling](https://github.com/SAP/ui5-tooling)
- **UI5 Web Components**（`/ui5-webcomponents`）- **4,500+** 文件：Web Components 文档、API 与实现示例  
  📁 **GitHub**：[SAP/ui5-webcomponents](https://github.com/SAP/ui5-webcomponents)
- **UI5 Custom Controls**（`/ui5-cc-spreadsheetimporter`）- Spreadsheet importer 等社区自定义控件文档  
  📁 **GitHub**：[spreadsheetimporter/ui5-cc-spreadsheetimporter](https://github.com/spreadsheetimporter/ui5-cc-spreadsheetimporter)

### ☁️ CAP 开发来源  
- **CAP Documentation**（`/cap-docs`）- **195+** 文件：CAP（Node.js / Java）完整文档  
  📁 **GitHub**：[cap-js/docs](https://github.com/cap-js/docs)
- **CAP Fiori Elements Showcase**（`/cap-fiori-showcase`）- CAP + Fiori Elements 的完整注解参考与示例  
  📁 **GitHub**：[SAP-samples/fiori-elements-feature-showcase](https://github.com/SAP-samples/fiori-elements-feature-showcase)

### 🚀 云与部署来源
- **SAP Cloud SDK for JavaScript**（`/cloud-sdk`）- JavaScript/TypeScript 的 SDK 文档、教程与 API 参考  
  📁 **GitHub**：[SAP/cloud-sdk](https://github.com/SAP/cloud-sdk)
- **SAP Cloud SDK for Java**（`/cloud-sdk`）- Java SDK 文档与集成指南  
  📁 **GitHub**：[SAP/cloud-sdk](https://github.com/SAP/cloud-sdk)
- **SAP Cloud SDK for AI**（`/cloud-sdk-ai`）- JavaScript/Java 的最新 AI 能力集成文档  
  📁 **GitHub**：[SAP/ai-sdk](https://github.com/SAP/ai-sdk)
- **Cloud MTA Build Tool**（`/cloud-mta-build-tool`）- Multi-Target Application 开发与部署完整文档  
  📁 **GitHub**：[SAP/cloud-mta-build-tool](https://github.com/SAP/cloud-mta-build-tool)

### ✅ 测试与质量来源
- **wdi5 Testing Framework**（`/wdi5`）- **225+** 文件：端到端测试文档、搭建指南与实战示例  
  📁 **GitHub**：[ui5-community/wdi5](https://github.com/ui5-community/wdi5)
- **SAP Style Guides**（`/sap-styleguides`）- SAP 官方编码规范、Clean Code 实践与开发指南  
  📁 **GitHub**：[SAP/styleguides](https://github.com/SAP/styleguides)

---

## 示例提示词

你可以在任何已连接的 MCP 客户端中尝试这些问题，快速体验覆盖范围与检索效果：

### 🔍 ABAP 开发相关
**ABAP Keyword Documentation（8 个版本 + 智能过滤）：**
- “ABAP 7.58 中内联声明（inline declarations）的语法是什么？”
- “ABAP 7.57 中如何在 SELECT 中使用内表？”
- “请展示现代 ABAP 中 TRY-CATCH 的异常处理写法”
- “VALUE 与 CORRESPONDING 的构造表达式（constructor expressions）是什么？”
- “如何用 test doubles 实现 ABAP Unit 单元测试？”

**ABAP 最佳实践与指南：**
- “什么是 Clean ABAP？如何遵循风格指南？”
- “给我一份关于内表操作的 ABAP cheat sheet”
- “查找 DSAG ABAP 的面向对象编程指南”
- “如何在 ABAP for Cloud 中使用 EML 实现 RAP？”

### 🎨 UI5 开发相关  
**SAPUI5 & OpenUI5：**
- “如何在 SAPUI5 中实现认证（authentication）？”
- “查找带 click handler 的 OpenUI5 Button 控件示例”
- “展示 UI5 中 fragment 复用的常见模式”
- “UI5 的 model binding 有哪些最佳实践？”

**现代 UI5 开发：**
- “展示用于 UI5 开发的 TypeScript 配置/搭建方式”
- “如何为新项目配置 UI5 Tooling？”
- “查找 UI5 Web Components 的集成示例”
- “如何基于 UI5 Web Components 实现自定义控件？”

### ☁️ CAP 与云开发
**CAP 框架：**
- “如何在 CAP 中实现带计算字段的 CDS view？”
- “展示 CAP 的认证与鉴权（authorization）模式”
- “查找 CAP Node.js service 的实现示例”
- “如何在 CAP 应用中处理 temporal data（时间维度数据）？”

**Cloud SDK 与部署：**
- “如何用 SAP Cloud SDK for JavaScript 访问 OData？”
- “展示 Cloud SDK for AI 的集成示例”
- “查找 multi-target apps 的 Cloud MTA Build Tool 配置”
- “如何将 CAP 应用部署到 SAP BTP？”

### ✅ 测试与质量
**测试框架：**
- “展示 wdi5 在表单与表格上的测试示例”
- “如何为 OData 服务测试搭建 wdi5？”
- “查找 Fiori Elements 应用的端到端测试模式”

**代码质量：**
- “SAP 风格指南对 JavaScript 的建议有哪些？”
- “展示 ABAP 开发中的 clean code 实践”

### 🌐 社区与 Help Portal
**社区知识（返回完整内容）：**
- “查找包含完整实现的 OData batch 操作社区示例”
- “搜索社区中关于 RAP 开发的技巧与建议”
- “社区中关于 CAP 认证最佳实践的最新讨论是什么？”

**SAP Help Portal：**
- “如何配置 S/4HANA Fiori Launchpad？”
- “查找 Analytics Cloud 的 BTP 集成文档”
- “搜索 S/4HANA 中 ABAP 开发最佳实践”

---

## 故障排查

<details>
<summary><b>VS Code 向导无法识别服务器</b></summary>

- 先尝试用本地 URL 添加。如果连接有问题，再改用本地 command 方式：
```
http://127.0.0.1:3122/mcp
```

如果仍然不行，请使用本地命令方式：
```
node <absolute-path>/dist/src/server.js
```

- 微软的 ["Add an MCP server"](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) 文档同时包含 URL 与 command 两种流程。

</details>

<details>
<summary><b>本地服务已运行，但客户端找不到</b></summary>

- 确认指向的是构建后的入口：
```
node dist/src/server.js
```

- 如果你使用进程管理器，请确认服务仍然存活：
```bash
curl -fsS http://127.0.0.1:3001/status | jq .
curl -fsS http://127.0.0.1:3122/health | jq .
```

</details>

---

## 架构

- **MCP Server**（Node.js/TypeScript）- 为 SAP 文档、社区与 Help Portal 暴露 Resources/Tools
- **Streamable HTTP Transport**（最新 MCP 规范）- 基于 HTTP 的传输层，支持会话管理与可恢复能力  
- **BM25 Search Engine** - SQLite FTS5 + 优化的 OR 逻辑查询，提升检索速度与相关性
- **Optimized Submodules** - 浅克隆 + 单分支 + blob filtering，减少带宽与体积

### 技术栈
- **Search Engine**：BM25 + SQLite FTS5（OR 逻辑加速）
- **Performance**：~15ms 平均查询时间（索引优化后）
- **Transport**：最新 MCP 协议 + HTTP Streamable 传输 + 会话管理
