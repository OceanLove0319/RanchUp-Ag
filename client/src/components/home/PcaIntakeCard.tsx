import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/lib/store";
import { packerShipperSchema, restrictedMaterialSchema, type PcaIntake, type PackerShipperIntake, type RestrictedMaterialIntake, defaultPackerShipper, defaultRestrictedMaterial } from "@/schemas/pcaIntake";
import { FileText, Printer, Save, History, ChevronDown, ChevronUp, AlertCircle, RefreshCw, Check } from "lucide-react";
import { z } from "zod";

const STORAGE_KEY = "kebb_pca_intakes";

export default function PcaIntakeCard() {
  const [activeTab, setActiveTab] = useState<"PACKER_SHIPPER" | "RESTRICTED_MATERIAL">("PACKER_SHIPPER");
  const [savedIntakes, setSavedIntakes] = useState<PcaIntake[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Shared state via zustand
  const blocks = useStore((s: any) => s.blocks);
  const activeRanchId = useStore((s: any) => s.activeRanchId);

  // Form states
  const [psForm, setPsForm] = useState<Partial<PackerShipperIntake>>(defaultPackerShipper);
  const [rmForm, setRmForm] = useState<Partial<RestrictedMaterialIntake>>(defaultRestrictedMaterial);

  // Load saved intakes on mount
  useEffect(() => {
    const loaded = localStorage.getItem(STORAGE_KEY);
    if (loaded) {
      try {
        setSavedIntakes(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse saved intakes", e);
      }
    }
  }, []);

  // Block change handlers
  const handleBlockChange = (blockId: string, formSetter: any, currentForm: any) => {
    const block = blocks.find((b: any) => b.id === blockId);
    if (block) {
      formSetter({
        ...currentForm,
        blockId: block.id,
        blockName: block.name,
        acresTreated: block.acres,
        crop: block.crop,
        variety: block.variety || "",
      });
    } else {
      formSetter({
        ...currentForm,
        blockId,
        blockName: "",
        acresTreated: 0,
        crop: "",
        variety: "",
      });
    }
  };

  const handleSave = () => {
    setErrors({});
    let validatedData: any;
    
    try {
      if (activeTab === "PACKER_SHIPPER") {
        validatedData = packerShipperSchema.parse({
          ...psForm,
          id: psForm.id || uuidv4(),
          createdAt: psForm.createdAt || new Date().toISOString(),
        });
      } else {
        validatedData = restrictedMaterialSchema.parse({
          ...rmForm,
          id: rmForm.id || uuidv4(),
          createdAt: rmForm.createdAt || new Date().toISOString(),
        });
      }

      // Save to localStorage
      const newIntakes = [validatedData, ...savedIntakes.filter(i => i.id !== (validatedData as any).id)].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newIntakes));
      setSavedIntakes(newIntakes);
      
      // Show toast
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
      
      // If new, update form with generated ID
      if (activeTab === "PACKER_SHIPPER" && !psForm.id) setPsForm(validatedData as PackerShipperIntake);
      if (activeTab === "RESTRICTED_MATERIAL" && !rmForm.id) setRmForm(validatedData as RestrictedMaterialIntake);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleReset = () => {
    if (activeTab === "PACKER_SHIPPER") setPsForm(defaultPackerShipper);
    else setRmForm(defaultRestrictedMaterial);
    setErrors({});
  };

  const handleLoadIntake = (intake: PcaIntake) => {
    if (intake.type === "PACKER_SHIPPER") {
      setActiveTab("PACKER_SHIPPER");
      setPsForm(intake);
    } else {
      setActiveTab("RESTRICTED_MATERIAL");
      setRmForm(intake);
    }
    setErrors({});
    setShowSaved(false);
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  // Checkbox array helper
  const handleCheckboxArray = (field: string, value: string, checked: boolean, formState: any, setFormState: any) => {
    const currentArray = formState[field] as string[] || [];
    if (checked) {
      setFormState({ ...formState, [field]: [...currentArray, value] });
    } else {
      setFormState({ ...formState, [field]: currentArray.filter((v: string) => v !== value) });
    }
  };

  // Field error display component
  const ErrorMsg = ({ field }: { field: string }) => {
    if (!errors[field]) return null;
    return <p className="text-red-400 text-[10px] uppercase font-bold tracking-widest mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors[field]}</p>;
  };

  // Print Mode Overlay
  if (isPrintMode) {
    const data = activeTab === "PACKER_SHIPPER" ? psForm : rmForm;
    return (
      <div className="fixed inset-0 bg-white z-[9999] p-8 text-white overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">PCA Intake Record</h1>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">
                {activeTab === "PACKER_SHIPPER" ? "Packer-Shipper Audited" : "Restricted-Material Heavy"}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Record ID: {data.id ? data.id.substring(0,8) : 'Unsaved'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="border border-gray-300 p-4 rounded">
              <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">Block Identity</h2>
              <p><span className="font-semibold">Block:</span> {data.blockName || 'N/A'}</p>
              <p><span className="font-semibold">Acres Treated:</span> {data.acresTreated || 'N/A'}</p>
              <p><span className="font-semibold">Crop/Variety:</span> {data.crop || 'N/A'} {data.variety ? `(${data.variety})` : ''}</p>
            </div>
            
            {activeTab === "PACKER_SHIPPER" && (
              <div className="border border-gray-300 p-4 rounded">
                <h2 className="font-bold uppercase text-xs tracking-widest text-gray-500 mb-2 border-b border-gray-200 pb-1">Operation Contacts</h2>
                <p><span className="font-semibold">Operation:</span> {psForm.operationName || 'N/A'}</p>
                <p><span className="font-semibold">PCA:</span> {psForm.pcaName || 'N/A'}</p>
                <p><span className="font-semibold">Packer:</span> {psForm.packerShipper || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {activeTab === "PACKER_SHIPPER" ? (
              <>
                <div>
                  <h3 className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Market & Timing</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Intended Market:</span> {psForm.intendedMarket}</p>
                    <p><span className="font-semibold">Harvest Window:</span> {psForm.estimatedHarvestWindowStart} to {psForm.estimatedHarvestWindowEnd}</p>
                    <p className="col-span-2"><span className="font-semibold">Buyer Restrictions:</span> {psForm.buyerRestrictions ? 'Yes - ' + psForm.restrictionsNotes : 'No'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Current Issue</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Type:</span> {psForm.issueType}</p>
                    <p><span className="font-semibold">Location:</span> {psForm.locationInBlock}</p>
                    <p className="col-span-2"><span className="font-semibold">Observations:</span> {psForm.observations}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Compliance & Sites</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Restricted Materials Program:</span> {rmForm.restrictedMaterialsProgram ? 'Yes' : 'No'}</p>
                    <p><span className="font-semibold">County:</span> {rmForm.county || 'N/A'}</p>
                    <p className="col-span-2"><span className="font-semibold">Sensitive Sites Nearby:</span> {rmForm.sensitiveSitesNearby ? 'Yes - ' + rmForm.sensitiveSiteTypes?.join(', ') : 'No'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold uppercase bg-gray-100 px-2 py-1 mb-2">Execution Controls</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p className="col-span-2"><span className="font-semibold">Application Methods:</span> {rmForm.applicationMethodsAvailable?.join(', ')}</p>
                    <p className="col-span-2"><span className="font-semibold">Upcoming Operations:</span> {rmForm.upcomingOperationsDatesNotes}</p>
                    <p><span className="font-semibold">Prohibitions:</span> {rmForm.productProhibitionsPresent ? 'Yes - ' + rmForm.knownNoGoList : 'None known'}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-12 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">
            CONFIDENTIAL RECORD • DO NOT DISTRIBUTE WITHOUT PERMISSION
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden mb-8">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" /> PCA Intake
            </h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">Capture the facts PCAs need—fast—then export a clean packet.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowSaved(!showSaved)}
              className="px-3 py-1.5 bg-background border border-border rounded text-xs font-bold uppercase tracking-widest hover:border-primary/50 transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <History className="w-3.5 h-3.5" /> Saved
            </button>
            <button 
              onClick={handleReset}
              className="px-3 py-1.5 bg-background border border-border rounded text-xs font-bold uppercase tracking-widest hover:border-primary/50 transition-colors flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Saved Intakes Dropdown */}
      {showSaved && (
        <div className="bg-background border-b border-border p-4 max-h-48 overflow-y-auto">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Recent Intakes</h3>
          {savedIntakes.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No saved intakes yet.</p>
          ) : (
            <div className="space-y-2">
              {savedIntakes.map(intake => (
                <button 
                  key={intake.id}
                  onClick={() => handleLoadIntake(intake)}
                  className="w-full text-left p-3 rounded bg-card border border-border hover:border-primary/50 transition-colors flex justify-between items-center group"
                >
                  <div>
                    <div className="font-bold text-sm group-hover:text-primary transition-colors">{intake.blockName || 'Unnamed Block'}</div>
                    <div className="text-xs text-muted-foreground">{new Date(intake.createdAt).toLocaleDateString()} • {intake.type === 'PACKER_SHIPPER' ? 'Packer/Shipper' : 'Restricted Mat.'}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border bg-background/50">
        <button 
          className={`flex-1 p-3 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'PACKER_SHIPPER' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          onClick={() => { setActiveTab('PACKER_SHIPPER'); setErrors({}); }}
        >
          Packer-Shipper Audited
        </button>
        <button 
          className={`flex-1 p-3 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'RESTRICTED_MATERIAL' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
          onClick={() => { setActiveTab('RESTRICTED_MATERIAL'); setErrors({}); }}
        >
          Restricted-Material Heavy
        </button>
      </div>

      <div className="p-4 md:p-6 bg-background space-y-8">
        {/* === PACKER SHIPPER FORM === */}
        {activeTab === "PACKER_SHIPPER" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* A1: Operation + Contacts */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">A1. Operation & Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Operation Name *</label>
                  <input 
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.operationName ? 'border-red-500' : 'border-border'}`}
                    value={psForm.operationName || ''}
                    onChange={e => setPsForm({...psForm, operationName: e.target.value})}
                  />
                  <ErrorMsg field="operationName" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">PCA Name *</label>
                  <input 
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.pcaName ? 'border-red-500' : 'border-border'}`}
                    value={psForm.pcaName || ''}
                    onChange={e => setPsForm({...psForm, pcaName: e.target.value})}
                  />
                  <ErrorMsg field="pcaName" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Primary Contact *</label>
                  <input 
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.primaryContactName ? 'border-red-500' : 'border-border'}`}
                    value={psForm.primaryContactName || ''}
                    onChange={e => setPsForm({...psForm, primaryContactName: e.target.value})}
                  />
                  <ErrorMsg field="primaryContactName" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Contact Phone *</label>
                  <input 
                    type="tel"
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.primaryContactPhone ? 'border-red-500' : 'border-border'}`}
                    value={psForm.primaryContactPhone || ''}
                    onChange={e => setPsForm({...psForm, primaryContactPhone: e.target.value})}
                  />
                  <ErrorMsg field="primaryContactPhone" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Packer/Shipper *</label>
                  <input 
                    placeholder="e.g. Paramount, Wonderful, etc."
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.packerShipper ? 'border-red-500' : 'border-border'}`}
                    value={psForm.packerShipper || ''}
                    onChange={e => setPsForm({...psForm, packerShipper: e.target.value})}
                  />
                  <ErrorMsg field="packerShipper" />
                </div>
              </div>
            </section>

            {/* A2: Block Identity */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">A2. Block Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Select Block *</label>
                  <select 
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none ${errors.blockId ? 'border-red-500' : 'border-border'}`}
                    value={psForm.blockId || ''}
                    onChange={e => handleBlockChange(e.target.value, setPsForm, psForm)}
                  >
                    <option value="">-- Select Block --</option>
                    {blocks.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.acres}ac {b.crop})</option>
                    ))}
                  </select>
                  <ErrorMsg field="blockId" />
                </div>
                
                {psForm.blockId && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Acres Treated *</label>
                      <input 
                        type="number"
                        step="0.1"
                        className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.acresTreated ? 'border-red-500' : 'border-border'}`}
                        value={psForm.acresTreated || ''}
                        onChange={e => setPsForm({...psForm, acresTreated: parseFloat(e.target.value)})}
                      />
                      <ErrorMsg field="acresTreated" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Crop *</label>
                      <input 
                        className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.crop ? 'border-red-500' : 'border-border'}`}
                        value={psForm.crop || ''}
                        onChange={e => setPsForm({...psForm, crop: e.target.value})}
                      />
                      <ErrorMsg field="crop" />
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* A3: Market & Buyer Constraints */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">A3. Market Constraints</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Intended Market *</label>
                  <div className="flex gap-2">
                    {["Domestic", "Export", "Both"].map(market => (
                      <button
                        key={market}
                        onClick={() => setPsForm({...psForm, intendedMarket: market as any})}
                        className={`px-4 py-2 rounded text-xs font-bold transition-colors border ${psForm.intendedMarket === market ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border hover:border-white/20'}`}
                      >
                        {market}
                      </button>
                    ))}
                  </div>
                  <ErrorMsg field="intendedMarket" />
                </div>
                
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      checked={psForm.buyerRestrictions || false}
                      onChange={e => setPsForm({...psForm, buyerRestrictions: e.target.checked})}
                    />
                    <span className="text-sm font-bold">Specific Buyer Restrictions Apply?</span>
                  </label>
                  
                  {psForm.buyerRestrictions && (
                    <textarea 
                      placeholder="List MRL constraints, specific banned active ingredients, etc."
                      className="w-full bg-card border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors mt-2"
                      rows={2}
                      value={psForm.restrictionsNotes || ''}
                      onChange={e => setPsForm({...psForm, restrictionsNotes: e.target.value})}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* A6: Current Issue (Moved up for importance) */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">A4. Current Issue / Reason for Call</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Issue Type *</label>
                  <div className="flex flex-wrap gap-2">
                    {["Pest", "Disease", "Weed", "Nutrition", "Irrigation-stress", "Other"].map(issue => (
                      <button
                        key={issue}
                        onClick={() => setPsForm({...psForm, issueType: issue as any})}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${psForm.issueType === issue ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border hover:border-white/20'}`}
                      >
                        {issue}
                      </button>
                    ))}
                  </div>
                  <ErrorMsg field="issueType" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Location in Block *</label>
                  <select 
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none ${errors.locationInBlock ? 'border-red-500' : 'border-border'}`}
                    value={psForm.locationInBlock || ''}
                    onChange={e => setPsForm({...psForm, locationInBlock: e.target.value as any})}
                  >
                    <option value="">-- Select Location --</option>
                    <option value="Whole block">Whole block</option>
                    <option value="Edges">Edges / Borders</option>
                    <option value="Hotspots">Hotspots</option>
                    <option value="Rows">Specific Rows</option>
                    <option value="Other">Other</option>
                  </select>
                  <ErrorMsg field="locationInBlock" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Observations *</label>
                  <textarea 
                    placeholder="What are you seeing? E.g. 'Mites flaring on east edge near dirt road'"
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.observations ? 'border-red-500' : 'border-border'}`}
                    rows={3}
                    value={psForm.observations || ''}
                    onChange={e => setPsForm({...psForm, observations: e.target.value})}
                  />
                  <ErrorMsg field="observations" />
                </div>
              </div>
            </section>
            
            {/* A4/A5 Combined: Timing & History */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">A5. Timing & Log History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Harvest Window Start *</label>
                    <input 
                      type="date"
                      className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.estimatedHarvestWindowStart ? 'border-red-500' : 'border-border'}`}
                      value={psForm.estimatedHarvestWindowStart || ''}
                      onChange={e => setPsForm({...psForm, estimatedHarvestWindowStart: e.target.value})}
                    />
                    <ErrorMsg field="estimatedHarvestWindowStart" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Est. Harvest Window End *</label>
                    <input 
                      type="date"
                      className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.estimatedHarvestWindowEnd ? 'border-red-500' : 'border-border'}`}
                      value={psForm.estimatedHarvestWindowEnd || ''}
                      onChange={e => setPsForm({...psForm, estimatedHarvestWindowEnd: e.target.value})}
                    />
                    <ErrorMsg field="estimatedHarvestWindowEnd" />
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded border border-border flex flex-col justify-center">
                  <label className="flex items-start gap-3 cursor-pointer group mb-2">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary mt-0.5"
                      checked={psForm.confirmLogsComplete || false}
                      onChange={e => setPsForm({...psForm, confirmLogsComplete: e.target.checked})}
                    />
                    <span className="text-sm font-bold text-foreground">Block Logs are 100% complete for last 60 days *</span>
                  </label>
                  <p className="text-xs text-muted-foreground ml-8">Crucial for PHI/REI calculations.</p>
                  <ErrorMsg field="confirmLogsComplete" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === RESTRICTED MATERIAL FORM === */}
        {activeTab === "RESTRICTED_MATERIAL" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* B0: Block Identity (Shared essentially) */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">B1. Block Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Select Block *</label>
                  <select 
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors appearance-none ${errors.blockId ? 'border-red-500' : 'border-border'}`}
                    value={rmForm.blockId || ''}
                    onChange={e => handleBlockChange(e.target.value, setRmForm, rmForm)}
                  >
                    <option value="">-- Select Block --</option>
                    {blocks.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.acres}ac {b.crop})</option>
                    ))}
                  </select>
                  <ErrorMsg field="blockId" />
                </div>
              </div>
            </section>

            {/* B2: Sensitive Sites */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">B2. Sensitive Sites & Drift Risk</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    checked={rmForm.sensitiveSitesNearby || false}
                    onChange={e => setRmForm({...rmForm, sensitiveSitesNearby: e.target.checked})}
                  />
                  <span className="text-sm font-bold text-red-400 flex items-center gap-2">Sensitive Sites Nearby? <AlertCircle className="w-4 h-4" /></span>
                </label>

                {rmForm.sensitiveSitesNearby && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Site Types Present:</label>
                      <div className="flex flex-wrap gap-2">
                        {["School/Daycare", "Homes/Residential", "Waterways/Canals", "Bee yards", "Neighboring sensitive crops"].map(site => {
                          const isChecked = rmForm.sensitiveSiteTypes?.includes(site) || false;
                          return (
                            <label key={site} className={`flex items-center gap-2 px-3 py-1.5 rounded border cursor-pointer transition-colors ${isChecked ? 'bg-red-500/20 border-red-500/50 text-white' : 'bg-background border-border text-muted-foreground'}`}>
                              <input 
                                type="checkbox" 
                                className="sr-only"
                                checked={isChecked}
                                onChange={e => handleCheckboxArray('sensitiveSiteTypes', site, e.target.checked, rmForm, setRmForm)}
                              />
                              <span className="text-xs font-bold">{site}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* B3: Application Reality */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">B3. Execution Reality</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Available Application Methods *</label>
                  <div className="space-y-2">
                    {["Airblast", "Tower", "Aerial", "Chemigation", "Spot spray"].map(method => (
                      <label key={method} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          checked={rmForm.applicationMethodsAvailable?.includes(method) || false}
                          onChange={e => handleCheckboxArray('applicationMethodsAvailable', method, e.target.checked, rmForm, setRmForm)}
                        />
                        <span className="text-sm font-medium">{method}</span>
                      </label>
                    ))}
                  </div>
                  <ErrorMsg field="applicationMethodsAvailable" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Upcoming Crew Operations (Next 14 Days) *</label>
                  <textarea 
                    placeholder="e.g. Thinning crew scheduled for Tuesday, cannot spray Monday night."
                    className={`w-full bg-card border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors ${errors.upcomingOperationsDatesNotes ? 'border-red-500' : 'border-border'}`}
                    rows={4}
                    value={rmForm.upcomingOperationsDatesNotes || ''}
                    onChange={e => setRmForm({...rmForm, upcomingOperationsDatesNotes: e.target.value})}
                  />
                  <ErrorMsg field="upcomingOperationsDatesNotes" />
                </div>
              </div>
            </section>

             {/* B4: Prohibitions */}
             <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">B4. Product Restrictions</h3>
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    checked={rmForm.productProhibitionsPresent || false}
                    onChange={e => setRmForm({...rmForm, productProhibitionsPresent: e.target.checked})}
                  />
                  <span className="text-sm font-bold">Are there any strict product NO-GOs? (Certifications, Neighbors, etc)</span>
                </label>
                
                {rmForm.productProhibitionsPresent && (
                  <input 
                    placeholder="e.g. No Neonicotinoids, No Abamectin"
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors mt-2"
                    value={rmForm.knownNoGoList || ''}
                    onChange={e => setRmForm({...rmForm, knownNoGoList: e.target.value})}
                  />
                )}
              </div>
            </section>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border mt-8">
          <button 
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground font-black uppercase tracking-widest py-3 px-6 rounded shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:bg-primary/90 transition-all flex justify-center items-center gap-2"
          >
            <Save className="w-5 h-5" /> Save Intake
          </button>
          <button 
            onClick={handlePrint}
            disabled={!psForm.id && !rmForm.id} // Disable if not saved
            className="flex-1 bg-white/5 border border-white/20 hover:bg-white/10 text-foreground font-bold uppercase tracking-widest py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <Printer className="w-5 h-5" /> Export PDF
          </button>
        </div>

        {/* Success Toast */}
        {saveToast && (
          <div className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5">
            <Check className="w-4 h-4" /> Intake saved successfully
          </div>
        )}
      </div>
    </div>
  );
}