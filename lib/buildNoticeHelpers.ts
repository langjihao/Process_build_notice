import { BuildNoticeFormState, ValidationState } from '@/types/buildNotice';

// Generate unique BN number
export const generateBnNo = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BN-${timestamp}-${random}`;
};

// Initial empty Build Notice Form State
export const initialBuildNoticeFormState: BuildNoticeFormState = {
  // Section A: Basic Information
  bnNo: generateBnNo(),
  project: '',
  model: '',
  description: '',
  customer: '',
  customerPn: '',
  pcbPn: '',
  stage: '',
  buildQty: 0,
  buildDate: null,
  cimFile: '',
  remark: '',

  // Section B: Role Settings
  epe: '',
  sl: '',
  mpe: '',
  fw: '',
  rd: '',
  te: '',
  epm: '',
  mpm: '',
};

// Validation rules
export const validateField = (
  field: keyof BuildNoticeFormState,
  value: string | number | Date | null
): { isValid: boolean; error?: string } => {
  switch (field) {
    // Section A: Required fields
    case 'model':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'Model is required' };
      }
      return { isValid: true };

    case 'customer':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'Customer is required' };
      }
      return { isValid: true };

    case 'customerPn':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'Customer P/N is required' };
      }
      return { isValid: true };

    case 'pcbPn':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'PCB P/N (Hardware Version) is required' };
      }
      return { isValid: true };

    case 'stage':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'Stage is required' };
      }
      return { isValid: true };

    // Section B: Required role fields
    case 'epe':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'Electronics Project Engineer is required' };
      }
      return { isValid: true };

    case 'sl':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'System Lead is required' };
      }
      return { isValid: true };

    case 'mpe':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: 'Mechanical Project Engineer is required' };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
};

// Validate entire form
export const validateForm = (formState: BuildNoticeFormState): ValidationState => {
  const validationState: ValidationState = {};
  const requiredFields: (keyof BuildNoticeFormState)[] = [
    'model',
    'customer',
    'customerPn',
    'pcbPn',
    'stage',
    'epe',
    'sl',
    'mpe',
  ];

  requiredFields.forEach((field) => {
    validationState[field] = validateField(field, formState[field]);
  });

  return validationState;
};

// Check if form is valid
export const isFormValid = (validationState: ValidationState): boolean => {
  return Object.values(validationState).every((field) => field.isValid);
};

// Project data for auto-fill (mock data)
export interface ProjectData {
  model: string;
  customer: string;
}

export const projectDataMap: Record<string, ProjectData> = {
  'Project A': { model: 'Model-A1', customer: 'Customer Alpha' },
  'Project B': { model: 'Model-B2', customer: 'Customer Beta' },
  'Project C': { model: 'Model-C3', customer: 'Customer Gamma' },
};

// Get project data for auto-fill
export const getProjectData = (projectName: string): ProjectData | null => {
  return projectDataMap[projectName] || null;
};

// Natural Language Processing helpers for AI Co-pilot
export const extractFieldsFromNaturalLanguage = (input: string): Partial<BuildNoticeFormState> => {
  const suggestions: Partial<BuildNoticeFormState> = {};
  const lowerInput = input.toLowerCase();

  // Extract Project
  const projectMatch = input.match(/project[:\s]*([A-Za-z0-9\s-]+?)(?:\s|$|,)/i);
  if (projectMatch) {
    suggestions.project = projectMatch[1].trim();
  }

  // Extract Customer P/N
  const customerPnMatch = input.match(/customer\s*p[\/]?n[:\s]*([A-Z0-9-]+)/i);
  if (customerPnMatch) {
    suggestions.customerPn = customerPnMatch[1].toUpperCase();
  }

  // Extract PCB P/N
  const pcbPnMatch = input.match(/pcb\s*p[\/]?n[:\s]*([A-Z0-9-]+)/i);
  if (pcbPnMatch) {
    suggestions.pcbPn = pcbPnMatch[1].toUpperCase();
  }

  // Extract Stage
  const stagePatterns = ['evt', 'dvt', 'pvt', 'mp'];
  for (const stage of stagePatterns) {
    if (lowerInput.includes(stage)) {
      suggestions.stage = stage.toUpperCase();
      break;
    }
  }

  // Extract Build Quantity
  const qtyMatch = input.match(/(?:quantity|qty|build)[:\s]*(\d+)/i);
  if (qtyMatch) {
    suggestions.buildQty = parseInt(qtyMatch[1], 10);
  }

  // Extract dates (simplified)
  const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    suggestions.buildDate = new Date(dateMatch[1]);
  }

  return suggestions;
};
