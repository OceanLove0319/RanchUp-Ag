import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function MarketingNav() {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setLocation(href);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <div className="bg-[#111113]/90 backdrop-blur-md border border-white/10 rounded-full px-4 md:px-6 py-2.5 md:py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-black text-primary-foreground text-xl group-hover:bg-primary/90 transition-colors">K</div>
                <span className="font-black tracking-tighter text-xl uppercase text-white">KEBB Ag™</span>
              </div>
            </Link>
          </div>
          
          {isMobile ? (
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-white hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          ) : (
            <div className="flex items-center gap-4 md:gap-8">
              <Link 
                href="/how-it-works" 
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  location === '/how-it-works' ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`}
              >
                How It Works
              </Link>
              <Link 
                href="/guild" 
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  location === '/guild' ? 'text-primary' : 'text-gray-400 hover:text-white'
                }`}
              >
                Grower's Guild
              </Link>
              
              <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
              
              <Link 
                href="/login" 
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold uppercase tracking-widest text-xs transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/guild" 
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-black uppercase tracking-widest text-xs transition-colors hidden sm:block shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                Join Guild
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div className={`fixed inset-0 z-[60] bg-background/95 backdrop-blur-lg transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-between items-center mb-12 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-black text-primary-foreground text-xl">K</div>
                <span className="font-black tracking-tighter text-xl uppercase text-white">KEBB Ag™</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-white hover:text-primary transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 text-center mt-8">
              <button 
                onClick={() => handleNavClick('/')}
                className={`text-3xl font-black uppercase tracking-tighter ${location === '/' ? 'text-primary' : 'text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('/how-it-works')}
                className={`text-3xl font-black uppercase tracking-tighter ${location === '/how-it-works' ? 'text-primary' : 'text-white'}`}
              >
                How It Works
              </button>
              <button 
                onClick={() => handleNavClick('/guild')}
                className={`text-3xl font-black uppercase tracking-tighter ${location === '/guild' ? 'text-primary' : 'text-white'}`}
              >
                Grower's Guild
              </button>
            </div>
            
            <div className="mt-auto flex flex-col gap-4 pb-8">
              <button 
                onClick={() => handleNavClick('/login')}
                className="w-full py-4 bg-white/5 border border-white/10 text-white rounded font-bold uppercase tracking-widest text-sm"
              >
                Sign In
              </button>
              <button 
                onClick={() => handleNavClick('/guild')}
                className="w-full py-4 bg-primary text-primary-foreground rounded font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                Join The Guild
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
