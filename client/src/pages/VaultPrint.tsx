import { useStore } from "@/lib/store";
import { getActiveSeasonWindow } from "@/utils/season";
import { isWithin, todayPacificISO } from "@/utils/dates";
import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";

// Deterministic Sort - same as Vault.tsx
const sortLogsDeterministic = (logs: any[]) => {
  return [...logs].sort((a, b) => {
    if (a.dateApplied !== b.dateApplied) return a.dateApplied.localeCompare(b.dateApplied);
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.chemicalName.localeCompare(b.chemicalName);
  });
};

export default function VaultPrint() {
  const { id } = useParams();
  const blocks = useStore(s => s.blocks);
  const chemApps = useStore(s => s.chemicalApps);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});

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

  // Split into categories and sort deterministically
  const sprays = sortLogsDeterministic(blockChemApps.filter(app => 
    ['FUNGICIDE', 'INSECTICIDE', 'HERBICIDE', 'ADJUVANT', 'OTHER'].includes(app.category)
  ));
  
  const fertility = sortLogsDeterministic(blockChemApps.filter(app => app.category === 'FERTILIZER'));
  
  // Totals - only sum finite estimatedCosts
  const sumCosts = (apps: any[]) => apps.reduce((sum, app) => sum + (Number.isFinite(app.estimatedCost) ? app.estimatedCost : 0), 0);
  
  const seasonSpend = sumCosts(blockChemApps);
  const spraySpend = sumCosts(sprays);
  const fertSpend = sumCosts(fertility);
  
  const totalApps = blockChemApps.length;
  const logsWithCost = blockChemApps.filter(app => Number.isFinite(app.estimatedCost)).length;

  const toggleNote = (id: string) => {
    setExpandedNotes(prev => ({...prev, [id]: !prev[id]}));
  };

  const renderNote = (app: any) => {
    if (!app.notes) return null;
    const isExpanded = expandedNotes[app.id || `${app.dateApplied}-${app.chemicalName}`];
    const shouldTruncate = app.notes.length > 80;

    return (
      <div className="text-gray-600 text-xs mt-1">
        Notes: <strong className="text-black">
          {shouldTruncate && !isExpanded ? `${app.notes.substring(0, 80)}...` : app.notes}
        </strong>
        {shouldTruncate && (
          <button 
            onClick={() => toggleNote(app.id || `${app.dateApplied}-${app.chemicalName}`)}
            className="no-print ml-2 text-blue-600 hover:underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0.75in; size: letter; }
          body { counter-reset: page; }
          .page-break-before { page-break-before: always; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #666;
            padding-bottom: 0.25in;
          }
        }
      `}} />
      <div className="print-packet min-h-screen bg-white text-black p-8 font-sans pb-24 relative">
        <div className="no-print mb-8">
          <Link href="/app/vault" className="flex items-center gap-2 text-primary font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Vault
          </Link>
        </div>

        {/* Cover / Header */}
        <div className="border-b-4 border-black pb-6 mb-8 avoid-break">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">KEBB Ag™ Season Packet</h1>
          <h2 className="text-2xl font-bold mb-4">{block.name} — {block.acreage} AC</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Crop Details</p>
              <p><strong>Variety:</strong> {block.variety}</p>
              <p><strong>Irrigation:</strong> {block.irrigationType} — {block.waterTargetAcreFeet} ac-ft</p>
              <p><strong>Yield Target:</strong> {block.yieldTargetBins} bins/ac</p>
            </div>
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Season Context</p>
              <p className="font-bold">{seasonWindow.label}</p>
              <p className="text-sm">{seasonWindow.startISO} to {seasonWindow.endISO}</p>
              <p className="text-gray-500 italic mt-1 text-xs">Dates default to Pacific Time (CA).</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-6">
            Generated on: {todayPacificISO()}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-12 border-b border-gray-300 pb-8 avoid-break">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-4">
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Season Spend</p>
              <p className="text-3xl font-black">${seasonSpend.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Total Apps</p>
              <p className="text-3xl font-black">{totalApps}</p>
            </div>
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Sprays</p>
              <p className="text-xl font-black mb-1">${spraySpend.toLocaleString()}</p>
              <p className="text-sm font-bold text-gray-500">{sprays.length} apps</p>
            </div>
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-1">Fertility</p>
              <p className="text-xl font-black mb-1">${fertSpend.toLocaleString()}</p>
              <p className="text-sm font-bold text-gray-500">{fertility.length} apps</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <p className="font-bold text-gray-500 uppercase tracking-widest">
              Cost Coverage: <strong className="text-black">{logsWithCost}/{totalApps}</strong>
              {totalApps > 0 ? ` (${Math.round((logsWithCost/totalApps)*100)}%)` : ''}
            </p>
            <p className="italic text-gray-500">Some applications may not have costs entered.</p>
          </div>
        </div>

        {/* Sprays Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-gray-300 pb-2">Sprays & Chemicals</h3>
          {sprays.length > 0 ? (
            <div className="w-full text-left text-sm border-t-2 border-black pt-2">
              <div className="flex font-bold uppercase tracking-widest text-xs pb-2 border-b border-gray-300 mb-2">
                <div className="w-24">Date</div>
                <div className="w-32">Category</div>
                <div className="flex-1">Product</div>
                <div className="w-24">Method</div>
                <div className="w-24 text-right">Cost</div>
              </div>
              {sprays.map(app => (
                <div key={app.id || `${app.dateApplied}-${app.chemicalName}`} className="flex py-3 border-b border-gray-200 avoid-break items-start">
                  <div className="w-24 font-bold">{app.dateApplied}</div>
                  <div className="w-32">
                    <span className="border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-50">
                      {app.category}
                    </span>
                  </div>
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-base leading-none mb-1">{app.chemicalName}</p>
                    {renderNote(app)}
                  </div>
                  <div className="w-24">
                    <span className="border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-gray-600">
                      {app.method}
                    </span>
                  </div>
                  <div className="w-24 flex flex-col items-end gap-1">
                    <span className="font-bold">
                      {Number.isFinite(app.estimatedCost) ? `$${app.estimatedCost.toLocaleString()}` : '—'}
                    </span>
                    {app.costStatus === 'UNIT_MISMATCH' && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 border border-gray-300 px-1 py-0.5 rounded">
                        Unit Mismatch
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic avoid-break">No sprays recorded.</p>
          )}
        </div>

        {/* Fertility Section */}
        <div className="mb-12 page-break-before">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-gray-300 pb-2">Fertility Program</h3>
          {fertility.length > 0 ? (
            <div className="w-full text-left text-sm border-t-2 border-black pt-2">
              <div className="flex font-bold uppercase tracking-widest text-xs pb-2 border-b border-gray-300 mb-2">
                <div className="w-24">Date</div>
                <div className="w-32">Category</div>
                <div className="flex-1">Product</div>
                <div className="w-24">Method</div>
                <div className="w-24 text-right">Cost</div>
              </div>
              {fertility.map(app => (
                <div key={app.id || `${app.dateApplied}-${app.chemicalName}`} className="flex py-3 border-b border-gray-200 avoid-break items-start">
                  <div className="w-24 font-bold">{app.dateApplied}</div>
                  <div className="w-32">
                    <span className="border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-50">
                      {app.category}
                    </span>
                  </div>
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-base leading-none mb-1">{app.chemicalName}</p>
                    {renderNote(app)}
                  </div>
                  <div className="w-24">
                    <span className="border border-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-gray-600">
                      {app.method}
                    </span>
                  </div>
                  <div className="w-24 flex flex-col items-end gap-1">
                    <span className="font-bold">
                      {Number.isFinite(app.estimatedCost) ? `$${app.estimatedCost.toLocaleString()}` : '—'}
                    </span>
                    {app.costStatus === 'UNIT_MISMATCH' && (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 border border-gray-300 px-1 py-0.5 rounded">
                        Unit Mismatch
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic avoid-break">No fertility records.</p>
          )}
        </div>

        {/* Print Footer */}
        <div className="print-footer hidden print:block">
          {block.name} • {seasonWindow.startISO} to {seasonWindow.endISO}
        </div>
      </div>
    </>
  );
}
