import { BuildNotice, ValidationState } from '@/types/buildNotice';

// Initial empty Build Notice
export const initialBuildNotice: BuildNotice = {
  npiNumber: '',
  partNumber: '',
  revision: '',
  description: '',
  quantity: 0,
  buildDate: '',
  assemblyLocation: '',
  priority: 'medium',
  requiredBy: '',
  notes: '',
  status: 'draft',
};

// Validation rules
export const validateField = (
  field: keyof BuildNotice,
  value: any
): { isValid: boolean; error?: string } => {
  switch (field) {
    case 'npiNumber':
      if (!value || value.trim() === '') {
        return { isValid: false, error: 'NPI Number is required' };
      }
      return { isValid: true };

    case 'partNumber':
      if (!value || value.trim() === '') {
        return { isValid: false, error: 'Part Number is required' };
      }
      return { isValid: true };

    case 'revision':
      if (!value || value.trim() === '') {
        return { isValid: false, error: 'Revision is required' };
      }
      return { isValid: true };

    case 'description':
      if (!value || value.trim() === '') {
        return { isValid: false, error: 'Description is required' };
      }
      return { isValid: true };

    case 'quantity':
      if (value === undefined || value === null || value <= 0) {
        return { isValid: false, error: 'Quantity must be greater than 0' };
      }
      return { isValid: true };

    case 'buildDate':
      if (!value) {
        return { isValid: false, error: 'Build Date is required' };
      }
      return { isValid: true };

    case 'assemblyLocation':
      if (!value || value.trim() === '') {
        return { isValid: false, error: 'Assembly Location is required' };
      }
      return { isValid: true };

    case 'requiredBy':
      if (!value) {
        return { isValid: false, error: 'Required By date is required' };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
};

// Validate entire form
export const validateForm = (buildNotice: BuildNotice): ValidationState => {
  const validationState: ValidationState = {};
  const requiredFields: (keyof BuildNotice)[] = [
    'npiNumber',
    'partNumber',
    'revision',
    'description',
    'quantity',
    'buildDate',
    'assemblyLocation',
    'requiredBy',
  ];

  requiredFields.forEach((field) => {
    validationState[field] = validateField(field, buildNotice[field]);
  });

  return validationState;
};

// Check if form is valid
export const isFormValid = (validationState: ValidationState): boolean => {
  return Object.values(validationState).every((field) => field.isValid);
};

// Natural Language Processing helpers for AI Co-pilot
export const extractFieldsFromNaturalLanguage = (input: string): Partial<BuildNotice> => {
  const suggestions: Partial<BuildNotice> = {};
  const lowerInput = input.toLowerCase();

  // Extract NPI Number - more specific pattern
  const npiMatch = input.match(/npi[:\s#-]*([A-Z0-9]{3,}-[0-9]{4}-[0-9]{3}|[A-Z0-9-]{5,})/i);
  if (npiMatch) {
    suggestions.npiNumber = npiMatch[1].toUpperCase();
  }

  // Extract Part Number - more specific pattern
  const partMatch = input.match(/part(?:\s+number)?[:\s#-]*([A-Z]{2,}[0-9-]{2,})/i);
  if (partMatch) {
    suggestions.partNumber = partMatch[1].toUpperCase();
  }

  // Extract Revision
  const revMatch = input.match(/rev(?:ision)?[:\s]*([a-z0-9.]+)/i);
  if (revMatch) {
    suggestions.revision = revMatch[1].toUpperCase();
  }

  // Extract Quantity
  const qtyMatch = input.match(/(?:quantity|qty|build)[:\s]*(\d+)/i);
  if (qtyMatch) {
    suggestions.quantity = parseInt(qtyMatch[1], 10);
  }

  // Extract Priority
  if (lowerInput.includes('urgent') || lowerInput.includes('asap')) {
    suggestions.priority = 'urgent';
  } else if (lowerInput.includes('high priority')) {
    suggestions.priority = 'high';
  } else if (lowerInput.includes('low priority')) {
    suggestions.priority = 'low';
  }

  // Extract dates (simplified)
  const dateMatch = input.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    if (lowerInput.includes('required by') || lowerInput.includes('need by')) {
      suggestions.requiredBy = dateMatch[1];
    } else if (lowerInput.includes('build date')) {
      suggestions.buildDate = dateMatch[1];
    }
  }

  // Extract location
  const locationMatch = input.match(/(?:location|site|facility)[:\s]*([a-z0-9\s-]+?)(?:\s|$|,)/i);
  if (locationMatch) {
    suggestions.assemblyLocation = locationMatch[1].trim();
  }

  return suggestions;
};
