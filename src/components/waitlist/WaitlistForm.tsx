import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { WaitlistFormField } from './WaitlistFormField';
import { useWaitlistForm } from '@/hooks/useWaitlistForm';
import { industryOptions, companySizeOptions } from '@/schemas/waitlist';

export const WaitlistForm = () => {
  const {
    formData,
    errors,
    updateField,
    submitForm,
    isValid,
    isSubmitting
  } = useWaitlistForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Employer Registration</CardTitle>
        <CardDescription>
          Connect with top early-career talent and build your future workforce
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WaitlistFormField
              id="employer-name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(value) => updateField('name', value)}
              placeholder="Enter your full name"
              error={errors.name}
              required
              maxLength={100}
            />

            <WaitlistFormField
              id="employer-email"
              label="Work Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              placeholder="your.email@company.com"
              error={errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WaitlistFormField
              id="employer-industry"
              label="Industry"
              type="select"
              value={formData.industry}
              onChange={(value) => updateField('industry', value)}
              placeholder="Select your industry"
              options={industryOptions}
              error={errors.industry}
              required
            />

            <WaitlistFormField
              id="employer-company-size"
              label="Company Size"
              type="select"
              value={formData.company_size}
              onChange={(value) => updateField('company_size', value)}
              placeholder="Select company size"
              options={companySizeOptions}
              error={errors.company_size}
              required
            />
          </div>

          <WaitlistFormField
            id="employer-early-careers"
            label="How many early career professionals do you hire per year?"
            type="number"
            value={formData.early_career_hires_per_year}
            onChange={(value) => updateField('early_career_hires_per_year', value)}
            placeholder="e.g., 5"
            error={errors.early_career_hires_per_year}
            min={0}
            max={10000}
          />

          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:scale-[1.02]" 
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining Waitlist...
              </>
            ) : (
              'Join Employer Waitlist'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};