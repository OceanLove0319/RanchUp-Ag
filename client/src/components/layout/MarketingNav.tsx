import { Link, useLocation } from "wouter";

export default function MarketingNav() {
  const [location] = useLocation();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="bg-[#111113]/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-black text-primary-foreground text-xl group-hover:bg-primary/90 transition-colors">K</div>
              <span className="font-black tracking-tighter text-xl uppercase hidden sm:block text-white">KEBB Ag™</span>
            </div>
          </Link>
        </div>
        
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
      </div>
    </div>
  );
}
