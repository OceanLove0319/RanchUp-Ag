import { Link } from "wouter";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function Thanks() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-[#E85D04] selection:text-white">
      <div className="max-w-md w-full bg-[#111113] border border-white/10 rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Application Received</h1>
        <p className="text-gray-400 font-medium mb-8">
          Thank you for your interest in the Grower's Guild. We are reviewing applications on a rolling basis. 
          If there's a fit and a seat is available in your region, we'll reach out directly.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#E85D04] hover:text-[#ff6a00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Guild Homepage
        </Link>
      </div>
    </div>
  );
}
