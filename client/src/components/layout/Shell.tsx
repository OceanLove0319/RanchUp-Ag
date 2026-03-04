import { Link, useLocation } from "wouter";
import { Home, Map, ClipboardEdit, Archive, Settings, LogOut, FlaskConical, LineChart, Plus, Menu, X, BookOpen, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { GuidedFlowReturnBar } from "@/components/navigation/GuidedFlowReturnBar";
import RanchSwitcher from "@/components/RanchSwitcher";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const logout = useStore((state) => state.logout);
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { href: "/app", icon: Home, label: "Home" },
    { href: "/app/blocks", icon: Map, label: "Blocks" },
    // Log is a FAB on mobile, so we don't include it in bottom nav
    ...(isMobile ? [] : [{ href: "/app/log", icon: ClipboardEdit, label: "Log" }]),
    { href: "/app/vault", icon: Archive, label: "Vault" },
  ];

  const secondaryNavItems = [
    { href: "/app/inputs", icon: Package, label: "Inputs Library" },
    { href: "/app/projections", icon: LineChart, label: "Budget" },
    { href: "/app/settings/billing", icon: Settings, label: "Settings" },
  ];

  const helpNavItems = [
    { href: "/app/help/product-logging", icon: BookOpen, label: "Log Guide" },
    { href: "/app/help/grower-materials", icon: BookOpen, label: "Materials Guide" },
    { href: "/app/glossary", icon: BookOpen, label: "Glossary" },
  ];

  const handleMobileNavClick = (href: string) => {
    setLocation(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)]">
      {/* Top Nav (Mobile) */}
      {isMobile && (
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border p-4 flex justify-between items-center pt-[env(safe-area-inset-top)]">
          <h1 className="text-lg font-black text-white tracking-widest uppercase">KEBB AG™</h1>
          <RanchSwitcher compact />
        </header>
      )}

      {/* Side Nav (Desktop) */}
      {!isMobile && (
        <nav className="border-r w-64 flex-shrink-0 flex flex-col justify-between bg-background p-4 sticky top-0 h-screen z-50">
          <div className="mb-6">
            <h1 className="text-xl font-black text-white tracking-widest mb-4 uppercase">KEBB AG™</h1>
            <RanchSwitcher />
          </div>
          
          <div className="flex flex-col justify-start w-full gap-2">
            {[...mainNavItems, ...secondaryNavItems].map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/app");
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-semibold tracking-wider uppercase">{item.label}</span>
                </Link>
              );
            })}
            
            <div className="mt-4 mb-2 px-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Help & References</p>
              {helpNavItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`flex items-center gap-3 p-2 rounded-md transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wider uppercase">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="mt-auto border-t border-border pt-4">
            <button onClick={logout} className="flex items-center gap-3 p-3 text-muted-foreground hover:text-white transition-colors w-full">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Log Out</span>
            </button>
          </div>
        </nav>
      )}

      {/* Bottom Nav (Mobile) */}
      {isMobile && (
        <>
          <nav className="fixed bottom-0 w-full bg-background/95 backdrop-blur-sm border-t border-border flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            {mainNavItems.map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/app");
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center p-2 min-w-[64px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-primary/20' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={`flex flex-col items-center p-2 min-w-[64px] ${isMobileMenuOpen ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 mb-1" /> : <Menu className="w-6 h-6 mb-1" />}
              <span className="text-[10px] font-bold uppercase tracking-widest">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </nav>

          {/* Quick Log FAB for Mobile */}
          <Link 
            href="/app/log" 
            className="fixed bottom-24 right-4 bg-primary text-primary-foreground p-4 rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] z-50 active:scale-95 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </Link>

          {/* Mobile Full Menu Overlay */}
          <div 
            className={`fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out pt-20 pb-24 px-4 overflow-y-auto ${
              isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="flex flex-col h-full max-w-md mx-auto">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Management</h2>
              <div className="grid gap-3 mb-8">
                {secondaryNavItems.map((item) => (
                  <button 
                    key={item.href} 
                    onClick={() => handleMobileNavClick(item.href)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border transition-colors hover:border-primary/50 text-left"
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-bold uppercase tracking-widest text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
              
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Help & References</h2>
              <div className="grid gap-3 mb-8">
                {helpNavItems.map((item) => (
                  <button 
                    key={item.href} 
                    onClick={() => handleMobileNavClick(item.href)}
                    className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border transition-colors hover:border-primary/50 text-left"
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-bold uppercase tracking-widest text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-auto pt-6 border-t border-border">
                <button 
                  onClick={() => {
                    logout();
                    setLocation('/');
                  }}
                  className="flex items-center gap-4 p-4 rounded-lg text-muted-foreground hover:text-white transition-colors text-left w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-widest text-sm">Exit App</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full min-w-0">
        <GuidedFlowReturnBar />
        {children}
      </main>
    </div>
  );
}
