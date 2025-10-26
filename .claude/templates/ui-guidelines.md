# UI Guidelines Templates

> **Purpose**: Frontend framework-specific patterns, component standards, and styling conventions

## React + TypeScript Template
```markdown
# UI Guidelines & Standards - React + TypeScript
> **Purpose**: Frontend patterns, component standards, and styling conventions

## Component Architecture
- Use functional components with hooks
- Follow atomic design principles (atoms, molecules, organisms, templates, pages)
- Use TypeScript for type safety and better developer experience
- Prefer composition over inheritance

## Project Structure
```
src/
├── components/
│   ├── atoms/              # Basic building blocks (Button, Input, Text)
│   ├── molecules/          # Simple combinations (SearchBox, Card)
│   ├── organisms/          # Complex combinations (Header, Sidebar)
│   ├── templates/          # Page layouts
│   └── pages/              # Route components
├── hooks/                  # Custom React hooks
├── services/              # API clients and business logic
├── stores/                # State management (Context/Redux)
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── styles/                # Global styles and themes
```

## Component Guidelines

### Component Structure
```typescript
interface ComponentProps {
  // Props with proper TypeScript types
  title: string;
  isVisible?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  isVisible = true, 
  onClick, 
  children 
}) => {
  // Hooks at the top
  const [state, setState] = useState<string>('');
  
  // Event handlers
  const handleClick = useCallback((event: React.MouseEvent) => {
    onClick?.(event);
  }, [onClick]);
  
  // Early returns for conditional rendering
  if (!isVisible) return null;
  
  return (
    <div className="component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Component;
```

### Styling Approach
- **CSS Modules**: For component-scoped styles
- **Styled Components**: For dynamic styling with props
- **Tailwind CSS**: For utility-first CSS approach
- **CSS-in-JS**: Libraries like Emotion or styled-components

## State Management

### Local State (useState, useReducer)
```typescript
// Simple state
const [isLoading, setIsLoading] = useState<boolean>(false);

// Complex state with useReducer
type State = { count: number; step: number };
type Action = { type: 'increment' | 'decrement' | 'reset' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'reset': return { count: 0, step: 1 };
    default: throw new Error();
  }
};
```

### Global State (Context API)
```typescript
interface AppContextType {
  user: User | null;
  theme: 'light' | 'dark';
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

### Global State (Redux Toolkit)
```typescript
// Store slice
const userSlice = createSlice({
  name: 'user',
  initialState: { current: null as User | null, loading: false },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.current = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

// Async thunk
const fetchUser = createAsyncThunk('user/fetchUser', async (userId: string) => {
  const response = await api.getUser(userId);
  return response.data;
});
```

## Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Testing user interactions
- **E2E Tests**: Cypress or Playwright
- **Visual Regression**: Storybook + Chromatic

## Performance Optimization
- Use `React.memo` for pure components
- Use `useMemo` and `useCallback` for expensive computations
- Code splitting with `React.lazy` and `Suspense`
- Optimize bundle size with proper imports
```

## Angular Template
```markdown
# UI Guidelines & Standards - Angular
> **Purpose**: Frontend patterns, component standards, and styling conventions

## Component Architecture
- Use Angular standalone components (Angular 16+)
- Follow atomic design principles
- Use OnPush change detection strategy for performance
- Implement proper lifecycle hooks

## Project Structure
```
src/
├── app/
│   ├── core/               # Singleton services (guards, interceptors)
│   ├── shared/             # Shared components, directives, pipes
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication feature
│   │   ├── dashboard/     # Dashboard feature
│   │   └── profile/       # User profile feature
│   ├── layout/            # Layout components
│   └── models/            # TypeScript interfaces and types
├── assets/                # Static assets
├── environments/          # Environment configurations
└── styles/               # Global styles and themes
```

## Component Guidelines

### Standalone Component Structure
```typescript
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent implements OnInit, OnDestroy {
  @Input() user!: User;
  @Output() userSelected = new EventEmitter<User>();
  
  protected readonly destroy$ = new Subject<void>();
  
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly userService: UserService
  ) {}
  
  ngOnInit(): void {
    // Initialization logic
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onUserClick(): void {
    this.userSelected.emit(this.user);
  }
}
```

### Service Structure
```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/users';
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  
  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
```

## State Management

### Simple State (Services + BehaviorSubject)
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly currentUser$ = new BehaviorSubject<User | null>(null);
  private readonly isLoading$ = new BehaviorSubject<boolean>(false);
  
  readonly user$ = this.currentUser$.asObservable();
  readonly loading$ = this.isLoading$.asObservable();
  
  setUser(user: User | null): void {
    this.currentUser$.next(user);
  }
  
  setLoading(loading: boolean): void {
    this.isLoading$.next(loading);
  }
}
```

### Complex State (NgRx)
```typescript
// State interface
interface AppState {
  auth: AuthState;
  users: UsersState;
}

// Actions
const loadUsers = createAction('[Users] Load Users');
const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

// Reducer
const usersReducer = createReducer(
  initialState,
  on(loadUsers, (state) => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false
  }))
);

// Effects
@Injectable()
export class UsersEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map(users => loadUsersSuccess({ users })),
          catchError(error => of(loadUsersFailure({ error })))
        )
      )
    )
  );
}

// Selectors
const selectUsersState = (state: AppState) => state.users;
const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users
);
```

## Styling Guidelines
- Use Angular Material for UI components
- SCSS for styling with BEM methodology
- CSS custom properties for theming
- Responsive design with Angular Flex Layout

## Testing Strategy
- Unit tests with Jasmine and Karma
- Component testing with Angular Testing Utilities
- E2E tests with Protractor or Cypress
- Mock HTTP requests with HttpClientTestingModule

## Performance Optimization
- OnPush change detection strategy
- Track by functions for *ngFor
- Lazy loading for feature modules
- Preloading strategies for better UX
```

## Vue.js Template
```markdown
# UI Guidelines & Standards - Vue.js 3 + TypeScript
> **Purpose**: Frontend patterns, component standards, and styling conventions

## Component Architecture
- Use Vue 3 Composition API
- TypeScript for type safety
- Single File Components (SFC) with `<script setup>`
- Follow atomic design principles

## Project Structure
```
src/
├── components/
│   ├── base/              # Base/reusable components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── composables/           # Vue 3 composition functions
├── stores/                # Pinia stores
├── services/              # API services
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
├── views/                 # Route components
└── styles/                # Global styles
```

## Component Guidelines

### Composition API Component
```vue
<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="updateUser" :disabled="loading">
      {{ loading ? 'Updating...' : 'Update' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { User } from '@/types/user';
import { useUserStore } from '@/stores/user';

interface Props {
  userId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  userUpdated: [user: User];
}>();

const userStore = useUserStore();
const loading = ref(false);

const user = computed(() => userStore.getUserById(props.userId));

const updateUser = async () => {
  loading.value = true;
  try {
    const updatedUser = await userStore.updateUser(props.userId);
    emit('userUpdated', updatedUser);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  userStore.fetchUser(props.userId);
});
</script>

<style scoped lang="scss">
.user-profile {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  h2 {
    margin-top: 0;
    color: var(--primary-color);
  }
  
  button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
```

### Composable (Custom Hook)
```typescript
// composables/useUser.ts
import { ref, computed } from 'vue';
import type { User } from '@/types/user';
import { userApi } from '@/services/api';

export function useUser(userId: string) {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);
  
  const fetchUser = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      user.value = await userApi.getUser(userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    isLoading,
    hasError,
    fetchUser
  };
}
```

## State Management (Pinia)
```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { userApi } from '@/services/api';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false
  }),
  
  getters: {
    getUserById: (state) => (id: string) => 
      state.users.find(user => user.id === id),
    
    isAuthenticated: (state) => state.currentUser !== null
  },
  
  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        this.users = await userApi.getUsers();
      } finally {
        this.loading = false;
      }
    },
    
    async login(credentials: LoginCredentials) {
      const user = await userApi.login(credentials);
      this.currentUser = user;
      return user;
    }
  }
});
```

## Testing Strategy
- Unit tests with Vitest
- Component tests with Vue Test Utils
- E2E tests with Cypress
- Type checking with vue-tsc
```

## Svelte Template
```markdown
# UI Guidelines & Standards - Svelte + TypeScript
> **Purpose**: Frontend patterns, component standards, and styling conventions

## Component Architecture
- Use SvelteKit for full-stack development
- TypeScript for type safety
- Reactive statements for computed values
- Component composition over inheritance

## Project Structure
```
src/
├── lib/
│   ├── components/        # Reusable components
│   ├── stores/           # Svelte stores
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript definitions
├── routes/               # SvelteKit routes
├── app.html              # HTML template
└── app.scss              # Global styles
```

## Component Guidelines

### Svelte Component with TypeScript
```svelte
<!-- UserCard.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { User } from '$lib/types/user';
  
  export let user: User;
  export let editable = false;
  
  const dispatch = createEventDispatcher<{
    edit: User;
    delete: User;
  }>();
  
  $: fullName = `${user.firstName} ${user.lastName}`;
  
  function handleEdit() {
    dispatch('edit', user);
  }
  
  function handleDelete() {
    dispatch('delete', user);
  }
</script>

<div class="user-card">
  <h3>{fullName}</h3>
  <p>{user.email}</p>
  
  {#if editable}
    <div class="actions">
      <button on:click={handleEdit}>Edit</button>
      <button on:click={handleDelete}>Delete</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .user-card {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 1rem;
    
    .actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      
      button {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        
        &:first-child {
          background: #007bff;
          color: white;
        }
        
        &:last-child {
          background: #dc3545;
          color: white;
        }
      }
    }
  }
</style>
```

### Svelte Store
```typescript
// stores/user.ts
import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types/user';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

function createUserStore() {
  const { subscribe, set, update } = writable(initialState);
  
  return {
    subscribe,
    
    async fetchUsers() {
      update(state => ({ ...state, loading: true }));
      
      try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        update(state => ({ 
          ...state, 
          users, 
          loading: false, 
          error: null 
        }));
      } catch (error) {
        update(state => ({ 
          ...state, 
          loading: false, 
          error: error.message 
        }));
      }
    },
    
    addUser(user: User) {
      update(state => ({ 
        ...state, 
        users: [...state.users, user] 
      }));
    }
  };
}

export const userStore = createUserStore();

// Derived stores
export const userCount = derived(
  userStore,
  $userStore => $userStore.users.length
);
```

## Testing Strategy
- Unit tests with Vitest
- Component tests with @testing-library/svelte
- E2E tests with Playwright
- Type checking with svelte-check
```