import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Users, Building2 } from "lucide-react";
import { 
  sanitizeInput, 
  validateEmail, 
  checkRateLimit, 
  validateName, 
  logSecurityEvent,
  ADMIN_CONFIG 
} from "@/utils/security";
import { submitWaitlistEntry } from "@/lib/api-client";

const ComprehensiveWaitlistForm = () => {
  const [activeTab, setActiveTab] = useState<'candidate' | 'employer'>('candidate');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<'candidate' | 'employer' | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Candidate form state
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    currentState: '',
    fieldOfStudy: '',
    fieldDescription: ''
  });

  // Employer form state
  const [employerForm, setEmployerForm] = useState({
    name: '',
    email: '',
    role: '',
    roleOther: '',
    earlyCareersPerYear: ''
  });

  // Security logging for form interactions
  const logFormEvent = (event: string, details?: Record<string, unknown>) => {
    logSecurityEvent(`waitlist_form_${event}`, {
      tab: activeTab,
      ...details
    });
  };

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Log form submission attempt
    logFormEvent('submission_attempt', { type: 'candidate' });

    // Rate limiting check
    if (!checkRateLimit('waitlist-submission', ADMIN_CONFIG.RATE_LIMIT.WAITLIST_SUBMISSION)) {
      setError('Please wait a moment before submitting again.');
      setLoading(false);
      logFormEvent('rate_limit_exceeded', { type: 'candidate' });
      return;
    }

    // Input validation and sanitization
    const sanitizedName = sanitizeInput(candidateForm.name);
    const sanitizedEmail = candidateForm.email.trim().toLowerCase();
    const sanitizedDescription = candidateForm.fieldDescription ? sanitizeInput(candidateForm.fieldDescription) : '';

    // Validate name using security utilities
    const nameValidation = validateName(sanitizedName);
    if (!nameValidation.isValid) {
      setError(nameValidation.error || 'Invalid name');
      setLoading(false);
      logFormEvent('validation_error', { type: 'candidate', field: 'name', error: nameValidation.error });
      return;
    }

    if (!sanitizedEmail || !candidateForm.currentState || !candidateForm.fieldOfStudy) {
      setError('Please fill in all required fields.');
      setLoading(false);
      logFormEvent('validation_error', { type: 'candidate', field: 'required_fields' });
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      logFormEvent('validation_error', { type: 'candidate', field: 'email' });
      return;
    }

    try {
      // Submit via secure API endpoint
      const result = await submitWaitlistEntry('candidate', {
        name: sanitizedName,
        email: sanitizedEmail,
        currentState: candidateForm.currentState,
        fieldOfStudy: candidateForm.fieldOfStudy,
        fieldDescription: candidateForm.fieldOfStudy === 'Other' ? sanitizedDescription : undefined
      });

      setSuccess('candidate');
      logFormEvent('success', { type: 'candidate', email: sanitizedEmail });
      toast({
        title: "Welcome to our candidate waitlist!",
        description: "We'll be in touch when opportunities arise.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      
      if (errorMessage.includes('already registered')) {
        logFormEvent('duplicate_email', { type: 'candidate', email: sanitizedEmail });
      } else {
        logFormEvent('api_error', { type: 'candidate', error: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Input validation and sanitization
    const sanitizedName = sanitizeInput(employerForm.name);
    const sanitizedEmail = employerForm.email.trim().toLowerCase();
    const sanitizedRoleOther = employerForm.roleOther ? sanitizeInput(employerForm.roleOther) : '';
    
    if (!sanitizedName || !sanitizedEmail || !employerForm.role) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (employerForm.role === 'Other' && !sanitizedRoleOther) {
      setError('Please specify your role.');
      setLoading(false);
      return;
    }

    const earlyCareersNum = employerForm.earlyCareersPerYear ? parseInt(employerForm.earlyCareersPerYear) : null;
    if (employerForm.earlyCareersPerYear && (isNaN(earlyCareersNum!) || earlyCareersNum! < 0)) {
      setError('Please enter a valid number for early careers hired per year.');
      setLoading(false);
      return;
    }

    try {
      // Submit via secure API endpoint
      const result = await submitWaitlistEntry('employer', {
        name: sanitizedName,
        email: sanitizedEmail,
        role: employerForm.role === 'Other' ? sanitizedRoleOther : employerForm.role,
        roleOther: employerForm.role === 'Other' ? sanitizedRoleOther : undefined,
        earlyCareersPerYear: earlyCareersNum || undefined
      });

      setSuccess('employer');
      logFormEvent('success', { type: 'employer', email: sanitizedEmail });
      toast({
        title: "Welcome to our employer waitlist!",
        description: "We'll reach out to discuss partnership opportunities.",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(errorMessage);
      
      if (errorMessage.includes('already registered')) {
        logFormEvent('duplicate_email', { type: 'employer', email: sanitizedEmail });
      } else {
        logFormEvent('api_error', { type: 'employer', error: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="waitlist-form" className="py-20 bg-fynda-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl shadow-medium p-8 text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">You're on the list!</h3>
              <p className="text-muted-foreground">
                {success === 'candidate' 
                  ? "Thanks for joining our candidate waitlist. We'll notify you when opportunities arise!"
                  : "Thanks for joining our employer waitlist. We'll be in touch to discuss partnership opportunities!"
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist-form" className="py-20 bg-fynda-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Join the Waitlist
            </h2>
            <p className="text-xl text-muted-foreground">
              Be the first to know when Fynda launches
            </p>
          </div>

          {/* Tab Selection */}
          <div className="mb-8">
            <RadioGroup
              value={activeTab}
              onValueChange={(value: string) => setActiveTab(value as 'candidate' | 'employer')}
              className="grid grid-cols-2 gap-4 max-w-md mx-auto"
            >
              <div>
                <RadioGroupItem value="candidate" id="candidate" className="peer sr-only" />
                <Label
                  htmlFor="candidate"
                  className="flex flex-col items-center justify-center space-y-2 rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <Users className="h-6 w-6" />
                  <span className="font-medium">I'm a Candidate</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="employer" id="employer" className="peer sr-only" />
                <Label
                  htmlFor="employer"
                  className="flex flex-col items-center justify-center space-y-2 rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <Building2 className="h-6 w-6" />
                  <span className="font-medium">I'm an Employer</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Forms */}
          <div className="bg-card rounded-2xl shadow-medium p-8">
            {activeTab === 'candidate' ? (
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Candidate Registration
                  </CardTitle>
                  <CardDescription>
                    Join our talent pool and get matched with progressive employers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCandidateSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="candidateName">Full Name</Label>
                        <Input
                          id="candidateName"
                          type="text"
                          value={candidateForm.name}
                          onChange={(e) => setCandidateForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="candidateEmail">Email</Label>
                        <Input
                          id="candidateEmail"
                          type="email"
                          value={candidateForm.email}
                          onChange={(e) => setCandidateForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentState">Current State</Label>
                        <Select 
                          value={candidateForm.currentState} 
                          onValueChange={(value) => setCandidateForm(prev => ({ ...prev, currentState: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your current state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="final_year">Final Year Student</SelectItem>
                            <SelectItem value="fresh_graduate">Fresh Graduate</SelectItem>
                            <SelectItem value="early_career">Early Career (0-3 years)</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                        <Select 
                          value={candidateForm.fieldOfStudy} 
                          onValueChange={(value) => setCandidateForm(prev => ({ ...prev, fieldOfStudy: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                            <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                            <SelectItem value="Data Science">Data Science</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {candidateForm.fieldOfStudy === 'Other' && (
                      <div className="space-y-2">
                        <Label htmlFor="fieldDescription">Please describe your field of study</Label>
                        <Textarea
                          id="fieldDescription"
                          value={candidateForm.fieldDescription}
                          onChange={(e) => setCandidateForm(prev => ({ ...prev, fieldDescription: e.target.value }))}
                          placeholder="Tell us about your field of study..."
                          className="min-h-[100px]"
                          required={candidateForm.fieldOfStudy === 'Other'}
                        />
                      </div>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Joining...' : 'Join Candidate Waitlist'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Employer Registration
                  </CardTitle>
                  <CardDescription>
                    Partner with us to find exceptional early-career talent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEmployerSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="employerName">Full Name</Label>
                        <Input
                          id="employerName"
                          type="text"
                          value={employerForm.name}
                          onChange={(e) => setEmployerForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employerEmail">Email</Label>
                        <Input
                          id="employerEmail"
                          type="email"
                          value={employerForm.email}
                          onChange={(e) => setEmployerForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={employerForm.role} 
                        onValueChange={(value) => setEmployerForm(prev => ({ ...prev, role: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Founder / Co-founder">Founder / Co-founder</SelectItem>
                          <SelectItem value="CEO / Executive">CEO / Executive</SelectItem>
                          <SelectItem value="HR Manager">HR Manager</SelectItem>
                          <SelectItem value="Recruiter / Talent Acquisition">Recruiter / Talent Acquisition</SelectItem>
                          <SelectItem value="Hiring Manager (non-HR role responsible for a team)">Hiring Manager (non-HR role responsible for a team)</SelectItem>
                          <SelectItem value="Team Lead / Department Head">Team Lead / Department Head</SelectItem>
                          <SelectItem value="Startup Operator">Startup Operator</SelectItem>
                          <SelectItem value="Other">Other (please specify)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {employerForm.role === 'Other' && (
                      <div className="space-y-2">
                        <Label htmlFor="roleOther">Please specify your role</Label>
                        <Input
                          id="roleOther"
                          type="text"
                          value={employerForm.roleOther}
                          onChange={(e) => setEmployerForm(prev => ({ ...prev, roleOther: e.target.value }))}
                          placeholder="Please specify your role..."
                          required={employerForm.role === 'Other'}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="earlyCareersPerYear">
                        How many Early Careers do you hire per year? <span className="text-muted-foreground text-sm">(roughly, optional)</span>
                      </Label>
                      <Input
                        id="earlyCareersPerYear"
                        type="number"
                        min="0"
                        value={employerForm.earlyCareersPerYear}
                        onChange={(e) => setEmployerForm(prev => ({ ...prev, earlyCareersPerYear: e.target.value }))}
                        placeholder="e.g. 5"
                      />
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary" 
                      disabled={loading}
                    >
                      {loading ? 'Joining...' : 'Join Employer Waitlist'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveWaitlistForm;