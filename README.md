# Business Directory Widget

A Vue 3 + TypeScript widget for generating customizable business directory listings for GoHighLevel funnels and websites.

## Quick Start

```bash
npm install
npm run dev
```

## 📚 Documentation

For comprehensive documentation, see the **[Widget Development Guide](./docs/WIDGET_DEVELOPMENT_GUIDE.md)**.

### Key Documentation:

- **[Getting Started](./docs/02-getting-started.md)** - Setup and development workflow
- **[Architecture](./docs/01-architecture.md)** - System overview and design
- **[GoHighLevel Integration](./docs/03-ghl-integration.md)** - GHL-specific guidance  
- **[Customization](./docs/06-customization.md)** - Adding features and theming
- **[Deployment](./docs/07-deployment.md)** - Production deployment guide
- **[Troubleshooting](./docs/10-troubleshooting.md)** - Common issues and solutions

## Key Features

- 🎨 Visual editor for business listings and styles
- 🏢 Support for multiple business categories and locations  
- 🔄 Real-time code generation and preview
- 📱 Responsive design (mobile-first approach)
- 💾 State persistence between sessions
- 🚀 Zero external dependencies in generated code
- 🔌 Seamless GoHighLevel integration

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview build
npm run deploy     # Deploy to GitHub Pages
```

## Project Structure

```
docs/                           # Comprehensive documentation
├── WIDGET_DEVELOPMENT_GUIDE.md # Main development guide
├── 01-architecture.md          # System design
├── 02-getting-started.md       # Setup guide
├── 03-ghl-integration.md       # GoHighLevel integration
├── 04-components.md            # Component documentation
├── 05-code-generation.md       # Code generation details
├── 06-customization.md         # Customization guide
├── 07-deployment.md            # Deployment guide
├── 08-best-practices.md        # Development best practices
├── 09-environment-sync.md      # Cross-environment consistency
└── 10-troubleshooting.md       # Common issues & solutions

src/
├── components/                 # Vue components
├── composition/                # Composables (useTranspiler, usePostmate)
├── store/                      # State management
├── types/                      # TypeScript definitions
└── utils/                      # Utility functions
```