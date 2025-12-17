# SAP Documentation MCP Server

A fast, lightweight MCP server that provides unified access to official SAP documentation (SAPUI5, CAP, OpenUI5 APIs & samples, wdi5) using efficient BM25 full-text search.

**Local Streamable HTTP (default: 3122, configurable via MCP_PORT)**: http://127.0.0.1:3122/mcp  
**Local HTTP status**: http://127.0.0.1:3001/status  

---

## Quick start

<details>
<summary><b>Run it locally (STDIO + local HTTP status + Streamable HTTP)</b></summary>

```bash
# From repo root
npm ci
./setup.sh # execute this script to clone the github documentation submodules
npm run build

# Start the MCP server (STDIO)
node dist/src/server.js

# OR start the Streamable HTTP server
npm run start:streamable
```

**Local health checks**

```bash
# HTTP server
curl -sS http://127.0.0.1:3001/status | jq .

# Streamable HTTP server
curl -sS http://127.0.0.1:3122/health | jq .
```

</details>

---

## What you get

### 🔍 **Unified Documentation Search**
- **search** – Search across all official SAP documentation sources with intelligent filtering
- **fetch** – Retrieve complete documents/snippets with smart formatting

### 🌐 **Community & Help Portal**  
- **sap_community_search** – Real-time SAP Community posts with full content of top 3 results (intelligently truncated to 75k chars if needed)
- **sap_help_search** – Comprehensive search across SAP Help Portal documentation  
- **sap_help_get** – Retrieve complete SAP Help pages with metadata (intelligently truncated to 75k chars if needed)

---

## Connect from your MCP client

✅ **Local/STDIO**: run `node dist/src/server.js` and point the client to a command + args  
✅ **Local/Streamable HTTP**: run `npm run start:streamable` and point the client to `http://127.0.0.1:3122/mcp`

Below are copy-paste setups for popular clients (local STDIO and local Streamable HTTP options).

---

## Claude (Desktop / Web "Connectors")

<details>
<summary><b>Local (STDIO) — add a local MCP server</b></summary>

Point Claude to the command and args:

```
command: node
args: ["<absolute-path-to-your-repo>/dist/src/server.js"]
```

Claude's [user quickstart](https://modelcontextprotocol.io/docs/tutorials/use-remote-mcp-server) shows how to add local servers by specifying a command/args pair.

</details>

<details>
<summary><b>Local (Streamable HTTP) — latest MCP protocol</b></summary>

For the latest MCP protocol (2025-03-26) with Streamable HTTP support:

1. Start the streamable HTTP server:
```bash
npm run start:streamable
```

2. Add a custom connector with the URL:
```
http://127.0.0.1:3122/mcp
```

This provides better performance and supports the latest MCP features including session management and resumability.

</details>

---

## Cursor

<details>
<summary><b>Local (STDIO)</b></summary>

`~/.cursor/mcp.json`:

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
<summary><b>Install Codex CLI</b></summary>

```bash
brew install --cask codex
```

</details>

<details>
<summary><b>Add this MCP server (command)</b></summary>

**Option A — Streamable HTTP (recommended)**

1. Start the local Streamable HTTP server:
```bash
npm run start:streamable
```

2. Register it in Codex:
```bash
codex mcp add mcp-sap-docs --url http://127.0.0.1:3122/mcp
```

**Option B — Local STDIO**

```bash
codex mcp add mcp-sap-docs -- node /absolute/path/to/dist/src/server.js
```
Codex will launch the server process when needed (make sure you built `dist/` first).

Verify:
```bash
codex mcp list
codex mcp get mcp-sap-docs
```

</details>

<details>
<summary><b>Add this MCP server (edit config file)</b></summary>

Edit `~/.codex/config.toml` and add one of the following:

**Streamable HTTP**
```toml
[mcp_servers.mcp-sap-docs]
url = "http://127.0.0.1:3122/mcp"
```

**Local STDIO**
```toml
[mcp_servers.mcp-sap-docs]
command = "node"
args = ["/absolute/path/to/dist/src/server.js"]
```

</details>

---

## Eclipse (GitHub Copilot)

Eclipse users can integrate the SAP Docs MCP server with GitHub Copilot for seamless access to SAP development documentation.

<details>
<summary><b>Local setup — for offline use</b></summary>

### Local MCP Server Configuration

```json
{
  "name": "SAP Docs MCP (Local)",
  "description": "Local SAP documentation server",
  "command": "npm", 
  "args": ["start"],
  "cwd": "/absolute/path/to/your/sap-docs-mcp",
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Prerequisites for local setup:**
1. Clone and build this repository locally
2. Run `npm run setup` to initialize all documentation sources
3. Ensure the server starts correctly with `npm start`

</details>

---

## VS Code (GitHub Copilot Chat)

<details>
<summary><b>Local setup — for offline use</b></summary>

### Local STDIO Server
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

### Local HTTP Server
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
(Start local server with `npm run start:streamable` first)

### Alternative Setup Methods
- **Command Palette**: Run `MCP: Add Server` → choose server type → provide details → select scope
- **User Configuration**: Run `MCP: Open User Configuration` for global setup across all workspaces

See Microsoft's ["Use MCP servers in VS Code"](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) for complete documentation.

</details>


---

## Raycast

<details>
<summary><b>Local (STDIO)</b></summary>

Open Raycast → Open Command "Manage Servers (MCP) → Import following JSON

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

Raycast by default asks to confirm each usage of an MCP tool. You can enable automatic confirmation:

Open Raycast → Raycast Settings → AI → Model Context Protocol → Check "Automatically confirm all tool calls"

---

## Features

### 🔍 Advanced Search Capabilities
- **Unified search** across all official SAP documentation with intelligent ABAP version filtering
- **BM25 full-text search** with SQLite FTS5 for fast, relevant results (~15ms average query time)
- **Context-aware scoring** with automatic stopword filtering and phrase detection
- **Version-specific filtering** - shows latest ABAP by default, specific versions only when requested

### 🌐 Real-time External Integration
- **SAP Community**: Full content retrieval using "Best Match" algorithm with engagement metrics
- **SAP Help Portal**: Direct API access to all SAP product documentation (S/4HANA, BTP, Analytics Cloud)
- **Efficient processing**: Batch content retrieval and intelligent caching for fast response times

### 💡 Smart Features
- **Automatic content enhancement**: Code highlighting and sample categorization
- **Intelligent ranking**: Context-aware scoring with source-specific weighting
- **Performance optimized**: Lightweight SQLite FTS5 with no external ML dependencies

---

## What's Included

This MCP server provides unified access to **comprehensive SAP development documentation** across multiple product areas. All sources are searched simultaneously through the `search` tool, with intelligent filtering and ranking.

### 📊 Documentation Coverage Overview

| Source Category | Sources | File Count | Description |
|-----------------|---------|------------|-------------|
| **ABAP Development** | 4 sources | 40,800+ files | Official ABAP keyword docs (8 versions), cheat sheets, Fiori showcase, community guidelines |
| **UI5 Development** | 6 sources | 12,000+ files | SAPUI5 docs, OpenUI5 APIs/samples, TypeScript, tooling, web components, custom controls |
| **CAP Development** | 2 sources | 250+ files | Cloud Application Programming model docs and Fiori Elements showcase |
| **Cloud & Deployment** | 3 sources | 500+ files | SAP Cloud SDK (JS/Java), Cloud SDK for AI, Cloud MTA Build Tool |
| **Testing & Quality** | 2 sources | 260+ files | wdi5 E2E testing framework, SAP style guides |

### 🔍 ABAP Development Sources
- **Official ABAP Keyword Documentation** (`/abap-docs`) - **40,761+ curated ABAP files** across 8 versions (7.52-7.58 + latest) with intelligent version filtering  
  📁 **GitHub**: [marianfoo/abap-docs](https://github.com/marianfoo/abap-docs)
- **ABAP Cheat Sheets** (`/abap-cheat-sheets`) - 32 comprehensive cheat sheets covering core ABAP concepts, SQL, OOP, RAP, and more  
  📁 **GitHub**: [SAP-samples/abap-cheat-sheets](https://github.com/SAP-samples/abap-cheat-sheets)
- **ABAP RAP Fiori Elements Showcase** (`/abap-fiori-showcase`) - Complete annotation reference for ABAP RESTful Application Programming (RAP)  
  📁 **GitHub**: [SAP-samples/abap-platform-fiori-feature-showcase](https://github.com/SAP-samples/abap-platform-fiori-feature-showcase)
- **DSAG ABAP Guidelines** (`/dsag-abap-leitfaden`) - German ABAP community best practices and development standards  
  📁 **GitHub**: [1DSAG/ABAP-Leitfaden](https://github.com/1DSAG/ABAP-Leitfaden)

### 🎨 UI5 Development Sources
- **SAPUI5 Documentation** (`/sapui5-docs`) - **1,485+ files** - Complete official developer guide, controls, and best practices  
  📁 **GitHub**: [SAP-docs/sapui5](https://github.com/SAP-docs/sapui5)
- **OpenUI5 Framework** (`/openui5`) - **20,000+ files** - Complete OpenUI5 source including 500+ control APIs with detailed JSDoc and 2,000+ working examples from demokit samples  
  📁 **GitHub**: [SAP/openui5](https://github.com/SAP/openui5)
- **UI5 TypeScript Integration** (`/ui5-typescript`) - Official TypeScript setup guides, type definitions, and migration documentation  
  📁 **GitHub**: [UI5/typescript](https://github.com/UI5/typescript)
- **UI5 Tooling** (`/ui5-tooling`) - Complete UI5 Tooling documentation for project setup, build, and development workflows  
  📁 **GitHub**: [SAP/ui5-tooling](https://github.com/SAP/ui5-tooling)
- **UI5 Web Components** (`/ui5-webcomponents`) - **4,500+ files** - Comprehensive web components documentation, APIs, and implementation examples  
  📁 **GitHub**: [SAP/ui5-webcomponents](https://github.com/SAP/ui5-webcomponents)
- **UI5 Custom Controls** (`/ui5-cc-spreadsheetimporter`) - Spreadsheet importer and other community custom control documentation  
  📁 **GitHub**: [spreadsheetimporter/ui5-cc-spreadsheetimporter](https://github.com/spreadsheetimporter/ui5-cc-spreadsheetimporter)

### ☁️ CAP Development Sources  
- **CAP Documentation** (`/cap-docs`) - **195+ files** - Complete Cloud Application Programming model documentation for Node.js and Java  
  📁 **GitHub**: [cap-js/docs](https://github.com/cap-js/docs)
- **CAP Fiori Elements Showcase** (`/cap-fiori-showcase`) - Comprehensive annotation reference and examples for CAP-based Fiori Elements applications  
  📁 **GitHub**: [SAP-samples/fiori-elements-feature-showcase](https://github.com/SAP-samples/fiori-elements-feature-showcase)

### 🚀 Cloud & Deployment Sources
- **SAP Cloud SDK for JavaScript** (`/cloud-sdk`) - Complete SDK documentation, tutorials, and API references for JavaScript/TypeScript  
  📁 **GitHub**: [SAP/cloud-sdk](https://github.com/SAP/cloud-sdk)
- **SAP Cloud SDK for Java** (`/cloud-sdk`) - Comprehensive Java SDK documentation and integration guides  
  📁 **GitHub**: [SAP/cloud-sdk](https://github.com/SAP/cloud-sdk)
- **SAP Cloud SDK for AI** (`/cloud-sdk-ai`) - Latest AI capabilities integration documentation for both JavaScript and Java  
  📁 **GitHub**: [SAP/ai-sdk](https://github.com/SAP/ai-sdk)
- **Cloud MTA Build Tool** (`/cloud-mta-build-tool`) - Complete documentation for Multi-Target Application development and deployment  
  📁 **GitHub**: [SAP/cloud-mta-build-tool](https://github.com/SAP/cloud-mta-build-tool)

### ✅ Testing & Quality Sources
- **wdi5 Testing Framework** (`/wdi5`) - **225+ files** - End-to-end testing documentation, setup guides, and real-world examples  
  📁 **GitHub**: [ui5-community/wdi5](https://github.com/ui5-community/wdi5)
- **SAP Style Guides** (`/sap-styleguides`) - Official SAP coding standards, clean code practices, and development guidelines  
  📁 **GitHub**: [SAP/styleguides](https://github.com/SAP/styleguides)

---

## Example Prompts

Try these with any connected MCP client to explore the comprehensive documentation:

### 🔍 ABAP Development Queries
**ABAP Keyword Documentation (8 versions with intelligent filtering):**
- "What is the syntax for inline declarations in ABAP 7.58?"
- "How do I use SELECT statements with internal tables in ABAP 7.57?"
- "Show me exception handling with TRY-CATCH in modern ABAP"
- "What are constructor expressions for VALUE and CORRESPONDING?"
- "How do I implement ABAP Unit tests with test doubles?"

**ABAP Best Practices & Guidelines:**
- "What is Clean ABAP and how do I follow the style guide?"
- "Show me ABAP cheat sheet for internal tables operations"
- "Find DSAG ABAP guidelines for object-oriented programming"
- "How to implement RAP with EML in ABAP for Cloud?"

### 🎨 UI5 Development Queries  
**SAPUI5 & OpenUI5:**
- "How do I implement authentication in SAPUI5?"
- "Find OpenUI5 button control examples with click handlers"
- "Show me fragment reuse patterns in UI5"
- "What are UI5 model binding best practices?"

**Modern UI5 Development:**
- "Show me TypeScript setup for UI5 development"
- "How do I configure UI5 Tooling for a new project?" 
- "Find UI5 Web Components integration examples"
- "How to implement custom controls with UI5 Web Components?"

### ☁️ CAP & Cloud Development
**CAP Framework:**
- "How do I implement CDS views with calculated fields in CAP?"
- "Show me CAP authentication and authorization patterns"
- "Find CAP Node.js service implementation examples"
- "How to handle temporal data in CAP applications?"

**Cloud SDK & Deployment:**
- "How do I use SAP Cloud SDK for JavaScript with OData?"
- "Show me Cloud SDK for AI integration examples"
- "Find Cloud MTA Build Tool configuration for multi-target apps"
- "How to deploy CAP applications to SAP BTP?"

### ✅ Testing & Quality
**Testing Frameworks:**
- "Show me wdi5 testing examples for forms and tables"
- "How do I set up wdi5 for OData service testing?"
- "Find end-to-end testing patterns for Fiori Elements apps"

**Code Quality:**
- "What are SAP style guide recommendations for JavaScript?"
- "Show me clean code practices for ABAP development"

### 🌐 Community & Help Portal
**Community Knowledge (with full content):**
- "Find community examples of OData batch operations with complete implementation"
- "Search for RAP development tips and tricks from the community"
- "What are the latest CAP authentication best practices from the community?"

**SAP Help Portal:**
- "How to configure S/4HANA Fiori Launchpad?"
- "Find BTP integration documentation for Analytics Cloud"
- "Search for ABAP development best practices in S/4HANA"

---

## Troubleshooting

<details>
<summary><b>VS Code wizard can't detect the server</b></summary>

- Try adding it via local URL first. If there are connection issues, use your local server via command:
```
http://127.0.0.1:3122/mcp
```

If that doesn't work, use your local server via command:
```
node <absolute-path>/dist/src/server.js
```

- Microsoft's ["Add an MCP server"](https://code.visualstudio.com/docs/copilot/chat/mcp-servers) guide shows both URL and command flows.

</details>

<details>
<summary><b>Local server runs, but the client can't find it</b></summary>

- Ensure you're pointing to the built entry:
```
node dist/src/server.js
```

- If using a process manager, confirm it's alive:
```bash
curl -fsS http://127.0.0.1:3001/status | jq .
curl -fsS http://127.0.0.1:3122/health | jq .
```

</details>

---

## Development

### Build Commands
```bash
npm run build:tsc       # Compile TypeScript
npm run build:index     # Build search index from sources
npm run build:fts       # Build FTS5 database  
npm run build           # Complete build pipeline (tsc + index + fts)
npm run setup           # Complete setup (submodules + build)
```

### Server Commands
```bash
npm start                    # Start STDIO MCP server
npm run start:http           # Start HTTP status server (port 3001)
npm run start:streamable     # Start Streamable HTTP MCP server (port 3122)
```

### Local Setup  
```bash
git clone https://github.com/marianfoo/mcp-sap-docs.git
cd mcp-sap-docs
npm ci               # Install dependencies
npm run setup        # Enhanced setup (optimized submodules + complete build)
```

The build process creates optimized search indices for fast offline access while maintaining real-time connectivity to the SAP Community API.

---

## Health & Status Monitoring

### Local Endpoints
```bash
# HTTP server status
curl -sS http://127.0.0.1:3001/status | jq .

# MCP Streamable HTTP server status  
curl -sS http://127.0.0.1:3122/health | jq .
```

---

## Architecture

- **MCP Server** (Node.js/TypeScript) - Exposes Resources/Tools for SAP docs, community & help portal
- **Streamable HTTP Transport** (Latest MCP spec) - HTTP-based transport with session management and resumability  
- **BM25 Search Engine** - SQLite FTS5 with optimized OR-logic queries for fast, relevant results
- **Optimized Submodules** - Shallow, single-branch clones with blob filtering for minimal bandwidth

### Technical Stack
- **Search Engine**: BM25 with SQLite FTS5 for fast full-text search with OR logic
- **Performance**: ~15ms average query time with optimized indexing
- **Transport**: Latest MCP protocol with HTTP Streamable transport and session management
