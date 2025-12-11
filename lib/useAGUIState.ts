'use client';

import { useState, useCallback } from 'react';
import { BuildNoticeFormState, AIAgentState, AGUIEvent, ValidationState } from '@/types/buildNotice';
import {
  initialBuildNoticeFormState,
  generateBnNo,
  validateField,
  validateForm,
  extractFieldsFromNaturalLanguage,
  getProjectData,
} from '@/lib/buildNoticeHelpers';

/**
 * AG-UI Protocol State Hook
 * Maintains single source of truth between UI and AI Agent
 */
export function useAGUIState() {
  // Shared state - single source of truth
  const [formState, setFormState] = useState<BuildNoticeFormState>(initialBuildNoticeFormState);
  const [validationState, setValidationState] = useState<ValidationState>({});
  const [aiState, setAIState] = useState<AIAgentState>({
    messages: [],
    isProcessing: false,
    suggestions: {},
  });
  const [events, setEvents] = useState<AGUIEvent[]>([]);

  // Emit AG-UI event
  const emitEvent = useCallback((event: Omit<AGUIEvent, 'timestamp'>) => {
    const fullEvent: AGUIEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, fullEvent]);
  }, []);

  // Update field (from UI or AI)
  const updateField = useCallback(
    (field: keyof BuildNoticeFormState, value: string | number | Date | null, source: 'ui' | 'ai' = 'ui') => {
      setFormState((prev) => {
        const updated = { ...prev, [field]: value };
        
        // Auto-fill model and customer when project changes
        if (field === 'project' && typeof value === 'string') {
          const projectData = getProjectData(value);
          if (projectData) {
            updated.model = projectData.model;
            updated.customer = projectData.customer;
          }
        }
        
        return updated;
      });

      // Validate field if it's a required field
      const validation = validateField(field, value);
      setValidationState((prev) => ({
        ...prev,
        [field]: validation,
      }));

      // Emit event
      emitEvent({
        type: 'field_update',
        field,
        value: value instanceof Date ? value.toISOString() : value ?? '',
        source,
      });
    },
    [emitEvent]
  );

  // Process natural language input
  const processNaturalLanguage = useCallback(
    (input: string) => {
      setAIState((prev) => ({
        ...prev,
        isProcessing: true,
        messages: [
          ...prev.messages,
          {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      // Extract suggestions from natural language
      const suggestions = extractFieldsFromNaturalLanguage(input);

      // Update AI state with suggestions
      setAIState((prev) => ({
        ...prev,
        isProcessing: false,
        suggestions,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: `I've extracted the following information: ${Object.keys(suggestions).join(', ')}`,
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      // Emit event
      emitEvent({
        type: 'natural_language_input',
        value: input,
        source: 'ai',
      });

      return suggestions;
    },
    [emitEvent]
  );

  // Apply AI suggestions
  const applySuggestions = useCallback(
    (suggestions: Partial<BuildNoticeFormState>) => {
      Object.entries(suggestions).forEach(([field, value]) => {
        updateField(field as keyof BuildNoticeFormState, value as string | number | Date | null, 'ai');
      });

      setAIState((prev) => ({
        ...prev,
        suggestions: {},
      }));

      emitEvent({
        type: 'ai_suggestion',
        value: suggestions,
        source: 'ai',
      });
    },
    [updateField, emitEvent]
  );

  // Validate all fields
  const validateAll = useCallback(() => {
    const validation = validateForm(formState);
    setValidationState(validation);

    emitEvent({
      type: 'validation_check',
      value: validation,
      source: 'ui',
    });

    return validation;
  }, [formState, emitEvent]);

  // Submit form
  const submitForm = useCallback(() => {
    const validation = validateAll();
    const isValid = Object.values(validation).every((field) => field.isValid);

    if (isValid) {
      emitEvent({
        type: 'form_submit',
        value: formState,
        source: 'ui',
      });

      return { success: true, data: formState };
    }

    return { success: false, errors: validation };
  }, [formState, validateAll, emitEvent]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState({
      ...initialBuildNoticeFormState,
      bnNo: generateBnNo(), // Generate new BN number on reset
    });
    setValidationState({});
    setAIState({
      messages: [],
      isProcessing: false,
      suggestions: {},
    });
    setEvents([]);
  }, []);

  return {
    // State
    formState,
    validationState,
    aiState,
    events,

    // Actions
    updateField,
    processNaturalLanguage,
    applySuggestions,
    validateAll,
    submitForm,
    resetForm,
  };
}
