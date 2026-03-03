import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const login = useStore((state) => state.login);
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDemoLogin = () => {
    login();
    setLocation("/onboarding");
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "demo@kebbfarms.com" && password === "peaches") {
      login();
      setLocation("/app");
      toast({
        title: "Welcome back",
        description: "Logged into KEBB Farms demo account."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid credentials",
        description: "For the demo, use demo@kebbfarms.com / peaches"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-lg">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-foreground">Access Your Operation</h1>
        <p className="text-muted-foreground mb-8 font-medium">Log in or continue with the demo environment.</p>
        
        <form className="space-y-4 mb-8" onSubmit={handleStandardLogin}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email</label>
            <input 
              type="email" 
              placeholder="demo@kebbfarms.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              className="w-full bg-background border border-border rounded px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-[10px] text-muted-foreground mt-2 italic">Demo hint: Use demo@kebbfarms.com / peaches</p>
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-widest py-3 rounded hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-4 text-muted-foreground font-bold uppercase tracking-widest">Or</span>
          </div>
        </div>

        <button 
          onClick={handleDemoLogin}
          className="w-full border-2 border-primary text-primary font-bold uppercase tracking-widest py-4 rounded hover:bg-primary/10 transition-colors"
        >
          Enter Fresh Demo
        </button>
      </div>
    </div>
  );
}
