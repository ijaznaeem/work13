# IKMF Copilot Context Enhancement

This directory contains an MCP (Model Context Protocol) server and configuration files to enhance GitHub Copilot with IKMF Angular application-specific context.

## Overview

The MCP server provides GitHub Copilot with deep understanding of:

- Project structure and organization
- Angular patterns and conventions used in IKMF
- Component architecture and dependencies
- Routing structure and lazy loading patterns
- Service patterns and state management
- Technology stack and dependencies

## Files Structure

```
.copilot/
├── mcp-server.ts           # MCP server implementation
├── package.json            # MCP server dependencies
├── tsconfig.json          # TypeScript configuration
├── copilot-config.json    # Copilot configuration
├── conventions.md         # Project conventions and patterns
└── README.md             # This file
```

## Setup Instructions

### 1. Install Dependencies

```powershell
cd .copilot
npm install
```

### 2. Build the MCP Server

```powershell
npm run build
```

### 3. Configure VS Code

The following files are automatically configured:

- `.vscode/settings.json` - Copilot settings
- `.vscode/tasks.json` - Build and run tasks
- `.vscode/launch.json` - Debug configurations
- `.devcontainer/devcontainer.json` - Container setup

### 4. Start the MCP Server

Use VS Code tasks:

- `Ctrl+Shift+P` → "Tasks: Run Task" → "setup-copilot-context"
- Or run: `npm run start` in the `.copilot` directory

## MCP Server Capabilities

### Resources

- **Project Structure**: Detailed project organization and conventions
- **Angular Patterns**: Common patterns used in the IKMF application
- **Dependencies**: Technology stack and library purposes
- **Routing Structure**: Application routing and lazy loading patterns

### Tools

- **analyze-component**: Analyze Angular component structure and dependencies
- **suggest-architecture**: Get architectural recommendations for features
- **generate-module-structure**: Generate recommended structure for new modules

## Usage Examples

### Analyzing a Component

```typescript
// Copilot will understand component patterns like:
@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureComponent implements OnInit, OnDestroy {
  // Copilot knows about IKMF patterns and conventions
}
```

### Creating Services

```typescript
// Copilot will suggest IKMF service patterns:
@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private dataSubject = new BehaviorSubject<FeatureData[]>([]);
  public data$ = this.dataSubject.asObservable();

  // IKMF-specific patterns for HTTP services
}
```

### Module Generation

Ask Copilot to generate a new feature module, and it will follow IKMF conventions:

- Feature-based structure
- Lazy loading configuration
- Proper service organization
- Component architecture patterns

## Copilot Enhancement Features

### Context-Aware Suggestions

- Understands IKMF project structure
- Suggests appropriate file locations
- Follows naming conventions
- Implements established patterns

### Architecture Guidance

- Recommends smart/dumb component patterns
- Suggests proper service organization
- Guides routing and lazy loading setup
- Advises on state management patterns

### Code Quality

- Enforces TypeScript strict mode
- Suggests OnPush change detection
- Recommends proper subscription management
- Guides error handling patterns

## Troubleshooting

### MCP Server Not Starting

1. Check Node.js installation: `node --version`
2. Install dependencies: `npm install`
3. Build the server: `npm run build`
4. Check for TypeScript errors in output

### Copilot Not Using Context

1. Restart VS Code after setup
2. Check VS Code settings for Copilot configuration
3. Verify MCP server is running in task manager
4. Check VS Code output for MCP server logs

### TypeScript Compilation Errors

1. Ensure TypeScript is installed: `npm install -g typescript`
2. Check `tsconfig.json` configuration
3. Verify all dependencies are installed
4. Run `tsc --noEmit` to check for errors

## Development Commands

```powershell
# Install dependencies
npm install

# Build the MCP server
npm run build

# Start the MCP server
npm start

# Development mode with watch
npm run dev

# Run setup script
./setup-copilot.ps1
```

## VS Code Tasks

- **setup-copilot-context**: Full setup including dependencies and build
- **build-mcp-server**: Build the TypeScript MCP server
- **start-mcp-server**: Start the MCP server
- **install-mcp-dependencies**: Install npm dependencies

## Integration with VS Code

The MCP server integrates with VS Code through:

1. **Task Runner**: Automated build and execution
2. **Debug Configuration**: Debug the MCP server
3. **Copilot Settings**: Enhanced context awareness
4. **DevContainer**: Containerized development environment

## Updating Context

To update the project context:

1. Modify `conventions.md` with new patterns
2. Update `mcp-server.ts` with new tools or resources
3. Rebuild with `npm run build`
4. Restart the MCP server

## Benefits

### Enhanced Code Generation

- Context-aware component generation
- Proper service implementation
- Correct routing setup
- TypeScript best practices

### Improved Productivity

- Faster feature development
- Consistent code patterns
- Reduced setup time
- Better architecture decisions

### Quality Assurance

- Enforced conventions
- Pattern consistency
- Best practice recommendations
- Error prevention

## Support

For issues or questions:

1. Check the VS Code output panel for MCP server logs
2. Review the `conventions.md` file for patterns
3. Check task runner output for build errors
4. Verify Copilot configuration in VS Code settings
