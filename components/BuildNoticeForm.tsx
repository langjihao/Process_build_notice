'use client';

import React from 'react';
import { BuildNotice } from '@/types/buildNotice';
import { useAGUIState } from '@/lib/useAGUIState';
import { FormField, FormTextArea, FormSelect } from './FormFields';
import { AICopilot } from './AICopilot';

export function BuildNoticeForm() {
  const {
    buildNotice,
    validationState,
    aiState,
    updateField,
    processNaturalLanguage,
    applySuggestions,
    submitForm,
    resetForm,
  } = useAGUIState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitForm();

    if (result.success) {
      alert('Build Notice submitted successfully!');
      console.log('Submitted data:', result.data);
    } else {
      alert('Please fix validation errors before submitting.');
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'approved', label: 'Approved' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NPI Build Notice System
          </h1>
          <p className="text-gray-600">
            AI-Native Manufacturing MVP with AG-UI Protocol
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Build Notice Form</h2>

              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="NPI Number"
                      name="npiNumber"
                      value={buildNotice.npiNumber}
                      onChange={(value) => updateField('npiNumber', value)}
                      error={validationState.npiNumber?.error}
                      required
                      placeholder="e.g., NPI-2024-001"
                    />

                    <FormField
                      label="Part Number"
                      name="partNumber"
                      value={buildNotice.partNumber}
                      onChange={(value) => updateField('partNumber', value)}
                      error={validationState.partNumber?.error}
                      required
                      placeholder="e.g., ABC-123"
                    />

                    <FormField
                      label="Revision"
                      name="revision"
                      value={buildNotice.revision}
                      onChange={(value) => updateField('revision', value)}
                      error={validationState.revision?.error}
                      required
                      placeholder="e.g., A, B, 1.0"
                    />

                    <FormField
                      label="Quantity"
                      name="quantity"
                      type="number"
                      value={buildNotice.quantity}
                      onChange={(value) => updateField('quantity', parseInt(value) || 0)}
                      error={validationState.quantity?.error}
                      required
                      placeholder="e.g., 100"
                    />
                  </div>

                  <FormTextArea
                    label="Description"
                    name="description"
                    value={buildNotice.description}
                    onChange={(value) => updateField('description', value)}
                    error={validationState.description?.error}
                    required
                    placeholder="Describe the build notice..."
                    rows={3}
                  />
                </div>

                {/* Schedule Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Build Date"
                      name="buildDate"
                      type="date"
                      value={buildNotice.buildDate}
                      onChange={(value) => updateField('buildDate', value)}
                      error={validationState.buildDate?.error}
                      required
                    />

                    <FormField
                      label="Required By"
                      name="requiredBy"
                      type="date"
                      value={buildNotice.requiredBy}
                      onChange={(value) => updateField('requiredBy', value)}
                      error={validationState.requiredBy?.error}
                      required
                    />
                  </div>
                </div>

                {/* Location & Priority Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Location & Priority
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Assembly Location"
                      name="assemblyLocation"
                      value={buildNotice.assemblyLocation}
                      onChange={(value) => updateField('assemblyLocation', value)}
                      error={validationState.assemblyLocation?.error}
                      required
                      placeholder="e.g., Building 5, Floor 2"
                    />

                    <FormSelect
                      label="Priority"
                      name="priority"
                      value={buildNotice.priority}
                      onChange={(value) => updateField('priority', value)}
                      options={priorityOptions}
                      required
                    />

                    <FormSelect
                      label="Status"
                      name="status"
                      value={buildNotice.status}
                      onChange={(value) => updateField('status', value)}
                      options={statusOptions}
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Additional Notes
                  </h3>
                  <FormTextArea
                    label="Notes"
                    name="notes"
                    value={buildNotice.notes}
                    onChange={(value) => updateField('notes', value)}
                    placeholder="Any additional information..."
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    Submit Build Notice
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-semibold"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* AI Co-pilot Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AICopilot
                aiState={aiState}
                onProcessInput={processNaturalLanguage}
                onApplySuggestions={applySuggestions}
              />

              {/* AG-UI Protocol Status */}
              <div className="mt-6 bg-white border border-gray-300 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">AG-UI Protocol Status</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Source of Truth:</span>
                    <span className="font-semibold text-green-600">✓ Unified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Agent:</span>
                    <span className="font-semibold text-green-600">✓ Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Real-time Sync:</span>
                    <span className="font-semibold text-green-600">✓ Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
