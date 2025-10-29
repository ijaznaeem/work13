# IKMF Angular Application - Development Conventions & Patterns

## Project Overview

This document defines the development conventions, architectural patterns, and best practices for the IKMF Angular application.

## Project Structure

### Directory Organization

```
src/app/
├── config/          # Application configuration files
├── factories/       # Factory classes for object creation
├── gaurds/         # Route guards and authentication (Note: should be 'guards')
├── layouts/        # Layout components (full, content)
├── models/         # TypeScript interfaces and models
├── pages/          # Feature pages and components
├── pipes/          # Custom Angular pipes
├── services/       # Business logic and HTTP services
└── shared/         # Shared components and utilities
```

### File Naming Conventions

- **Components**: `feature-name.component.ts` (kebab-case)
- **Services**: `feature-name.service.ts`
- **Models**: `feature-name.model.ts`
- **Guards**: `feature-name.guard.ts`
- **Pipes**: `feature-name.pipe.ts`
- **Modules**: `feature-name.module.ts`

### Class Naming Conventions

- **Components**: `FeatureNameComponent` (PascalCase)
- **Services**: `FeatureNameService`
- **Models**: `FeatureNameModel` or `IFeatureName` (interface)
- **Guards**: `FeatureNameGuard`
- **Pipes**: `FeatureNamePipe`

## Architectural Patterns

### Component Architecture

1. **Smart/Container Components**

   - Handle business logic and state management
   - Communicate with services
   - Pass data to dumb components via @Input()
   - Located in `pages/` directory

2. **Dumb/Presentation Components**
   - Handle only UI logic
   - Receive data via @Input()
   - Emit events via @Output()
   - Reusable across features
   - Located in `shared/components/`

### Service Patterns

1. **Singleton Services**

   - Provided in root for application-wide state
   - Authentication, configuration, global data

2. **Feature Services**

   - Scoped to specific features or modules
   - Handle feature-specific business logic

3. **HTTP Services**
   - Dedicated services for API communication
   - Implement error handling and retry logic
   - Use HttpInterceptors for common functionality

### State Management

1. **Service-Based State**

   - Use services with BehaviorSubject for reactive state
   - Implement state interfaces for type safety
   - Provide state accessor methods

2. **Local Component State**
   - Use for UI-only state that doesn't need sharing
   - Implement OnPush change detection where possible

### Routing Patterns

1. **Feature-Based Routing**

   - Each feature module has its own routing module
   - Implement lazy loading for performance
   - Use resolvers for data pre-loading

2. **Route Guards**
   - `AuthGuard` for authentication checks
   - Role-based guards for authorization
   - Dirty check guards for unsaved changes

## Technology Stack & Dependencies

### Core Framework

- **Angular 13+**: Main framework
- **TypeScript**: Primary language
- **RxJS**: Reactive programming
- **Angular Router**: Navigation and routing

### UI Components & Styling

- **ng-bootstrap**: Bootstrap components for Angular
- **SCSS**: Styling with component-specific styles
- **ngx-perfect-scrollbar**: Custom scrollbar implementation
- **ngx-spinner**: Loading indicators

### Authentication & Security

- **@auth0/angular-jwt**: JWT token handling
- **Custom AuthGuard**: Route protection
- **HTTP Interceptors**: Request/response handling

### Utilities & Tools

- **@ngx-translate/core**: Internationalization
- **ngx-toastr**: Notification system
- **lodash**: Utility functions
- **chart.js**: Data visualization
- **sweetalert2**: Enhanced alert dialogs

## Coding Standards

### TypeScript Standards

1. **Strict Mode**: Always use strict TypeScript compilation
2. **Type Safety**: Prefer interfaces over any types
3. **Null Safety**: Use proper null checking
4. **Access Modifiers**: Always specify public/private/protected

### Angular Best Practices

1. **OnPush Change Detection**: Use for performance optimization
2. **Async Pipe**: Prefer over manual subscription management
3. **TrackBy Functions**: Use with \*ngFor for performance
4. **Lazy Loading**: Implement for feature modules
5. **Error Handling**: Implement comprehensive error handling

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Input/Output**: Use for parent-child communication
3. **Lifecycle Hooks**: Implement only necessary hooks
4. **Template Syntax**: Use Angular template best practices

### Service Guidelines

1. **Dependency Injection**: Proper use of Angular DI
2. **Error Handling**: Implement try-catch and error operators
3. **Memory Management**: Proper subscription cleanup
4. **API Communication**: Consistent HTTP handling patterns

## Testing Standards

### Unit Testing

- **Jasmine/Karma**: Testing framework
- **Component Testing**: Test component logic and templates
- **Service Testing**: Test business logic and HTTP calls
- **Pipe Testing**: Test custom pipe transformations

### Test Organization

- **Arrange-Act-Assert**: Standard test structure
- **Mock Dependencies**: Use spies and mock objects
- **Test Coverage**: Aim for high coverage on critical paths

## Performance Guidelines

### Bundle Optimization

1. **Lazy Loading**: Load feature modules on demand
2. **Tree Shaking**: Remove unused code
3. **Code Splitting**: Split code into logical chunks

### Runtime Performance

1. **OnPush Strategy**: Reduce change detection cycles
2. **TrackBy Functions**: Optimize list rendering
3. **Async Pipe**: Automatic subscription management
4. **Virtual Scrolling**: For large lists

### Memory Management

1. **Subscription Cleanup**: Use takeUntil pattern
2. **Event Listener Cleanup**: Remove in ngOnDestroy
3. **Component Lifecycle**: Proper resource cleanup

## Security Guidelines

### Authentication

1. **JWT Tokens**: Secure token storage and handling
2. **Route Guards**: Protect sensitive routes
3. **HTTP Interceptors**: Add authentication headers

### Data Validation

1. **Input Validation**: Client and server-side validation
2. **Sanitization**: Prevent XSS attacks
3. **Type Safety**: Use TypeScript for compile-time safety

## Internationalization (i18n)

### Translation Structure

- **Language Files**: JSON format in `assets/i18n/`
- **Translation Keys**: Hierarchical dot notation
- **Lazy Loading**: Load translations on demand

### Implementation

- **ngx-translate**: Primary translation library
- **Translation Pipe**: Use in templates
- **Service Integration**: Programmatic translations

## Documentation Standards

### Code Documentation

1. **JSDoc Comments**: Document public APIs
2. **README Files**: Feature and module documentation
3. **Type Definitions**: Comprehensive interface documentation

### Architecture Documentation

1. **Feature Documentation**: Document complex features
2. **API Documentation**: Document service interfaces
3. **Deployment Guides**: Environment-specific instructions

## Development Workflow

### Git Conventions

1. **Branch Naming**: `feature/feature-name`, `bugfix/issue-description`
2. **Commit Messages**: Conventional commit format
3. **Pull Requests**: Required for all changes

### Development Process

1. **Feature Branches**: Develop features in isolation
2. **Code Review**: Mandatory peer review
3. **Testing**: Unit and integration tests required

### Build & Deployment

1. **Build Optimization**: Production builds with optimization
2. **Environment Configuration**: Environment-specific settings
3. **Continuous Integration**: Automated testing and deployment

## Migration & Upgrade Guidelines

### Angular Updates

1. **Angular Update Guide**: Follow official upgrade path
2. **Dependency Updates**: Update packages incrementally
3. **Breaking Changes**: Document and communicate changes

### Legacy Code

1. **Gradual Migration**: Incremental improvements
2. **Pattern Consistency**: Apply new patterns consistently
3. **Technical Debt**: Regular cleanup and refactoring

## Common Patterns & Examples

### Service Implementation

```typescript
@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private dataSubject = new BehaviorSubject<FeatureData[]>([]);
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadData(): Observable<FeatureData[]> {
    return this.http.get<FeatureData[]>('/api/feature').pipe(
      tap((data) => this.dataSubject.next(data)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Service error:', error);
    return throwError(() => error);
  }
}
```

### Component Implementation

```typescript
@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureComponent implements OnInit, OnDestroy {
  @Input() data: FeatureData[];
  @Output() itemSelected = new EventEmitter<FeatureData>();

  private destroy$ = new Subject<void>();

  constructor(
    private featureService: FeatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.featureService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.data = data;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onItemClick(item: FeatureData): void {
    this.itemSelected.emit(item);
  }

  trackByFn(index: number, item: FeatureData): any {
    return item.id;
  }
}
```

### Guard Implementation

```typescript
@Injectable({
  providedIn: 'root',
})
export class FeatureGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
```

## Tools & Extensions

### Recommended VS Code Extensions

- **Angular Language Service**: Angular template support
- **Prettier**: Code formatting
- **ESLint**: Code linting
- **GitLens**: Git integration
- **Auto Rename Tag**: HTML tag renaming
- **Bracket Pair Colorizer**: Visual bracket matching

### Development Tools

- **Angular CLI**: Project scaffolding and build tools
- **Angular DevTools**: Browser debugging extension
- **Augury**: Angular debugging (legacy)
- **Webpack Bundle Analyzer**: Bundle analysis

This conventions document should be regularly updated as the project evolves and new patterns emerge.
