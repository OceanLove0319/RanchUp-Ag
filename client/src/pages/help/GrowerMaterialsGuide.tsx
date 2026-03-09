import { ArrowLeft, Beaker, Sprout, ShieldAlert, Droplets, Leaf } from "lucide-react";
import { Link } from "wouter";

export default function GrowerMaterialsGuide() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-300 pb-20">
      <div className="mb-8">
        <Link href="/app" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
        </Link>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Grower Materials Guide</h1>
        <p className="text-lg text-muted-foreground font-medium">
          A practical reference for classifying your inputs within the RanchUp platform.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3 text-white">
            <Sprout className="w-6 h-6 text-green-500" /> Nutrition
          </h2>
          <p className="text-muted-foreground mb-4">
            Anything primarily applied to feed the crop. This includes macronutrients (N-P-K), secondary nutrients (Ca, Mg, S), and micronutrient blends.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2 text-white">Examples:</h3>
            <p className="text-sm text-muted-foreground">UAN-32, CAN-17, Zinc Sulfate, Potassium Nitrate, Foliar blends.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3 text-white">
            <Leaf className="w-6 h-6 text-orange-400" /> Soil & Water Amendments
          </h2>
          <p className="text-muted-foreground mb-4">
            Products applied to adjust soil structure, chemistry (pH), or water infiltration rather than directly feeding the plant.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2 text-white">Examples:</h3>
            <p className="text-sm text-muted-foreground">Gypsum, Lime, Sulfuric Acid, Water penetrants.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3 text-white">
            <ShieldAlert className="w-6 h-6 text-purple-400" /> Fungicides
          </h2>
          <p className="text-muted-foreground mb-4">
            Materials to protect against or treat fungal diseases like Brown Rot, Shot Hole, or Powdery Mildew.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2 text-white">Examples:</h3>
            <p className="text-sm text-muted-foreground">Copper, Sulfur, DMI Fungicides, SDHIs, Phosphites.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3 text-white">
            <ShieldAlert className="w-6 h-6 text-red-500" /> Herbicides
          </h2>
          <p className="text-muted-foreground mb-4">
            Weed control products, including both burn-down (post-emergent) and residual (pre-emergent) materials.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2 text-white">Examples:</h3>
            <p className="text-sm text-muted-foreground">Glyphosate, Glufosinate, Pendimethalin, Oxyfluorfen.</p>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3 text-white">
            <ShieldAlert className="w-6 h-6 text-amber-500" /> Insecticides & Miticides
          </h2>
          <p className="text-muted-foreground mb-4">
            Materials targeted at insect pests like Navel Orangeworm (NOW), Thrips, Scale, or various mite species.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2 text-white">Examples:</h3>
            <p className="text-sm text-muted-foreground">Abamectin, Horticultural Oil, Spinosad, Pyrethroids.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3 text-white">
            <Droplets className="w-6 h-6 text-blue-400" /> Adjuvants / Oils / Water Helpers
          </h2>
          <p className="text-muted-foreground mb-4">
            Additives that go into the tank mix to improve the performance, coverage, or safety of the active ingredients.
          </p>
          <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="font-bold mb-2 text-white">Examples:</h3>
            <p className="text-sm text-muted-foreground">Non-Ionic Surfactants (NIS), Crop Oil Concentrate (COC), Spreader-Stickers, Buffers.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
