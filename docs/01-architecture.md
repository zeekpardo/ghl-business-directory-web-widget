# Architecture

The Business Directory Widget is built with a modern Vue 3 + TypeScript architecture designed for iframe embedding and seamless communication with parent applications.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Parent Window (GHL)                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │                  Postmate Bridge                  │  │
│  └──────────────────▲────────────┬──────────────────┘  │
│                     │            │                      │
│                     │            │                      │
└─────────────────────┼────────────┼──────────────────────┘
                      │            │
                      │            ▼
┌─────────────────────┼────────────────────────────────────┐
│                     │      Widget (Vue App)              │
│                     │                                    │
│  ┌──────────────────▼────────────────────────────────┐  │
│  │               App.vue (Postmate Model)             │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │            Setting.vue (Main UI)            │  │  │
│  │  │  ┌─────────┐ ┌──────────┐ ┌─────────────┐  │  │  │
│  │  │  │Business │ │StyleView │ │  Preview    │  │  │  │
│  │  │  │   View  │ │          │ │             │  │  │  │
│  │  │  └─────────┘ └──────────┘ └─────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │     useTranspiler (Code Generation)         │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Configuration Input** → User modifies businesses/styles in UI
2. **State Management** → Changes update Vue reactive store
3. **Code Generation** → useTranspiler computes HTML/CSS/JS
4. **Parent Communication** → Postmate emits generated code
5. **Persistence** → Parent saves elementStore data

## Core Components

### App.vue
- Root component establishing Postmate connection
- Loads initial configuration from parent
- Wraps the main Setting component

### Setting.vue  
- Main UI container with sidebar navigation
- Manages active view state (Businesses/Styles/Preview)
- Handles overall layout and navigation

### Store Architecture
The application uses a composable-based store pattern with domain-specific modules:

```typescript
// src/store/index.ts - Main store aggregator
export default function useStore() {
  return {
    ...useBusinessStore(),
    ...useCategoryStore(), 
    ...useLocationStore(),
    ...useSettingsStore()
  }
}
```

### State Management Pattern
- **Reactive References**: All state uses Vue's `ref()` for reactivity
- **Computed Properties**: Derived state automatically updates
- **Watch Effects**: Triggers code generation on state changes
- **Persistence**: State automatically syncs to parent via Postmate

## Communication Layer

### Postmate Integration
```typescript
// Establish connection
const handshake = new Postmate.Model({})

// Emit code updates
parent.emit("code", {
  html: generatedHTML,
  js: generatedJS, 
  elementStore: currentState
})
```

### Environment Detection
The widget detects its runtime environment:
- **Preview Tab**: Development/testing mode
- **GHL Canvas**: Embedded in GoHighLevel
- **Live Website**: Deployed independently

## Code Generation Pipeline

1. **Data Collection**: Gather businesses, styles, and settings
2. **Template Processing**: Generate HTML from Vue templates
3. **Style Compilation**: Create inline CSS for portability
4. **JavaScript Generation**: Add interactive functionality
5. **Environment Optimization**: Optimize for target environment
6. **Output Emission**: Send to parent via Postmate

## Technology Stack

- **Vue 3**: Modern composition API framework
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tooling and HMR
- **Naive UI**: Component library for admin interface
- **Postmate**: Secure iframe communication
- **Tailwind CSS**: Utility-first CSS framework