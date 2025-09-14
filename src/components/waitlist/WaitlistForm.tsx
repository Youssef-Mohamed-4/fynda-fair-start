import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, Users } from 'lucide-react';
import { WaitlistFormFieldEnhanced } from './WaitlistFormFieldEnhanced';
import { useWaitlistForm } from '@/hooks/useWaitlistForm';
import { industryOptions, companySizeOptions } from '@/schemas/waitlist';
import { ERROR_MESSAGES } from '@/constants/validation';

export const WaitlistForm = () => {
  const {
    formData,
    errors,
    updateField,
    submitForm,
    isValid,
    isSubmitting
  } = useWaitlistForm();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔥 BUTTON CLICKED - handleSubmit fired!');
    e.preventDefault();
    console.log('🎯 Form submitted via handleSubmit');
    console.log('📊 Current form state:', { formData, errors, isValid, isSubmitting });
    console.log('🚦 Button disabled state:', !isValid || isSubmitting);
    await submitForm();
  };

  // Add click handler directly to button for debugging
  const handleButtonClick = () => {
    console.log('🖱️ BUTTON DIRECT CLICK DETECTED!');
    console.log('📋 Form validity check:', { isValid, isSubmitting });
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Security badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
        <Shield className="w-3 h-3 text-primary" />
        <span className="text-xs font-medium text-primary">Secure</span>
      </div>

      <CardHeader className="pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Join the Employer Waitlist</CardTitle>
        </div>
        <CardDescription className="text-base">
          Connect with exceptional early-career talent and build your future workforce. 
          Be the first to experience our innovative hiring platform.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WaitlistFormFieldEnhanced
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

              <WaitlistFormFieldEnhanced
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
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Company Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WaitlistFormFieldEnhanced
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

              <WaitlistFormFieldEnhanced
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
          </div>

          {/* Hiring Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Hiring Needs
            </h3>
            
            <WaitlistFormFieldEnhanced
              id="employer-early-careers"
              label="Early career professionals hired per year"
              type="number"
              value={formData.early_career_hires_per_year}
              onChange={(value) => updateField('early_career_hires_per_year', value)}
              placeholder="e.g., 5"
              error={errors.early_career_hires_per_year}
              min={0}
              max={10000}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="waitlist"
              size="lg"
              className="w-full font-medium transition-all duration-200 hover:scale-[1.02] disabled:scale-100" 
              disabled={!isValid || isSubmitting}
              onClick={handleButtonClick}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining Waitlist...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Join Waitlist
                </>
              )}
            </Button>
            
            {/* Form validation feedback */}
            {!isValid && Object.keys(errors).length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {ERROR_MESSAGES.REQUIRED_FIELDS}
              </p>
            )}
          </div>

          {/* Privacy note */}
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              <Shield className="w-3 h-3 inline mr-1" />
              Your information is secure and will only be used to contact you about Fynda.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};