'use client';

import { useState, useCallback } from 'react';
import { BuildNotice, AIAgentState, AGUIEvent, ValidationState } from '@/types/buildNotice';
import {
  initialBuildNotice,
  validateField,
  validateForm,
  extractFieldsFromNaturalLanguage,
} from '@/lib/buildNoticeHelpers';

/**
 * AG-UI Protocol State Hook
 * Maintains single source of truth between UI and AI Agent
 */
export function useAGUIState() {
  // Shared state - single source of truth
  const [buildNotice, setBuildNotice] = useState<BuildNotice>(initialBuildNotice);
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
    (field: keyof BuildNotice, value: any, source: 'ui' | 'ai' = 'ui') => {
      setBuildNotice((prev) => {
        const updated = { ...prev, [field]: value };
        return updated;
      });

      // Validate field
      const validation = validateField(field, value);
      setValidationState((prev) => ({
        ...prev,
        [field]: validation,
      }));

      // Emit event
      emitEvent({
        type: 'field_update',
        field,
        value,
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
    (suggestions: Partial<BuildNotice>) => {
      Object.entries(suggestions).forEach(([field, value]) => {
        updateField(field as keyof BuildNotice, value, 'ai');
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
    const validation = validateForm(buildNotice);
    setValidationState(validation);

    emitEvent({
      type: 'validation_check',
      value: validation,
      source: 'ui',
    });

    return validation;
  }, [buildNotice, emitEvent]);

  // Submit form
  const submitForm = useCallback(() => {
    const validation = validateAll();
    const isValid = Object.values(validation).every((field) => field.isValid);

    if (isValid) {
      const submittedNotice = {
        ...buildNotice,
        status: 'submitted' as const,
        updatedAt: new Date().toISOString(),
      };

      setBuildNotice(submittedNotice);

      emitEvent({
        type: 'form_submit',
        value: submittedNotice,
        source: 'ui',
      });

      return { success: true, data: submittedNotice };
    }

    return { success: false, errors: validation };
  }, [buildNotice, validateAll, emitEvent]);

  // Reset form
  const resetForm = useCallback(() => {
    setBuildNotice(initialBuildNotice);
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
    buildNotice,
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
