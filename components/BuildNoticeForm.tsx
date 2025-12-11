'use client';

import React from 'react';
import { BuildNoticeFormState } from '@/types/buildNotice';
import { useAGUIState } from '@/lib/useAGUIState';
import { FormField, FormTextArea, FormSelect } from './FormFields';
import { AICopilot } from './AICopilot';
import { projectDataMap } from '@/lib/buildNoticeHelpers';

export function BuildNoticeForm() {
  const {
    formState,
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

  const projectOptions = [
    { value: '', label: 'Select Project' },
    ...Object.keys(projectDataMap).map((project) => ({
      value: project,
      label: project,
    })),
  ];

  const stageOptions = [
    { value: '', label: 'Select Stage' },
    { value: 'EVT', label: 'EVT (Engineering Validation Test)' },
    { value: 'DVT', label: 'DVT (Design Validation Test)' },
    { value: 'PVT', label: 'PVT (Production Validation Test)' },
    { value: 'MP', label: 'MP (Mass Production)' },
  ];

  // Helper for updating fields with proper typing
  const handleFieldUpdate = (field: keyof BuildNoticeFormState) => (value: string | number) => {
    updateField(field, value);
  };

  // Helper for handling numeric fields safely
  const handleNumericChange = (field: keyof BuildNoticeFormState) => (value: string | number) => {
    const numValue = typeof value === 'number' ? value : parseInt(value, 10);
    updateField(field, isNaN(numValue) ? 0 : numValue);
  };

  // Helper for handling date field
  const handleDateChange = (value: string | number) => {
    const strValue = String(value);
    updateField('buildDate', strValue ? new Date(strValue) : null);
  };

  // Format date for input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date instanceof Date ? date.toISOString().split('T')[0] : '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Build Notice System
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
                {/* Section A: Basic Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Section A: Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="BN No."
                      name="bnNo"
                      value={formState.bnNo}
                      onChange={() => {}}
                      placeholder="System generated"
                      readOnly
                    />

                    <FormSelect
                      label="Project"
                      name="project"
                      value={formState.project}
                      onChange={handleFieldUpdate('project')}
                      options={projectOptions}
                      error={validationState.project?.error}
                    />

                    <FormField
                      label="Model"
                      name="model"
                      value={formState.model}
                      onChange={handleFieldUpdate('model')}
                      error={validationState.model?.error}
                      required
                      placeholder="Auto-filled based on Project"
                    />

                    <FormField
                      label="Customer"
                      name="customer"
                      value={formState.customer}
                      onChange={handleFieldUpdate('customer')}
                      error={validationState.customer?.error}
                      required
                      placeholder="Auto-filled based on Project"
                    />

                    <FormField
                      label="Customer P/N"
                      name="customerPn"
                      value={formState.customerPn}
                      onChange={handleFieldUpdate('customerPn')}
                      error={validationState.customerPn?.error}
                      required
                      placeholder="e.g., CUST-001"
                    />

                    <FormField
                      label="PCB P/N (Hardware Version)"
                      name="pcbPn"
                      value={formState.pcbPn}
                      onChange={handleFieldUpdate('pcbPn')}
                      error={validationState.pcbPn?.error}
                      required
                      placeholder="e.g., PCB-REV-A"
                    />

                    <FormSelect
                      label="Stage"
                      name="stage"
                      value={formState.stage}
                      onChange={handleFieldUpdate('stage')}
                      options={stageOptions}
                      error={validationState.stage?.error}
                      required
                    />

                    <FormField
                      label="Build Qty"
                      name="buildQty"
                      type="number"
                      value={formState.buildQty}
                      onChange={handleNumericChange('buildQty')}
                      error={validationState.buildQty?.error}
                      placeholder="e.g., 100"
                    />

                    <FormField
                      label="Build Date"
                      name="buildDate"
                      type="date"
                      value={formatDateForInput(formState.buildDate)}
                      onChange={handleDateChange}
                      error={validationState.buildDate?.error}
                    />

                    <FormField
                      label="CIM File"
                      name="cimFile"
                      value={formState.cimFile}
                      onChange={handleFieldUpdate('cimFile')}
                      placeholder="File path or reference"
                    />
                  </div>

                  <FormTextArea
                    label="Description"
                    name="description"
                    value={formState.description}
                    onChange={handleFieldUpdate('description')}
                    error={validationState.description?.error}
                    placeholder="Describe the build notice..."
                    rows={3}
                  />

                  <FormTextArea
                    label="Remark"
                    name="remark"
                    value={formState.remark}
                    onChange={handleFieldUpdate('remark')}
                    placeholder="Any additional remarks..."
                    rows={3}
                  />
                </div>

                {/* Section B: Role Settings */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Section B: Role Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="EPE (Electronics Project Engineer)"
                      name="epe"
                      value={formState.epe}
                      onChange={handleFieldUpdate('epe')}
                      error={validationState.epe?.error}
                      required
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="SL (System Lead)"
                      name="sl"
                      value={formState.sl}
                      onChange={handleFieldUpdate('sl')}
                      error={validationState.sl?.error}
                      required
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="MPE (Mechanical Project Engineer)"
                      name="mpe"
                      value={formState.mpe}
                      onChange={handleFieldUpdate('mpe')}
                      error={validationState.mpe?.error}
                      required
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="FW (Firmware Engineer)"
                      name="fw"
                      value={formState.fw}
                      onChange={handleFieldUpdate('fw')}
                      error={validationState.fw?.error}
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="RD (R&D Engineer)"
                      name="rd"
                      value={formState.rd}
                      onChange={handleFieldUpdate('rd')}
                      error={validationState.rd?.error}
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="TE (Test Engineer)"
                      name="te"
                      value={formState.te}
                      onChange={handleFieldUpdate('te')}
                      error={validationState.te?.error}
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="EPM (Engineering PM)"
                      name="epm"
                      value={formState.epm}
                      onChange={handleFieldUpdate('epm')}
                      error={validationState.epm?.error}
                      placeholder="Enter name or ID"
                    />

                    <FormField
                      label="MPM (Manufacturing PM)"
                      name="mpm"
                      value={formState.mpm}
                      onChange={handleFieldUpdate('mpm')}
                      error={validationState.mpm?.error}
                      placeholder="Enter name or ID"
                    />
                  </div>
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
