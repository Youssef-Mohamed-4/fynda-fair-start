import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

interface BaseFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
}

interface TextFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: readonly string[];
}

type FieldProps = TextFieldProps | SelectFieldProps;

export const WaitlistFormField = (props: FieldProps) => {
  const { id, label, error, required = false } = props;

  const labelElement = (
    <Label 
      htmlFor={id} 
      className={`text-sm font-medium ${error ? 'text-destructive' : 'text-foreground'}`}
    >
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );

  const errorElement = error ? (
    <div className="flex items-center gap-1 text-sm text-destructive mt-1">
      <AlertCircle className="h-3 w-3" />
      <span>{error}</span>
    </div>
  ) : null;

  if (props.type === 'select') {
    return (
      <div className="space-y-2">
        {labelElement}
        <Select value={props.value} onValueChange={props.onChange} required={required}>
          <SelectTrigger 
            id={id}
            className={error ? 'border-destructive focus:border-destructive' : ''}
          >
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option === '1000+' ? '1000+ employees' : 
                 option.includes('-') ? `${option} employees` : 
                 option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorElement}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {labelElement}
      <Input
        id={id}
        type={props.type}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        required={required}
        maxLength={props.maxLength}
        min={props.min}
        max={props.max}
        className={error ? 'border-destructive focus:border-destructive' : ''}
      />
      {errorElement}
    </div>
  );
};