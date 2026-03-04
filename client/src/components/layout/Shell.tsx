import { Link, useLocation } from "wouter";
import { Home, Map, ClipboardEdit, Archive, Settings, LogOut, FlaskConical, LineChart, Plus, Menu, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

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
    { href: "/app/chemicals", icon: FlaskConical, label: "Chemicals" },
    { href: "/app/projections", icon: LineChart, label: "Budget" },
    { href: "/app/settings/billing", icon: Settings, label: "Settings" },
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
            {[...mainNavItems, { href: "/app/log", icon: ClipboardEdit, label: "Log" }, ...secondaryNavItems].map((item) => {
              const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/app");
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-semibold tracking-wider uppercase">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="flex flex-col gap-2 mt-auto">
            <Link href="/" onClick={logout} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:text-white transition-colors text-sm font-semibold tracking-wider uppercase">
              <LogOut className="w-5 h-5" /> Exit
            </Link>
          </div>
        </nav>
      )}

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <>
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16 px-2">
              {mainNavItems.map((item) => {
                const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/app");
                return (
                  <button 
                    key={item.href} 
                    onClick={() => handleMobileNavClick(item.href)}
                    className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-[10px] font-bold tracking-wider uppercase">{item.label}</span>
                  </button>
                );
              })}
              
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isMobileMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
              >
                <Menu className="w-6 h-6" />
                <span className="text-[10px] font-bold tracking-wider uppercase">More</span>
              </button>
            </div>
          </nav>
          
          {/* Quick Log FAB */}
          <Link href="/app/log" className="fixed bottom-20 right-4 z-40 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform hover:scale-105 active:scale-95">
            <Plus className="w-8 h-8" />
          </Link>
          
          {/* Mobile Slide-over Menu */}
          <div className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <div 
              className={`absolute top-0 right-0 bottom-0 w-3/4 max-w-sm bg-card border-l border-border p-6 flex flex-col transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black uppercase tracking-tighter">More</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground p-2 -mr-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col gap-2">
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
        {children}
      </main>
    </div>
  );
}
