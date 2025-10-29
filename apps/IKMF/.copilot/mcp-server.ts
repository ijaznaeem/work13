#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';

// MCP Server for IKMF Angular Application Context
class IKMFMCPServer {
  private server: Server;
  private projectRoot: string;

  constructor() {
    this.server = new Server(
      {
        name: 'ikmf-nx-context-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.projectRoot = process.cwd();
    this.setupHandlers();
  }

  private setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'file://project-structure',
          name: 'Project Structure',
          description: 'Angular Nx workspace structure and organization',
          mimeType: 'application/json',
        },
        {
          uri: 'file://angular-patterns',
          name: 'Angular Patterns',
          description: 'Common Angular patterns and conventions used in IKMF',
          mimeType: 'application/json',
        },
        {
          uri: 'file://dependencies',
          name: 'Dependencies',
          description: 'Project dependencies and their purposes',
          mimeType: 'application/json',
        },
        {
          uri: 'file://routing-structure',
          name: 'Routing Structure',
          description:
            'Application routing patterns and lazy loading structure',
          mimeType: 'application/json',
        },
      ],
    }));

    // Read specific resources
    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request) => {
        const { uri } = request.params;

        switch (uri) {
          case 'file://project-structure':
            return {
              contents: [
                {
                  uri,
                  mimeType: 'application/json',
                  text: JSON.stringify(this.getProjectStructure(), null, 2),
                },
              ],
            };

          case 'file://angular-patterns':
            return {
              contents: [
                {
                  uri,
                  mimeType: 'application/json',
                  text: JSON.stringify(this.getAngularPatterns(), null, 2),
                },
              ],
            };

          case 'file://dependencies':
            return {
              contents: [
                {
                  uri,
                  mimeType: 'application/json',
                  text: JSON.stringify(this.getDependencies(), null, 2),
                },
              ],
            };

          case 'file://routing-structure':
            return {
              contents: [
                {
                  uri,
                  mimeType: 'application/json',
                  text: JSON.stringify(this.getRoutingStructure(), null, 2),
                },
              ],
            };

          default:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Unknown resource: ${uri}`
            );
        }
      }
    );

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze-component',
          description: 'Analyze Angular component structure and dependencies',
          inputSchema: {
            type: 'object',
            properties: {
              componentPath: {
                type: 'string',
                description: 'Path to the Angular component file',
              },
            },
            required: ['componentPath'],
          },
        },
        {
          name: 'suggest-architecture',
          description:
            'Suggest architectural improvements based on current patterns',
          inputSchema: {
            type: 'object',
            properties: {
              feature: {
                type: 'string',
                description: 'Feature or module to analyze',
              },
            },
            required: ['feature'],
          },
        },
        {
          name: 'generate-module-structure',
          description: 'Generate recommended module structure for new features',
          inputSchema: {
            type: 'object',
            properties: {
              moduleName: {
                type: 'string',
                description: 'Name of the new module',
              },
              featureType: {
                type: 'string',
                enum: ['crud', 'dashboard', 'form', 'report'],
                description: 'Type of feature module',
              },
            },
            required: ['moduleName', 'featureType'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new McpError(ErrorCode.InvalidRequest, 'Missing arguments');
      }

      switch (name) {
        case 'analyze-component':
          return await this.analyzeComponent(args?.componentPath as string);

        case 'suggest-architecture':
          return await this.suggestArchitecture(args?.feature as string);

        case 'generate-module-structure':
          return await this.generateModuleStructure(
            args?.moduleName as string,
            args?.featureType as string
          );

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
      }
    });
  }

  private getProjectStructure() {
    return {
      projectType: 'Angular Application with Nx-like structure',
      architecture: {
        type: 'Feature-based modular architecture',
        layers: [
          'Presentation Layer (Components, Pages)',
          'Business Logic Layer (Services, Guards)',
          'Data Layer (Models, Factories)',
          'Shared Layer (Pipes, Utilities)',
        ],
      },
      structure: {
        'src/app': {
          'config/': 'Application configuration files',
          'factories/': 'Factory classes for object creation',
          'gaurds/': 'Route guards and authentication',
          'layouts/': 'Layout components (full, content)',
          'models/': 'TypeScript interfaces and models',
          'pages/': 'Feature pages and components',
          'pipes/': 'Custom Angular pipes',
          'services/': 'Business logic and HTTP services',
          'shared/': 'Shared components and utilities',
        },
        'src/assets': {
          'css/': 'Global CSS files',
          'data/': 'Static JSON data files',
          'fonts/': 'Font files',
          'i18n/': 'Internationalization files',
          'img/': 'Image assets',
          'sass/': 'SASS/SCSS files',
          'vendor/': 'Third-party assets',
        },
      },
      conventions: {
        naming: 'kebab-case for files, PascalCase for classes',
        styling: 'SCSS with component-specific styles',
        stateManagement: 'Service-based state management',
        routing: 'Feature-based lazy loading',
      },
    };
  }

  private getAngularPatterns() {
    return {
      componentPatterns: {
        'Smart/Dumb Components':
          'Container components handle logic, presentation components handle UI',
        'OnPush Change Detection': 'Used for performance optimization',
        'Input/Output Pattern':
          'Parent-child communication through @Input() and @Output()',
      },
      servicePatterns: {
        'Singleton Services': 'Provided in root for global state',
        'HTTP Interceptors': 'For authentication and error handling',
        'Factory Pattern': 'Used in factories/ directory for object creation',
      },
      routingPatterns: {
        'Lazy Loading': 'Feature modules loaded on demand',
        'Route Guards': 'Authentication and authorization checks',
        'Resolver Pattern': 'Pre-load data before route activation',
      },
      stateManagement: {
        'Service State': 'Services maintain component state',
        'Subject/BehaviorSubject': 'For reactive state management',
        'Local Storage': 'For persistent user preferences',
      },
    };
  }

  private getDependencies() {
    return {
      coreFramework: {
        '@angular/core': 'Angular framework core',
        '@angular/router': 'Routing functionality',
        '@angular/forms': 'Reactive and template-driven forms',
        '@angular/common': 'Common Angular directives and pipes',
      },
      ui: {
        '@ng-bootstrap/ng-bootstrap': 'Bootstrap components for Angular',
        'ngx-perfect-scrollbar': 'Custom scrollbar implementation',
        'ngx-spinner': 'Loading spinner component',
        'ngx-toastr': 'Toast notifications',
      },
      authentication: {
        '@auth0/angular-jwt': 'JWT token handling',
        'JWT handling': 'Token-based authentication',
      },
      utilities: {
        '@ngx-translate/core': 'Internationalization support',
        lodash: 'Utility functions',
        'chart.js': 'Chart and graph visualization',
        sweetalert2: 'Custom alert dialogs',
      },
      devDependencies: {
        typescript: 'TypeScript language support',
        karma: 'Test runner',
        '@angular/cli': 'Angular CLI tools',
      },
    };
  }

  private getRoutingStructure() {
    return {
      structure: 'Feature-based routing with lazy loading',
      patterns: {
        'App Routing': 'Main routing module with feature route definitions',
        'Feature Routing': 'Each feature has its own routing module',
        Guards: 'Authentication and role-based access control',
      },
      layouts: {
        FullLayoutComponent: 'Main application layout with navigation',
        ContentLayoutComponent: 'Simplified layout for specific pages',
      },
      guards: {
        AuthGuard: 'Protects routes requiring authentication',
        'Role Guards': 'Controls access based on user roles',
      },
    };
  }

  private async analyzeComponent(componentPath: string) {
    try {
      const fullPath = path.join(this.projectRoot, componentPath);

      if (!fs.existsSync(fullPath)) {
        return {
          content: [
            {
              type: 'text',
              text: `Component not found at path: ${componentPath}`,
            },
          ],
        };
      }

      const content = fs.readFileSync(fullPath, 'utf-8');

      const analysis = {
        file: componentPath,
        type: this.detectComponentType(content),
        dependencies: this.extractDependencies(content),
        inputs: this.extractInputs(content),
        outputs: this.extractOutputs(content),
        lifecycle: this.extractLifecycleHooks(content),
        suggestions: this.generateComponentSuggestions(content),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing component: ${
              error?.message || 'Unknown error'
            }`,
          },
        ],
      };
    }
  }

  private async suggestArchitecture(feature: string) {
    const suggestions = {
      feature,
      recommendations: {
        structure: `Create feature module for ${feature} with:
          - ${feature}.module.ts (Feature module)
          - ${feature}-routing.module.ts (Feature routing)
          - components/ (Feature components)
          - services/ (Feature services)
          - models/ (Feature models)`,
        patterns: [
          'Use lazy loading for the feature module',
          'Implement container/presentation component pattern',
          'Create dedicated service for business logic',
          'Use reactive forms for data input',
          'Implement proper error handling',
        ],
        testing: [
          'Unit tests for all components and services',
          'Integration tests for complex workflows',
          'E2E tests for critical user journeys',
        ],
      },
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(suggestions, null, 2),
        },
      ],
    };
  }

  private async generateModuleStructure(
    moduleName: string,
    featureType: string
  ) {
    type FeatureType = 'crud' | 'dashboard' | 'form' | 'report';

    const structures: Record<
      FeatureType,
      {
        components: string[];
        services: string[];
        models: string[];
        routing: string;
      }
    > = {
      crud: {
        components: [
          `${moduleName}-list`,
          `${moduleName}-detail`,
          `${moduleName}-form`,
        ],
        services: [`${moduleName}.service`, `${moduleName}-resolver.service`],
        models: [`${moduleName}.model`, `${moduleName}-filter.model`],
        routing: 'List -> Detail -> Form pattern',
      },
      dashboard: {
        components: [
          `${moduleName}-dashboard`,
          `${moduleName}-widget`,
          `${moduleName}-chart`,
        ],
        services: [
          `${moduleName}-data.service`,
          `${moduleName}-config.service`,
        ],
        models: [`${moduleName}-config.model`, `${moduleName}-data.model`],
        routing: 'Single dashboard route with nested components',
      },
      form: {
        components: [
          `${moduleName}-form`,
          `${moduleName}-step`,
          `${moduleName}-summary`,
        ],
        services: [
          `${moduleName}-form.service`,
          `${moduleName}-validation.service`,
        ],
        models: [`${moduleName}.model`, `${moduleName}-validation.model`],
        routing: 'Multi-step form with guards',
      },
      report: {
        components: [
          `${moduleName}-report`,
          `${moduleName}-filter`,
          `${moduleName}-export`,
        ],
        services: [
          `${moduleName}-report.service`,
          `${moduleName}-export.service`,
        ],
        models: [`${moduleName}-criteria.model`, `${moduleName}-result.model`],
        routing: 'Report with filter and export capabilities',
      },
    };

    const structure = structures[featureType as FeatureType] || structures.crud;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              moduleName,
              featureType,
              recommendedStructure: structure,
              files: this.generateFileList(moduleName, structure),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private detectComponentType(content: string): string {
    if (content.includes('@Component')) return 'Component';
    if (content.includes('@Directive')) return 'Directive';
    if (content.includes('@Pipe')) return 'Pipe';
    if (content.includes('@Injectable')) return 'Service';
    return 'Unknown';
  }

  private extractDependencies(content: string): string[] {
    const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
    const dependencies = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push(match[1]);
    }

    return dependencies;
  }

  private extractInputs(content: string): string[] {
    const inputRegex = /@Input\(\)\s+(\w+)/g;
    const inputs = [];
    let match;

    while ((match = inputRegex.exec(content)) !== null) {
      inputs.push(match[1]);
    }

    return inputs;
  }

  private extractOutputs(content: string): string[] {
    const outputRegex = /@Output\(\)\s+(\w+)/g;
    const outputs = [];
    let match;

    while ((match = outputRegex.exec(content)) !== null) {
      outputs.push(match[1]);
    }

    return outputs;
  }

  private extractLifecycleHooks(content: string): string[] {
    const hooks = [
      'ngOnInit',
      'ngOnDestroy',
      'ngOnChanges',
      'ngAfterViewInit',
      'ngAfterContentInit',
      'ngDoCheck',
      'ngAfterViewChecked',
    ];

    return hooks.filter((hook) => content.includes(hook));
  }

  private generateComponentSuggestions(content: string): string[] {
    const suggestions = [];

    if (!content.includes('OnPush')) {
      suggestions.push(
        'Consider using OnPush change detection for better performance'
      );
    }

    if (!content.includes('trackBy') && content.includes('*ngFor')) {
      suggestions.push('Add trackBy function to *ngFor for better performance');
    }

    if (!content.includes('async') && content.includes('subscribe')) {
      suggestions.push(
        'Consider using async pipe instead of manual subscriptions'
      );
    }

    return suggestions;
  }

  private generateFileList(moduleName: string, structure: any): string[] {
    const files = [
      `${moduleName}/${moduleName}.module.ts`,
      `${moduleName}/${moduleName}-routing.module.ts`,
    ];

    structure.components?.forEach((comp: string) => {
      files.push(`${moduleName}/components/${comp}/${comp}.component.ts`);
      files.push(`${moduleName}/components/${comp}/${comp}.component.html`);
      files.push(`${moduleName}/components/${comp}/${comp}.component.scss`);
      files.push(`${moduleName}/components/${comp}/${comp}.component.spec.ts`);
    });

    structure.services?.forEach((service: string) => {
      files.push(`${moduleName}/services/${service}.ts`);
    });

    structure.models?.forEach((model: string) => {
      files.push(`${moduleName}/models/${model}.ts`);
    });

    return files;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('IKMF MCP Server running on stdio');
  }
}

const server = new IKMFMCPServer();
server.run().catch(console.error);
