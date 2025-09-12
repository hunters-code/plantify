# Plantify Frontend Structure

This document outlines the revamped folder structure for the Plantify frontend application.

## 📁 Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, etc.)
│   ├── layout/          # Layout components (Navbar, Footer, Layout)
│   ├── features/        # Feature-specific components (Hero, FeaturedStartups, etc.)
│   └── forms/           # Form components (when needed)
├── pages/               # Page components
│   ├── home/            # Home page
│   ├── auth/            # Authentication pages
│   ├── explore/         # Explore startups page
│   ├── register/        # Registration pages
│   │   ├── founder/     # Founder registration
│   │   └── investor/    # Investor registration
│   └── startup/         # Startup-related pages
│       ├── details/     # Startup details page
│       └── create/      # Create startup page
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   └── useStartups.js   # Startups data hook
├── lib/                 # Backend integration services
│   ├── backend.ts       # Backend service
│   ├── auth.ts          # Authentication service
│   └── index.ts         # Service exports
├── utils/               # Utility functions
│   ├── format.js        # Formatting utilities
│   └── validation.js    # Validation utilities
├── constants/           # Application constants
│   ├── routes.js        # Route definitions
│   └── startupSectors.js # Startup sector options
├── types/               # TypeScript type definitions (if needed)
└── declarations/        # DFINITY canister declarations
```

## 🎯 Key Improvements

### 1. **Organized Components**
- **UI Components**: Basic reusable components like Button, Input
- **Layout Components**: Navigation, Footer, Layout wrappers
- **Feature Components**: Business logic components like Hero, FeaturedStartups

### 2. **Structured Pages**
- **Home**: Landing page with all main sections
- **Auth**: Authentication pages
- **Explore**: Browse and discover startups
- **Register**: Separate flows for founders and investors
- **Startup**: Startup details and creation pages

### 3. **Custom Hooks**
- **useAuth**: Manages authentication state and operations
- **useStartups**: Handles startup data fetching and management

### 4. **Utility Functions**
- **Formatting**: Currency, dates, numbers, percentages
- **Validation**: Form validation helpers

### 5. **Constants**
- **Routes**: Centralized route definitions
- **Options**: Dropdown options and form choices

## 🚀 Usage Examples

### Importing Components
```javascript
import { Button, Navbar, Hero } from './components';
import { HomePage, StartupDetailsPage } from './pages';
```

### Using Hooks
```javascript
import { useAuth, useStartups } from './hooks';

function MyComponent() {
  const { isAuthenticated, signIn, signOut } = useAuth();
  const { startups, loading, createStartup } = useStartups();
  
  // Component logic
}
```

### Using Utilities
```javascript
import { formatCurrency, validateEmail } from './utils';

const price = formatCurrency(1000); // "$1,000"
const isValid = validateEmail('user@example.com'); // true
```

### Using Constants
```javascript
import { ROUTES, STARTUP_SECTORS } from './constants';

// Navigation
<Link to={ROUTES.REGISTER.FOUNDER}>Register as Founder</Link>

// Form options
<select>
  {STARTUP_SECTORS.map(sector => (
    <option key={sector.value} value={sector.value}>
      {sector.label}
    </option>
  ))}
</select>
```

## 🔄 Routing

The application uses React Router with the following routes:

- `/` - Home page
- `/auth` - Authentication
- `/explore` - Explore startups
- `/register/founder` - Founder registration
- `/register/investor` - Investor registration
- `/startup/:id` - Startup details
- `/startup/create` - Create startup

## 📦 Backend Integration

The `lib/` directory contains all backend integration services:

- **BackendService**: Handles all canister interactions
- **AuthService**: Manages Internet Identity authentication
- **Custom Hooks**: React hooks for easy integration

## 🎨 Component Organization

### UI Components (`components/ui/`)
Basic, reusable components that don't contain business logic.

### Layout Components (`components/layout/`)
Components that define the overall page structure.

### Feature Components (`components/features/`)
Components that contain specific business logic and features.

## 📝 Best Practices

1. **Import from index files** for cleaner imports
2. **Use custom hooks** for data fetching and state management
3. **Keep components focused** on single responsibilities
4. **Use utility functions** for common operations
5. **Define constants** for magic strings and repeated values
6. **Follow the established patterns** for consistency

This structure provides a scalable, maintainable foundation for the Plantify frontend application.
