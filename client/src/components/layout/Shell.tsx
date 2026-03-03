import { Link, useLocation } from "wouter";
import { Home, Map, ClipboardEdit, Archive, Settings, LogOut, FlaskConical } from "lucide-react";
import { useStore } from "@/lib/store";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const logout = useStore((state) => state.logout);

  const navItems = [
    { href: "/app", icon: Home, label: "Home" },
    { href: "/app/blocks", icon: Map, label: "Blocks" },
    { href: "/app/log", icon: ClipboardEdit, label: "Log" },
    { href: "/app/chemicals", icon: FlaskConical, label: "Chemicals" },
    { href: "/app/vault", icon: Archive, label: "Vault" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Top Nav (Mobile) / Side Nav (Desktop) */}
      <nav className="border-b border-border md:border-r md:w-64 flex-shrink-0 flex md:flex-col justify-between bg-background p-4 fixed md:sticky bottom-0 md:top-0 w-full md:h-screen z-50 order-last md:order-first">
        <div className="hidden md:block mb-8">
          <h1 className="text-xl font-black text-white tracking-widest">KEBB AG™</h1>
        </div>
        
        <div className="flex md:flex-col justify-around md:justify-start w-full gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-md transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                <item.icon className="w-6 h-6 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-sm font-semibold tracking-wider uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="hidden md:flex flex-col gap-2 mt-auto">
          <Link href="/app/settings/billing" className={`flex items-center gap-3 p-3 rounded-md transition-colors text-sm font-semibold tracking-wider uppercase ${location.includes('/billing') ? 'text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <Link href="/" onClick={logout} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:text-white transition-colors text-sm font-semibold tracking-wider uppercase">
            <LogOut className="w-5 h-5" /> Exit
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
