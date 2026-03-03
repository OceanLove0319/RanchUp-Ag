import { useStore } from "@/lib/store";
import { getActiveSeasonWindow } from "@/utils/season";
import { isWithin } from "@/utils/dates";
import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function VaultPrint() {
  const { id } = useParams();
  const blocks = useStore(s => s.blocks);
  const chemApps = useStore(s => s.chemicalApps);

  const block = blocks.find(b => b.id === id);

  useEffect(() => {
    // Only auto-print if block exists
    if (block) {
      // Small timeout to let styles apply
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [block]);

  if (!block) {
    return <div className="p-8 text-center">Block not found. <Link href="/app/vault" className="text-primary underline">Back to Vault</Link></div>;
  }

  const seasonWindow = getActiveSeasonWindow(block);

  // Filter logs for the selected block within the active season window
  const blockChemApps = chemApps.filter(app => 
    app.blockId === id && isWithin(app.dateApplied, seasonWindow.startISO, seasonWindow.endISO)
  );

  // Split into categories
  const sprays = blockChemApps.filter(app => 
    ['FUNGICIDE', 'INSECTICIDE', 'HERBICIDE', 'ADJUVANT', 'OTHER'].includes(app.category)
  ).sort((a, b) => new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime()); // Chronological for print
  
  const fertility = blockChemApps.filter(app => app.category === 'FERTILIZER')
    .sort((a, b) => new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime());
  
  // Totals
  const seasonSpend = blockChemApps.reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
  const totalApps = blockChemApps.length;

  return (
    <div className="print-packet min-h-screen bg-white text-black p-8 font-sans">
      <div className="no-print mb-8">
        <Link href="/app/vault" className="flex items-center gap-2 text-primary font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Vault
        </Link>
      </div>

      {/* Cover / Header */}
      <div className="border-b-4 border-black pb-6 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">KEBB Ag™ Season Packet</h1>
        <h2 className="text-2xl font-bold mb-4">{block.name} — {block.acreage} AC</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Crop Details</p>
            <p><strong>Variety:</strong> {block.variety}</p>
            <p><strong>Irrigation:</strong> {block.irrigationType}</p>
            <p><strong>Yield Target:</strong> {block.yieldTargetBins} bins/ac</p>
          </div>
          <div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Season Context</p>
            <p className="font-bold">{seasonWindow.label}</p>
            <p className="text-gray-500">Dates strictly recorded in Pacific Time.</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-12 mb-12 border-b border-gray-300 pb-8">
        <div>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Season Spend</p>
          <p className="text-3xl font-black">${seasonSpend.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Total Applications</p>
          <p className="text-3xl font-black">{totalApps}</p>
        </div>
      </div>

      {/* Sprays Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-gray-300 pb-2">Sprays & Chemicals</h3>
        {sprays.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold uppercase tracking-widest text-xs w-24">Date</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs w-24">Category</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs">Product</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs w-24">Method</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs text-right w-24">Cost</th>
              </tr>
            </thead>
            <tbody>
              {sprays.map(app => (
                <tr key={app.id} className="border-b border-gray-200">
                  <td className="py-3 font-bold">{app.dateApplied}</td>
                  <td className="py-3"><span className="badge px-2 py-0.5 rounded text-[10px] font-bold uppercase">{app.category}</span></td>
                  <td className="py-3">
                    <p className="font-bold text-base">{app.chemicalName}</p>
                    {app.notes && <p className="text-gray-600 text-xs mt-1">Note: {app.notes}</p>}
                  </td>
                  <td className="py-3">{app.method}</td>
                  <td className="py-3 text-right font-bold">{app.estimatedCost ? `$${app.estimatedCost.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 italic">No sprays recorded.</p>
        )}
      </div>

      {/* Fertility Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-gray-300 pb-2">Fertility Program</h3>
        {fertility.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2 font-bold uppercase tracking-widest text-xs w-24">Date</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs">Product</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs w-24">Method</th>
                <th className="py-2 font-bold uppercase tracking-widest text-xs text-right w-24">Cost</th>
              </tr>
            </thead>
            <tbody>
              {fertility.map(app => (
                <tr key={app.id} className="border-b border-gray-200">
                  <td className="py-3 font-bold">{app.dateApplied}</td>
                  <td className="py-3">
                    <p className="font-bold text-base">{app.chemicalName}</p>
                    {app.notes && <p className="text-gray-600 text-xs mt-1">Note: {app.notes}</p>}
                  </td>
                  <td className="py-3">{app.method}</td>
                  <td className="py-3 text-right font-bold">{app.estimatedCost ? `$${app.estimatedCost.toLocaleString()}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 italic">No fertility records.</p>
        )}
      </div>

      <div className="mt-16 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
        Generated by KEBB Ag™ • {new Date().toLocaleDateString('en-US')}
      </div>
    </div>
  );
}
