# Workspace Development Rules

## 1. Build & Terminal Command Policy
- **DO NOT run `npm run build` for minor/small changes**:
  - Never trigger a production build, Rollup bundling, or lengthy typechecks after simple UI styling changes, copy updates, icon swaps, or localized component tweaks.
  - The local development server (`npm run dev`) already handles instant Vite Hot Module Replacement (HMR).
- **When to run `npm run build`**:
  - ONLY run `npm run build` when making significant, multi-module architectural overhauls, installing/updating major dependencies, or making deep backend/simulation engine modifications.

## 2. Codebase Intelligence & MCP Tools Mandate
- **STRICT RESTRICTION ON TERMINAL / BASH COMMANDS**:
  - Never use terminal/bash commands (`find`, `ls`, `grep`, `cat`, `head`, `tail`, `wc`, `sed`, `awk`, `rg`, `ag`) for file finding or inspecting file contents.
  - Mandatory tools for discovery & inspection: `codebase-memory-mcp` and `graphify`.
  - Use `view_file` when full file contents are needed.

## 3. Specialized MCP Tools Usage
- **`shadcn` & `shadcn-ui-mcp`**: Primary tools for shadcn components, themes, blocks, and registry discovery.
- **`animotion`**: Primary tool for 2D/3D CSS animations and micro-interactions.
- **`StitchMCP` / `stitchmcp`**: Screen generation and UI design systems.
- **`mobbin`**: Benchmark UX and modern application flow inspiration.
- **`chrome-devtools-mcp`**: Browser profiling, console error inspection, and live DOM debugging.
