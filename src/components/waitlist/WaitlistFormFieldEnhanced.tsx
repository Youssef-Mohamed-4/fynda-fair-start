import React, { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';

interface WaitlistFormFieldEnhancedProps {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  options?: readonly string[];
  min?: number;
  max?: number;
  maxLength?: number;
  isValidating?: boolean;
}

export const WaitlistFormFieldEnhanced = memo(({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  options = [],
  min,
  max,
  maxLength,
  isValidating = false
}: WaitlistFormFieldEnhancedProps) => {
  const hasError = Boolean(error);

  const renderInput = () => {
    if (type === 'select') {
      return (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger 
            className={`transition-colors ${hasError ? 'border-destructive focus:ring-destructive' : ''}`}
            aria-describedby={hasError ? `${id}-error` : undefined}
            aria-invalid={hasError}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`transition-colors pr-10 ${hasError ? 'border-destructive focus:ring-destructive' : ''}`}
          aria-describedby={hasError ? `${id}-error` : undefined}
          aria-invalid={hasError}
          min={min}
          max={max}
          maxLength={maxLength}
          autoComplete={
            type === 'email' ? 'email' : 
            type === 'text' && label.toLowerCase().includes('name') ? 'name' : 
            'off'
          }
        />
        {isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={type !== 'select' ? id : undefined} 
        className="text-sm font-medium flex items-center gap-1"
      >
        {label}
        {required && <span className="text-destructive" aria-label="required">*</span>}
      </Label>
      
      {renderInput()}
      
      {hasError && (
        <div 
          id={`${id}-error`}
          className="flex items-center gap-1 text-sm text-destructive animate-in slide-in-from-left-1 duration-200"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

WaitlistFormFieldEnhanced.displayName = 'WaitlistFormFieldEnhanced';