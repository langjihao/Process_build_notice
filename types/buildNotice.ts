// Build Notice data model following AG-UI Protocol
export interface BuildNotice {
  id?: string;
  npiNumber: string;
  partNumber: string;
  revision: string;
  description: string;
  quantity: number;
  buildDate: string;
  assemblyLocation: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requiredBy: string;
  notes: string;
  status: 'draft' | 'submitted' | 'approved' | 'in-progress' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

// Build Notice Form State interface with specific fields
export interface BuildNoticeFormState {
  // Section A: Basic Information
  bnNo: string;            // System generated ID, Read-only
  project: string;         // Select/Input, Trigger for auto-fill
  model: string;           // Required, auto-filled based on Project
  description: string;     // Textarea
  customer: string;        // Required, auto-filled based on Project
  customerPn: string;      // Required
  pcbPn: string;           // Required, Hardware Version
  stage: string;           // Required, e.g., EVT, DVT
  buildQty: number;        // Input
  buildDate: Date | null;  // DatePicker
  cimFile: string;         // File input placeholder
  remark: string;          // Textarea

  // Section B: Role Settings (8 Specific Roles)
  epe: string;             // Electronics Project Engineer, Required
  sl: string;              // System Lead, Required
  mpe: string;             // Mechanical Project Engineer, Required
  fw: string;              // Firmware Engineer
  rd: string;              // R&D Engineer
  te: string;              // Test Engineer
  epm: string;             // Engineering PM
  mpm: string;             // Manufacturing PM
}

// AI Agent Interface for AG-UI Protocol
export interface AIAgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIAgentState {
  messages: AIAgentMessage[];
  isProcessing: boolean;
  currentField?: keyof BuildNoticeFormState;
  suggestions: Partial<BuildNoticeFormState>;
}

// Form validation state
export interface ValidationState {
  [key: string]: {
    isValid: boolean;
    error?: string;
  };
}

// AG-UI Protocol Event Types
export type AGUIEventType = 
  | 'field_update'
  | 'ai_suggestion'
  | 'validation_check'
  | 'form_submit'
  | 'natural_language_input';

export interface AGUIEvent {
  type: AGUIEventType;
  field?: keyof BuildNoticeFormState;
  value?: string | number | Date | Partial<BuildNoticeFormState> | ValidationState;
  source: 'ui' | 'ai';
  timestamp: string;
}
