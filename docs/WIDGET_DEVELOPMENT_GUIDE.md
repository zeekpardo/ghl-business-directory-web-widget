# Business Directory Widget - Development Guide

## Overview

The Business Directory Widget is a Vue 3 + TypeScript application designed to generate customizable business directory listings for GoHighLevel (GHL) funnels and websites. It operates as an iframe-embedded widget that communicates with the parent application using Postmate.

### Key Features
- 🎨 Visual editor for business listings and styles
- 🏢 Support for multiple business categories and locations  
- 🔄 Real-time code generation and preview
- 📱 Responsive design (mobile-first approach)
- 💾 State persistence between sessions
- 🚀 Zero external dependencies in generated code
- 🔌 Seamless GoHighLevel integration

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Documentation Structure

This guide is organized into focused sections for better maintainability:

### 📐 [Architecture](./01-architecture.md)
- System overview and data flow
- Component communication patterns
- Store architecture and state management
- Technology stack details

### 🚀 [Getting Started](./02-getting-started.md)  
- Prerequisites and installation
- Development environment setup
- Project structure overview
- Essential commands and workflows

### 🔌 [GoHighLevel Integration](./03-ghl-integration.md)
- Widget communication protocol
- State persistence and code emission
- Environment detection and optimization
- GHL-specific requirements and testing

### 🧩 [Component Structure](./04-components.md)
- Core component documentation
- Shared component library
- Communication patterns and best practices
- Performance optimizations

### ⚙️ [Code Generation](./05-code-generation.md)
- HTML/CSS/JS generation strategies
- Template optimization and responsive design
- Environment-aware code generation
- Validation and performance monitoring

### 🎨 [Customization Guide](./06-customization.md)
- Adding new business properties
- Styling customization and themes
- Custom button actions and layouts
- Display options and UI controls

### 🚀 [Deployment](./07-deployment.md)
- Local development and production builds
- GitHub Pages and custom hosting
- GoHighLevel integration steps
- Performance monitoring and troubleshooting

### ✨ [Best Practices](./08-best-practices.md)
- Code organization and DRY principles
- Performance optimization strategies
- Vue 3 and TypeScript best practices
- Security considerations and testing

### 🔄 [Environment Synchronization](./09-environment-sync.md)
- Cross-environment consistency system
- Preview/GHL/Live website synchronization
- Performance optimization per environment
- Validation and monitoring tools

### 🛠️ [Troubleshooting](./10-troubleshooting.md)
- Common issues and solutions
- Debug mode and error tracking
- GoHighLevel specific problems
- Performance and testing strategies

## Essential Commands Reference

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production  
npm run preview            # Preview production build
npm run type-check         # TypeScript validation

# Deployment
npm run deploy             # Deploy to GitHub Pages

# Testing & Quality
npm run lint               # Code linting
npm run format             # Code formatting
```

## Project Structure

```
src/
├── components/            # Vue components
│   ├── BusinessView.vue   # Business management
│   ├── StyleView.vue      # Styling configuration  
│   ├── Preview.vue        # Real-time preview
│   └── shared/            # Reusable components
├── composition/           # Composables
│   ├── useTranspiler.ts   # Code generation
│   └── usePostmate.ts     # Parent communication
├── store/                 # State management
│   ├── businesses.ts      # Business data
│   ├── categories.ts      # Category management
│   └── settings.ts        # UI settings
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── docs/                  # Numbered documentation files
```

## Core Data Models

```typescript
interface BusinessInterface {
  id: string;
  name: string;
  tagline?: string;
  image?: string;
  description?: string;
  contact?: BusinessContactInterface;
  categoryIds: string[];
  locationIds: string[];
  buttonAction?: string;
  featured?: boolean;
  popular?: boolean;
  rating?: number;
  priceRange?: string;
}
```

## Development Workflow

1. **Setup**: Clone repo and run `npm install`
2. **Development**: Use `npm run dev` for hot reload
3. **Testing**: Test in Preview tab and standalone
4. **Building**: Run `npm run build` for production
5. **Deployment**: Use `npm run deploy` for GitHub Pages

## Key Concepts

### State Management
- Reactive Vue 3 store with composables
- Automatic UI updates on state changes  
- Persistent state via Postmate communication

### Code Generation
- Real-time HTML/CSS/JS generation
- Environment-specific optimizations
- Inline styles for maximum portability

### Widget Communication
- Postmate for secure iframe messaging
- State persistence via elementStore
- Real-time code emission to parent

## Environment Contexts

The widget automatically optimizes for different deployment contexts:

- **Preview Tab**: Full debugging with validation warnings
- **GHL Canvas**: Performance optimized with forced layouts
- **Live Website**: Production optimized with minimal logging

## Getting Help

- **Issues**: Check [troubleshooting guide](./10-troubleshooting.md)
- **Development**: See [best practices](./08-best-practices.md)
- **Customization**: Follow [customization guide](./06-customization.md)
- **Community**: [GoHighLevel Community](https://community.gohighlevel.com/)

## Contributing

1. Follow existing code patterns and conventions
2. Add TypeScript types for new features  
3. Test thoroughly in widget and standalone contexts
4. Update documentation for significant changes
5. Ensure generated code remains portable

---

**Note**: This main guide provides an overview and navigation to detailed documentation. For comprehensive information on any topic, refer to the specific documentation files in this directory.