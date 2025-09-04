import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, full_name: fullName }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setError('This email is already on our waitlist!');
        } else {
          setError(error.message);
        }
      } else {
        setSuccess(true);
        toast({
          title: "Welcome to the waitlist!",
          description: "We'll notify you when Fynda launches.",
        });
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again.');
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
                Thanks for joining our waitlist. We'll be in touch soon!
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
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Join the Waitlist
            </h2>
            <p className="text-xl text-muted-foreground">
              Be the first to know when Fynda launches
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-medium p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
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
                {loading ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;