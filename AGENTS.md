# Workspace Agent Rules

## STRICT MANDATE: Use MCP Tools (graphify & codebase-memory-mcp) For File Finding & Content Inspection

### 1. ABSOLUTE RESTRICTION ON TERMINAL / BASH COMMANDS
You MUST NEVER use bash or terminal commands (`find`, `ls`, `grep`, `cat`, `head`, `tail`, `wc`, `sed`, `awk`, `rg`, `ag`, or any shell script / `run_command` invocations) for:
1. Finding files or directories in the codebase.
2. Checking repository structure, file hierarchies, or directory trees.
3. Searching for code patterns, symbols, function definitions, classes, or routes.
4. Inspecting, displaying, or reading what is in any file.

Using shell commands for file discovery or file content inspection is STRICTLY FORBIDDEN.

### 2. MANDATORY TOOLS FOR CODEBASE DISCOVERY & INSPECTION
Always use the dedicated MCP tools instead of terminal commands:

#### A. `codebase-memory-mcp` (Primary Code Intelligence)
- `search_graph`: Discover functions, classes, interfaces, routes, methods, and variables by name, pattern, or natural language / semantic query.
- `search_code`: Graph-augmented code search for text patterns ranked by structural importance.
- `get_code_snippet`: Read source code for any function, class, or symbol.
- `trace_path`: Trace transitive callers, callees, dependencies, and data flow.
- `get_architecture`: Inspect high-level architecture, module clusters, boundaries, and folder structure.
- `query_graph`: Execute Cypher queries for complex code patterns and relationships.
- `check_index_coverage`: Verify indexing coverage metadata for files.

#### B. `graphify` MCP (Knowledge Graph & Graph Traversal)
- `query_graph`: Run Cypher/graph queries to understand file and module relationships.
- `get_node`: Retrieve detailed node metadata, file relationships, and definitions.
- `get_neighbors`: Explore inward and outward dependencies, imports, and connections between files and symbols.
- `get_community`: Inspect architectural clusters and cohesive modules.
- `god_nodes`: Identify core orchestrators and central files in the project.

#### C. Reading Complete Files
- When full file contents are needed and not covered by MCP symbol snippets, use the dedicated native tool `view_file`. NEVER use shell commands (`cat`, `head`, `tail`, `more`, `less`, `awk`, `sed`) to read files.

## 3. PROACTIVE MCP USAGE PROTOCOL ACROSS ALL DOMAINS
Whenever working on this project, actively leverage the specialized MCP servers:

- **`codebase-memory-mcp` & `graphify`**: Mandatory for all codebase discovery, finding files/symbols, tracing dependencies, understanding architecture, and code inspection.
- **`shadcn` & `shadcn-ui-mcp`**: Use for finding, auditing, and generating shadcn/ui components, v4 component source code, blocks, tweakcn themes, demos, and registries.
- **`StitchMCP` / `stitchmcp`**: Use for screen generation, UI layouts, screen variants, and design system creation.
- **`mobbin`**: Use for UX inspiration, real-world screen benchmarks, and onboarding/checkout/dashboard flow patterns.
- **`chrome-devtools-mcp`**: Use for browser testing, inspecting DOM, validating visual layouts, debugging console errors, and profiling performance.
- **`visualization`**: Use whenever presenting tabular data, metric distributions, or analytical charts.
- **`notebooks`**: Use whenever working with Jupyter notebooks, notebook cells, or interactive data tasks.

## 4. BUILD & VERIFICATION EXECUTION POLICY
- **NO `npm run build` on small/minor changes**: Do NOT run `npm run build` after making small edits, routine styling tweaks, copy updates, or UI refinements. The local dev server (`npm run dev`) hot-reloads instantly via Vite HMR.
- **Restricted build triggers**: Run `npm run build` ONLY when executing major multi-file architectural refactors, installing new core packages, or making heavy backend/simulation engine changes.


