import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const setOnboarded = useStore(s => s.setOnboarded);
  const addBlock = useStore(s => s.addBlock);

  const [formData, setFormData] = useState({
    operationName: "",
    crops: [] as string[],
    blockName: "",
    acreage: "",
    variety: "",
    seasonGroup: "Early",
    irrigationType: "Drip",
    yieldTarget: "30"
  });

  const crops = ["Peach", "Nectarine", "Plum", "Apricot", "Cherry", "Almond"];
  const seasons = ["Early", "Mid", "Late"];
  const irrigation = ["Flood", "Drip", "Fanjet", "Sprinkler"];
  const yields = ["20", "30", "40"];

  const handleComplete = () => {
    setOnboarded(formData);
    addBlock({
      id: Date.now().toString(),
      name: formData.blockName || "First Block",
      acreage: Number(formData.acreage) || 10,
      variety: formData.variety || "Unknown",
      seasonGroup: formData.seasonGroup,
      irrigationType: formData.irrigationType,
      yieldTargetBins: Number(formData.yieldTarget),
      waterTargetAcreFeet: 3.0
    });
    setLocation("/app");
  };

  const toggleCrop = (c: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.includes(c) ? prev.crops.filter(x => x !== c) : [...prev.crops, c]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col pt-12 md:pt-24 px-4 items-center">
      <div className="w-full max-w-xl">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 flex-1 rounded ${s <= step ? 'bg-primary' : 'bg-white/10'}`} />
          ))}
        </div>

        <div className="bg-[#111113] border border-white/10 p-6 md:p-10 rounded-lg shadow-2xl">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Step 1 of 3</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 text-white">Operation Basics</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Operation Name</label>
                  <input 
                    type="text" 
                    value={formData.operationName}
                    onChange={e => setFormData({...formData, operationName: e.target.value})}
                    placeholder="e.g. Valley Farms"
                    className="w-full bg-[#0B0B0C] border border-white/10 rounded px-4 py-4 text-white text-lg focus:outline-none focus:border-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">Primary Crops</label>
                  <div className="flex flex-wrap gap-2">
                    {crops.map(crop => (
                      <button 
                        key={crop}
                        onClick={() => toggleCrop(crop)}
                        className={`px-4 py-2 border rounded font-semibold transition-colors ${
                          formData.crops.includes(crop) 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-white/20 text-gray-400 hover:border-white/50'
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.operationName}
                className="w-full mt-10 bg-primary text-white font-black uppercase tracking-widest py-4 rounded disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Step 2 of 3</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 text-white">First Block</h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Block Name</label>
                    <input 
                      type="text" value={formData.blockName} onChange={e => setFormData({...formData, blockName: e.target.value})}
                      placeholder="North 20"
                      className="w-full bg-[#0B0B0C] border border-white/10 rounded px-3 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Acreage</label>
                    <input 
                      type="number" value={formData.acreage} onChange={e => setFormData({...formData, acreage: e.target.value})}
                      placeholder="20"
                      className="w-full bg-[#0B0B0C] border border-white/10 rounded px-3 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Variety</label>
                  <input 
                    type="text" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})}
                    placeholder="e.g. Yellow Peach"
                    className="w-full bg-[#0B0B0C] border border-white/10 rounded px-3 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Season Group</label>
                    <div className="flex flex-col gap-2">
                      {seasons.map(s => (
                        <label key={s} className={`p-3 border rounded cursor-pointer flex items-center gap-3 ${formData.seasonGroup === s ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                          <input type="radio" name="season" checked={formData.seasonGroup === s} onChange={() => setFormData({...formData, seasonGroup: s})} className="accent-primary" />
                          <span className="font-semibold text-white">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Yield Target (Bins/Ac)</label>
                    <div className="flex flex-col gap-2">
                      {yields.map(y => (
                        <label key={y} className={`p-3 border rounded cursor-pointer flex items-center gap-3 ${formData.yieldTarget === y ? 'border-primary bg-primary/5' : 'border-white/10'}`}>
                          <input type="radio" name="yield" checked={formData.yieldTarget === y} onChange={() => setFormData({...formData, yieldTarget: y})} className="accent-primary" />
                          <span className="font-semibold text-white">{y}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setStep(1)} className="px-6 border border-white/20 text-white font-bold uppercase tracking-widest py-4 rounded hover:bg-white/5 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(3)} disabled={!formData.blockName} className="flex-1 bg-primary text-white font-black uppercase tracking-widest py-4 rounded disabled:opacity-50 hover:bg-primary/90 transition-colors">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Ready</p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 text-white">Plan Preview</h2>
              
              <div className="bg-[#0B0B0C] p-6 rounded-lg border border-white/10 mb-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Target Yield</h4>
                  <p className="text-2xl font-black text-white">{formData.yieldTarget} Bins / Acre</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Fertilizer Guide</h4>
                    <p className="text-xl font-bold text-primary">250-300 <span className="text-sm font-medium text-gray-400">lbs/ac</span></p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Water Target</h4>
                    <p className="text-xl font-bold text-blue-400">3.0 <span className="text-sm font-medium text-gray-400">ac-ft</span></p>
                  </div>
                </div>
              </div>

              <button onClick={handleComplete} className="w-full bg-primary text-white font-black uppercase tracking-widest py-5 text-lg rounded shadow-[0_0_20px_rgba(253,90,30,0.4)] hover:bg-primary/90 transition-colors">
                Start Your Season
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
