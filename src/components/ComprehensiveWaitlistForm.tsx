import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submitWaitlistEntry } from '@/lib/api-client';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const ComprehensiveWaitlistForm = () => {
  // Form states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Employer form state
  const [employerName, setEmployerName] = useState('');
  const [employerEmail, setEmployerEmail] = useState('');
  const [employerIndustry, setEmployerIndustry] = useState('');
  const [employerCompanySize, setEmployerCompanySize] = useState('');
  const [employerEarlyCareers, setEmployerEarlyCareers] = useState<number | undefined>();

  // Employer form submission
  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
      if (!employerName.trim() || !employerEmail.trim() || !employerIndustry || !employerCompanySize) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employerEmail)) {
        throw new Error('Please enter a valid email address');
      }

      // Early careers validation
      if (employerEarlyCareers !== undefined && (employerEarlyCareers < 0 || employerEarlyCareers > 10000)) {
        throw new Error('Please enter a valid number of early career hires per year');
      }

      // Sanitize inputs
      const sanitizedData = {
        name: employerName.trim().slice(0, 100),
        email: employerEmail.trim().toLowerCase(),
        industry: employerIndustry.trim().slice(0, 100),
        company_size: employerCompanySize.trim().slice(0, 100),
        early_career_hires_per_year: employerEarlyCareers
      };

      // Submit to API
      await submitWaitlistEntry('employer', sanitizedData);
      
      setSuccess(true);
      console.log('✅ Employer submission successful');
      
    } catch (err) {
      console.error('❌ Employer submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="waitlist-form" className="py-20 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              You've been added to our employer waitlist. We'll be in touch soon to help you find top early-career talent.
            </p>
            <Button 
              onClick={() => {
                setSuccess(false);
                // Reset all form fields
                setEmployerName('');
                setEmployerEmail('');
                setEmployerIndustry('');
                setEmployerCompanySize('');
                setEmployerEarlyCareers(undefined);
                setError(null);
              }}
              variant="outline"
            >
              Submit Another Entry
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist-form" className="py-20 bg-gradient-to-br from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Join the Waitlist</h2>
            <p className="text-xl text-muted-foreground">
              Be the first to experience the future of early-career talent discovery
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Employer Form */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Employer Registration</CardTitle>
              <CardDescription>
                Connect with top early-career talent and build your future workforce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmployerSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer-name">Full Name *</Label>
                    <Input
                      id="employer-name"
                      type="text"
                      value={employerName}
                      onChange={(e) => setEmployerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer-email">Work Email Address *</Label>
                    <Input
                      id="employer-email"
                      type="email"
                      value={employerEmail}
                      onChange={(e) => setEmployerEmail(e.target.value)}
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer-industry">Industry *</Label>
                    <Select value={employerIndustry} onValueChange={setEmployerIndustry} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Non-profit">Non-profit</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer-company-size">Company Size *</Label>
                    <Select value={employerCompanySize} onValueChange={setEmployerCompanySize} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer-early-careers">How many early career professionals do you hire per year? (Optional)</Label>
                  <Input
                    id="employer-early-careers"
                    type="number"
                    min="0"
                    max="10000"
                    value={employerEarlyCareers || ''}
                    onChange={(e) => setEmployerEarlyCareers(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 5"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
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
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveWaitlistForm;