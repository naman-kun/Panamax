# Workspace Skills & Workflows Reference

## 1. Development & Verification Workflow
- **Rapid Iteration Mode (Default)**:
  - Trust Vite Hot Module Replacement (HMR) for all frontend UI adjustments, styling edits, and copy changes.
  - **Skip `npm run build`** on routine/minor changes to prevent unnecessary delays and terminal lockup.
- **Milestone Verification Mode**:
  - Run full build/typechecks (`npm run build`) **only** when completing major features, refactoring core engines/types, or modifying backend/simulation logic.

## 2. UI & Component Engineering Skill
- **Design Language**: Pure shadcn/ui neutral palette (`zinc-950`, `zinc-900`, `zinc-800`, `zinc-100`, `white`), Lucide icons, and Inter/Geist typography.
- **Animations**: Leverage `animotion` MCP for 2D/3D micro-animations, dropdown slots, and smooth transitions.
- **Aesthetic Standards**: Clean, mathematical, professional, zero unnecessary glow, and high readability.

## 3. Active MCP Server Capabilities
- **`shadcn-ui-mcp`**: Access to shadcn v4 source code, demos, blocks, and tweakcn themes.
- **`animotion`**: Access to animated keyframes, categories (text, card, fintech), and icon libraries.
- **`codebase-memory-mcp` & `graphify`**: Code intelligence, symbol search, graph traversal, and dependency path tracing.
