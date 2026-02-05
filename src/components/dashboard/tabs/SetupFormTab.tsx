'use client';

import { useState, useEffect, useCallback } from 'react';
import { settingsService } from '@/lib/services';
import type { SetupFormField } from '@/lib/types/api.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SetupFormTabProps {
  appId: string;
  onUpdate: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'amount', label: 'Amount' },
  { value: 'checkbox', label: 'Checkbox' },
];

export function SetupFormTab({ appId, onUpdate }: SetupFormTabProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<SetupFormField[]>([]);
  const [originalFields, setOriginalFields] = useState<SetupFormField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSetupFormSettings(appId);
      if (data) {
        setFields(data.setup_form || []);
        setOriginalFields(data.setup_form || []);
      }
    } catch (error) {
      console.error('Failed to load setup form settings:', error);
      setErrors({ load: 'Failed to load setup form settings' });
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Check if form has changes
  const hasChanges = JSON.stringify(fields) !== JSON.stringify(originalFields);

  const addField = () => {
    setFields([
      ...fields,
      {
        name: '',
        type: 'text',
        label: '',
        required: false,
      },
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<SetupFormField>) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], ...updates };
    setFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    fields.forEach((field, index) => {
      if (!field.name.trim()) {
        newErrors[`name_${index}`] = 'Field name is required';
      }
      if (!field.label.trim()) {
        newErrors[`label_${index}`] = 'Field label is required';
      }
      if (field.type === 'dropdown' && (!field.options || field.options.length === 0)) {
        newErrors[`options_${index}`] = 'At least one option is required for dropdown fields';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      await settingsService.updateSetupFormSettings(appId, {
        setup_form: fields,
      });
      setSuccess(true);
      onUpdate();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Form</h3>
      <p className="text-sm text-gray-600 mb-6">
        Configure the form fields merchants will fill when installing your app
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Setup Form Purpose</h4>
              <p className="text-sm text-blue-700">
                These fields will be shown to merchants when they install your app.
                Use this to collect configuration data like API keys, account IDs, or preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Fields List */}
        <div className="space-y-4">
          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-sm">No form fields configured yet</p>
              <p className="text-gray-400 text-xs mt-1">Click &quot;Add Field&quot; to create your first field</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Field Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`name_${index}`}>Field Name *</Label>
                        <Input
                          id={`name_${index}`}
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(index, { name: e.target.value })}
                          placeholder="field_name"
                          className={errors[`name_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`name_${index}`] && (
                          <p className="text-sm text-red-600 mt-1">{errors[`name_${index}`]}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Unique identifier (lowercase, no spaces)
                        </p>
                      </div>

                      <div>
                        <Label htmlFor={`type_${index}`}>Field Type *</Label>
                        <select
                          id={`type_${index}`}
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value as SetupFormField['type'] })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
                        >
                          {FIELD_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Field Label */}
                    <div>
                      <Label htmlFor={`label_${index}`}>Field Label *</Label>
                      <Input
                        id={`label_${index}`}
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        placeholder="Enter your field label"
                        className={errors[`label_${index}`] ? 'border-red-500' : ''}
                      />
                      {errors[`label_${index}`] && (
                        <p className="text-sm text-red-600 mt-1">{errors[`label_${index}`]}</p>
                      )}
                    </div>

                    {/* Field Placeholder */}
                    {field.type !== 'checkbox' && (
                      <div>
                        <Label htmlFor={`placeholder_${index}`}>Placeholder (Optional)</Label>
                        <Input
                          id={`placeholder_${index}`}
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(index, { placeholder: e.target.value })}
                          placeholder="Enter placeholder text"
                        />
                      </div>
                    )}

                    {/* Options for Dropdown */}
                    {field.type === 'dropdown' && (
                      <div>
                        <Label htmlFor={`options_${index}`}>Options *</Label>
                        <textarea
                          id={`options_${index}`}
                          value={field.options?.join('\n') || ''}
                          onChange={(e) => {
                            const options = e.target.value.split('\n').filter(opt => opt.trim());
                            updateField(index, { options });
                          }}
                          placeholder="Enter one option per line&#10;Option 1&#10;Option 2&#10;Option 3"
                          rows={4}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent ${
                            errors[`options_${index}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`options_${index}`] && (
                          <p className="text-sm text-red-600 mt-1">{errors[`options_${index}`]}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Enter each option on a new line
                        </p>
                      </div>
                    )}

                    {/* Required Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required_${index}`}
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="w-4 h-4 text-vondera-purple border-gray-300 rounded focus:ring-vondera-purple"
                      />
                      <Label htmlFor={`required_${index}`} className="cursor-pointer">
                        Required field
                      </Label>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Remove field"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Add Field Button */}
          <button
            type="button"
            onClick={addField}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-vondera-purple hover:text-vondera-purple transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Field
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">Setup form saved successfully</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={saving || !hasChanges}
            className={hasChanges ? 'bg-vondera-purple hover:bg-vondera-purple-dark ring-2 ring-vondera-purple ring-offset-2' : ''}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Setup Form'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
