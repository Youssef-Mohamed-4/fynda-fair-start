import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Form schemas
const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  currentState: z.enum(["final_year", "fresh_graduate", "early_career", "student"]),
  fieldOfStudy: z.string().min(1, "Please select a field of study"),
  fieldDescription: z.string().optional(),
});

const employerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  jobDescription: z.string().min(10, "Please provide a job description"),
  earlyCareersPerYear: z.number().optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;
type EmployerFormData = z.infer<typeof employerSchema>;

const WaitlistForm = () => {
  const [userType, setUserType] = useState<"candidate" | "employer">("candidate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const candidateForm = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      currentState: undefined,
      fieldOfStudy: "",
      fieldDescription: "",
    },
  });

  const employerForm = useForm<EmployerFormData>({
    resolver: zodResolver(employerSchema),
    defaultValues: {
      name: "",
      email: "",
      jobDescription: "",
    },
  });

  const watchedFieldOfStudy = candidateForm.watch("fieldOfStudy");

  const onSubmitCandidate = async (data: CandidateFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist_candidates").insert({
        name: data.name,
        email: data.email,
        current_state: data.currentState,
        field_of_study: data.fieldOfStudy,
        field_description: data.fieldOfStudy === "other" ? data.fieldDescription : null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already registered!",
            description: "This email is already on our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the waitlist! 🎉",
          description: "We'll be in touch soon with updates on your application.",
        });
        candidateForm.reset();
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEmployer = async (data: EmployerFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist_employers").insert({
        name: data.name,
        email: data.email,
        job_description: data.jobDescription,
        early_careers_per_year: data.earlyCareersPerYear || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already registered!",
            description: "This email is already on our waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the waitlist! 🎉",
          description: "We'll be in touch soon about our early access program.",
        });
        employerForm.reset();
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 bg-fynda-blue-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Join the Waitlist
            </h2>
            <p className="text-xl text-muted-foreground">
              Be among the first to experience fair AI-powered hiring
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-medium p-8">
            {/* User Type Selection */}
            <div className="mb-8">
              <Label className="text-base font-semibold text-foreground mb-4 block">
                I am a:
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={userType === "candidate" ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setUserType("candidate")}
                >
                  Job Seeker
                </Button>
                <Button
                  type="button"
                  variant={userType === "employer" ? "default" : "outline"}
                  className="h-12"
                  onClick={() => setUserType("employer")}
                >
                  Employer
                </Button>
              </div>
            </div>

            {/* Candidate Form */}
            {userType === "candidate" && (
              <Form {...candidateForm}>
                <form onSubmit={candidateForm.handleSubmit(onSubmitCandidate)} className="space-y-6">
                  <FormField
                    control={candidateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={candidateForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={candidateForm.control}
                    name="currentState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your current state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="final_year">Final Year Student</SelectItem>
                            <SelectItem value="fresh_graduate">Fresh Graduate</SelectItem>
                            <SelectItem value="early_career">Early Career (0-3 years)</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={candidateForm.control}
                    name="fieldOfStudy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field of Study</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your field of study" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="software_engineering">Software Engineering</SelectItem>
                            <SelectItem value="data_analytics">Data Analytics</SelectItem>
                            <SelectItem value="data_science">Data Science</SelectItem>
                            <SelectItem value="computer_science">Computer Science</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedFieldOfStudy === "other" && (
                    <FormField
                      control={candidateForm.control}
                      name="fieldDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please describe your field of study</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your field of study..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
                  </Button>
                </form>
              </Form>
            )}

            {/* Employer Form */}
            {userType === "employer" && (
              <Form {...employerForm}>
                <form onSubmit={employerForm.handleSubmit(onSubmitEmployer)} className="space-y-6">
                  <FormField
                    control={employerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={employerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={employerForm.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the types of roles you're looking to fill..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={employerForm.control}
                    name="earlyCareersPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          How many early careers do you hire per year? 
                          <span className="text-muted-foreground ml-1">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Roughly how many (e.g., 10)"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining Waitlist..." : "Join Waitlist"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;