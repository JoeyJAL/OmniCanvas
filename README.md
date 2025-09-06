# OmniCanvas - 無界創意畫布

AI-powered creative canvas platform for digital art, design, and multi-modal content creation.

## Features

### ✅ Core Canvas Features (Alpha)
- **Drawing Tools**: Brush, Pencil, Eraser with adjustable size and color
- **Shape Tools**: Rectangle, Circle (planned)
- **Text Tool**: Add and edit text (planned)
- **Layer Management**: Create, delete, hide/show, lock layers
- **History**: Unlimited undo/redo functionality
- **Import/Export**: Import images, export as PNG/JPG
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Z` - Undo
  - `Ctrl/Cmd + Y` - Redo
  - `Ctrl/Cmd + A` - Select All
  - `Delete/Backspace` - Delete selected objects
  - Tool shortcuts: `V` (Select), `B` (Brush), `P` (Pencil), etc.

### 🔄 Planned Features
- **AI Integration**: 
  - Google AI Studio for text-to-image generation
  - Image editing and style transfer
  - Fal.ai for advanced visual effects
  - ElevenLabs for voice generation
- **Advanced Tools**: 3D objects, animations, music generation
- **Collaboration**: Real-time editing, project sharing

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Canvas**: Fabric.js for 2D graphics manipulation
- **UI**: Tailwind CSS + Lucide React icons
- **State Management**: Zustand
- **Color Picker**: react-colorful

## Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── canvas/          # Canvas component with Fabric.js
│   ├── toolbar/         # Drawing tools and controls
│   ├── panels/          # Layer and properties panels
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── services/            # API services (AI integration)
└── styles/              # Global styles
```

## Canvas Controls

### Drawing Tools
- **Select (V)**: Select and manipulate objects
- **Brush (B)**: Freehand drawing with pressure sensitivity
- **Pencil (P)**: Precise line drawing
- **Eraser (E)**: Remove parts of drawings
- **Rectangle (R)**: Draw rectangular shapes
- **Circle (C)**: Draw circular shapes
- **Text (T)**: Add text elements
- **Pan (H)**: Navigate around the canvas

### Properties Panel
- Adjust brush size (1-100px)
- Color picker with hex input
- Layer opacity control (planned)
- Tool-specific settings

### Layer Management
- Create/delete layers
- Show/hide layers
- Lock layers for protection
- Drag to reorder (planned)

## Roadmap

### Phase 1 - Alpha (Current)
- [x] Basic drawing tools and canvas
- [x] Layer management
- [x] Import/export functionality
- [x] Undo/redo system

### Phase 2 - Beta
- [ ] Google AI Studio integration
- [ ] Text-to-image generation
- [ ] Basic image editing tools
- [ ] Template library

### Phase 3 - V1.0
- [ ] Multi-modal AI integrations
- [ ] Advanced editing features
- [ ] User accounts and cloud storage
- [ ] Community sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is in development. License TBD.