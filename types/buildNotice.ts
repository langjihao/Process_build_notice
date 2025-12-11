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

// AI Agent Interface for AG-UI Protocol
export interface AIAgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIAgentState {
  messages: AIAgentMessage[];
  isProcessing: boolean;
  currentField?: keyof BuildNotice;
  suggestions: Partial<BuildNotice>;
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
  field?: keyof BuildNotice;
  value?: any;
  source: 'ui' | 'ai';
  timestamp: string;
}
