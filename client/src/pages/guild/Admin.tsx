import { useState } from "react";
import { Link } from "wouter";
import { Lock, Download, Copy, Search, LogOut } from "lucide-react";

// Mock data to simulate the SQLite database for the mockup
const MOCK_APPLICATIONS = [
  {
    id: "app_1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    name: "John Doe",
    ranchCompany: "Doe Orchards",
    town: "Fresno",
    crops: "Almonds, Pistachios",
    acresBand: "500-999",
    role: "Owner",
    phone: "555-0123",
    email: "john@doeorchards.com",
    ranchCount: "2-3",
    needsMultiRanch: true,
    commitPilot: true,
    commitProofPoints: true,
    commitIntroPerMonth: true,
  },
  {
    id: "app_2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    name: "Jane Smith",
    ranchCompany: "Valley Citrus Co.",
    town: "Visalia",
    crops: "Citrus, Stone Fruit",
    acresBand: "1000+",
    role: "Ranch Manager",
    phone: "555-0456",
    email: "jane@valleycitrus.com",
    ranchCount: "4+",
    needsMultiRanch: true,
    commitPilot: true,
    commitProofPoints: true,
    commitIntroPerMonth: true,
  },
  {
    id: "app_3",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    name: "Mike Johnson",
    ranchCompany: "Johnson Family Farms",
    town: "Reedley",
    crops: "Stone Fruit",
    acresBand: "200-499",
    role: "PCA",
    phone: "555-0789",
    email: "mike@jffarms.com",
    ranchCount: "1",
    needsMultiRanch: false,
    commitPilot: true,
    commitProofPoints: true,
    commitIntroPerMonth: true,
  }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { // Simple mock password
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleCopyLead = (app: typeof MOCK_APPLICATIONS[0]) => {
    const text = `Name: ${app.name}\nCompany: ${app.ranchCompany}\nEmail: ${app.email}\nPhone: ${app.phone}\nAcres: ${app.acresBand}`;
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const filteredApps = MOCK_APPLICATIONS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.ranchCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.town.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-[#E85D04] selection:text-white">
        <div className="max-w-sm w-full bg-[#111113] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#E85D04]" />
            </div>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-2 text-center">Guild Admin</h1>
          <p className="text-sm text-gray-500 text-center mb-8 font-medium">Enter password to view applications</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                placeholder="Password"
                className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white focus:border-[#E85D04] focus:outline-none transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-[#E85D04] hover:bg-[#ff6a00] text-white py-3 rounded font-black uppercase tracking-widest text-sm transition-colors"
            >
              Access Data
            </button>
          </form>
          <div className="mt-6 text-center text-xs text-gray-600">
            Mockup Mode: Use 'admin123'
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E85D04] selection:text-white">
      <header className="bg-[#111113] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#E85D04] rounded flex items-center justify-center font-black text-white text-xl">K</div>
          <h1 className="text-xl font-black uppercase tracking-tighter">Guild Applications</h1>
          <span className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ml-2">
            {MOCK_APPLICATIONS.length} Total
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search..."
              className="bg-black border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:border-[#E85D04] focus:outline-none w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-3 py-1.5 rounded font-bold uppercase tracking-widest text-[10px] transition-colors">
            <Download className="w-3 h-3" /> CSV
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500">Date</th>
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500">Lead</th>
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500">Location</th>
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500">Operation</th>
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500">Contact</th>
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500 text-center">Commits</th>
              <th className="pb-3 font-bold uppercase tracking-widest text-[10px] text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 text-gray-400 whitespace-nowrap">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <div className="font-bold text-white">{app.name}</div>
                  <div className="text-xs text-gray-500">{app.role}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-gray-300">{app.ranchCompany}</div>
                  <div className="text-xs text-gray-500">{app.town}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-gray-300">{app.acresBand} ac ({app.ranchCount} locs)</div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]" title={app.crops}>{app.crops}</div>
                </td>
                <td className="py-4">
                  <div className="font-medium text-gray-300">{app.email}</div>
                  <div className="text-xs text-gray-500">{app.phone}</div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex justify-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${app.commitPilot ? 'bg-green-500' : 'bg-gray-700'}`} title="Pilot Commited"></div>
                    <div className={`w-2 h-2 rounded-full ${app.commitProofPoints ? 'bg-green-500' : 'bg-gray-700'}`} title="Proof Points Commited"></div>
                    <div className={`w-2 h-2 rounded-full ${app.commitIntroPerMonth ? 'bg-green-500' : 'bg-gray-700'}`} title="Intros Commited"></div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => handleCopyLead(app)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                    title="Copy Lead Info"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-medium">
            No applications found matching "{searchTerm}"
          </div>
        )}
      </main>
    </div>
  );
}
