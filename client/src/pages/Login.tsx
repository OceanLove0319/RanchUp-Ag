import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await register({ email, password, name, org: org || undefined });
        toast({ title: "Account created", description: "Welcome to RanchUp!" });
        setLocation("/onboarding");
      } else {
        await login(email, password);
        toast({ title: "Welcome back", description: "Logged in successfully." });
        setLocation("/app");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: isRegistering ? "Registration failed" : "Login failed",
        description: err.message?.includes("409") ? "Email already registered" :
          err.message?.includes("401") ? "Invalid email or password" : err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-lg">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-foreground">
          {isRegistering ? "Create Account" : "Access Your Operation"}
        </h1>
        <p className="text-muted-foreground mb-8 font-medium">
          {isRegistering ? "Set up your RanchUp account." : "Log in to your RanchUp account."}
        </p>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Operation Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Farms"
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email</label>
            <input
              type="email"
              placeholder="you@farm.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest py-3 rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-4 text-muted-foreground font-bold uppercase tracking-widest">Test Account</span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          grower@ranchup.ag / RanchUp2026
        </p>
      </div>
    </div>
  );
}
