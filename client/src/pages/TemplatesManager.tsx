import { useState } from "react";
import { Link } from "wouter";
import { useStore, ProgramTemplate, ProgramLine } from "@/lib/store";
import { ArrowLeft, PlusCircle, Edit2, Copy, Trash2, ShieldAlert, Sprout, Package, Check, X } from "lucide-react";
import UnifiedInputPicker from "@/components/products/UnifiedInputPicker";

export default function TemplatesManager() {
  const templates = useStore(s => s.templates);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [lineProducts, setLineProducts] = useState<string[]>([]);

  const activeTemplate = templates.find(t => t.id === activeTemplateId);

  const updateTemplateLine = useStore(s => s.updateTemplateLine);

  const startEditingLine = (line: ProgramLine) => {
    setEditingLineId(line.id);
    setLineProducts(line.productIds || []);
  };

  const saveLineProducts = () => {
    if (activeTemplateId && editingLineId) {
      updateTemplateLine(activeTemplateId, editingLineId, { productIds: lineProducts });
    }
    setEditingLineId(null);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <Link href="/app/projections" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">Program Templates</h1>
        <p className="text-gray-400 font-medium">Manage base chemical programs and apply them to blocks.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black uppercase tracking-tight text-white">Library</h3>
            <button className="text-primary hover:text-primary/80 transition-colors">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTemplateId(t.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  activeTemplateId === t.id 
                    ? 'bg-[#111113] border-primary' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <h4 className="font-bold text-white text-sm mb-1">{t.name}</h4>
                <div className="flex flex-wrap gap-1">
                  {t.cropTags.map(tag => (
                    <span key={tag} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground font-bold tracking-widest uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {activeTemplate ? (
            <div className="bg-[#111113] border border-white/10 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">{activeTemplate.name}</h2>
                  {activeTemplate.notes && <p className="text-sm text-muted-foreground">{activeTemplate.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-border rounded text-muted-foreground hover:text-white hover:border-white/50 transition-colors" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-border rounded text-red-500 hover:bg-red-500/10 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black uppercase tracking-tight text-white">Program Lines</h3>
                  <button className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1">
                    <PlusCircle className="w-3 h-3" /> Add Line
                  </button>
                </div>

                <div className="space-y-3">
                  {activeTemplate.lines.map((line, i) => (
                    <div key={i} className="bg-card border border-border rounded overflow-hidden">
                      <div className="p-4 flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {line.type === 'SPRAY' ? <ShieldAlert className="w-5 h-5 text-purple-400" /> : <Sprout className="w-5 h-5 text-orange-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            {line.materialName}
                            {line.productIds && line.productIds.length > 0 && (
                              <span className="bg-primary/20 text-primary text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest flex items-center">
                                <Package className="w-3 h-3 mr-1" /> {line.productIds.length}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {line.rateValue} {line.rateUnit} • {line.passesPlanned} Passes
                          </p>
                        </div>
                        <button 
                          className="p-2 text-muted-foreground hover:text-white transition-colors"
                          onClick={() => startEditingLine(line)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {editingLineId === line.id && (
                        <div className="border-t border-border p-4 bg-[#111113]">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                              <Package className="w-3 h-3 mr-2 text-primary" /> Edit Attached Products
                            </h5>
                            <button onClick={() => setEditingLineId(null)} className="text-muted-foreground hover:text-white">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="bg-background rounded-lg border border-border p-3 mb-4">
                            <UnifiedInputPicker 
                              selectedIds={lineProducts} 
                              onSelectionChange={setLineProducts} 
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingLineId(null)}
                              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white border border-border rounded"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={saveLineProducts}
                              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Save Line
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border border-dashed p-12 rounded-lg text-center text-muted-foreground h-full flex flex-col items-center justify-center">
              <span className="font-bold uppercase tracking-widest text-sm">Select a template to view details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
