# NPI Build Notice System (AG-UI Edition)

An AI-Native Manufacturing MVP implementing the AG-UI Protocol, where the User Interface and AI Agent share a single source of truth.

## 🚀 Features

### Core Functionality
- **Build Notice Form**: Comprehensive form for NPI (New Product Introduction) build notices
- **AI Co-pilot**: Natural language interface for form filling
- **AG-UI Protocol**: Unified state management between UI and AI
- **Real-time Validation**: Instant feedback on form field requirements
- **Form Auto-fill**: AI-powered field extraction from natural language

### Form Fields
- **Basic Information**: NPI Number, Part Number, Revision, Quantity, Description
- **Schedule**: Build Date, Required By Date
- **Location & Priority**: Assembly Location, Priority Level, Status
- **Additional Notes**: Free-form notes field

### AI Capabilities
The AI Co-pilot can understand natural language inputs like:
- "NPI-2024-001, Part ABC-123, Rev A, build 100 units by 2024-12-20"
- "Create build notice for part XYZ-456 revision B, quantity 50, urgent priority"
- "Assembly at Building 5, required by 2024-12-25"

## 🏗️ Architecture

### AG-UI Protocol Implementation
The system implements the AG-UI Protocol with:
1. **Single Source of Truth**: Unified state managed through `useAGUIState` hook
2. **Event-Driven Architecture**: All interactions emit AG-UI events
3. **Bidirectional Sync**: Changes from UI or AI update the shared state
4. **Real-time Validation**: Validation state synchronized across all components

### Key Components
- **BuildNoticeForm**: Main form component with all fields
- **AICopilot**: AI agent interface with natural language processing
- **FormFields**: Reusable form input components
- **useAGUIState**: Custom hook managing AG-UI protocol state

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (AG-UI Protocol)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### Using the Form (Manual Entry)
1. Fill in required fields marked with *
2. Select priority level and status
3. Add optional notes
4. Click "Submit Build Notice"

### Using the AI Co-pilot
1. Type or paste natural language description in the AI Co-pilot input
2. Press Enter or click "Send"
3. The AI will extract relevant information and suggest field values
4. Suggestions are automatically applied to the form
5. Review and adjust as needed
6. Submit the form

### Example Natural Language Inputs
```
NPI-2024-001, Part ABC-123, Rev A, build 100 units by 2024-12-20

Create build notice for part XYZ-456 revision B, quantity 50, urgent priority

Assembly at Building 5, required by 2024-12-25

Part DEF-789, Rev 1.0, qty 25, high priority, location Site 3
```

## 🔧 Development

### Project Structure
```
/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── BuildNoticeForm.tsx
│   ├── AICopilot.tsx
│   └── FormFields.tsx
├── lib/                   # Utilities and helpers
│   ├── useAGUIState.ts   # AG-UI state management hook
│   └── buildNoticeHelpers.ts
├── types/                 # TypeScript type definitions
│   └── buildNotice.ts
└── package.json
```

### Key Files
- **types/buildNotice.ts**: Data models and AG-UI event types
- **lib/buildNoticeHelpers.ts**: Validation and NLP helper functions
- **lib/useAGUIState.ts**: AG-UI Protocol state management
- **components/BuildNoticeForm.tsx**: Main form component
- **components/AICopilot.tsx**: AI agent interface

## 🎯 AG-UI Protocol

### State Management
The AG-UI Protocol ensures:
- ✅ **Unified Source of Truth**: Single state for UI and AI
- ✅ **Active AI Agent**: Real-time AI assistance
- ✅ **Real-time Sync**: Instant updates across all components

### Event Types
- `field_update`: Field value changes
- `ai_suggestion`: AI proposes field values
- `validation_check`: Form validation events
- `form_submit`: Form submission events
- `natural_language_input`: AI processes user input

## 📝 License

This project is part of an AI-Native Manufacturing MVP demonstration.

## 🤝 Contributing

This is a demonstration project for the AG-UI Protocol implementation.