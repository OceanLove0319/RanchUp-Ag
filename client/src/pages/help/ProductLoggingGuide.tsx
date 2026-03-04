import { ArrowLeft, Beaker, Sprout, ShieldAlert, Droplets, Package } from "lucide-react";
import { Link } from "wouter";

export default function ProductLoggingGuide() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <Link href="/app" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
        </Link>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-primary">Product Logging Guide</h1>
        <p className="text-lg text-muted-foreground font-medium">
          A practical guide to mapping your real-world applications into KEBB Ag's product tracking categories.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3">
            <Sprout className="w-6 h-6 text-green-500" /> Seed
          </h2>
          <p className="text-muted-foreground mb-4">
            Anything related to planting. Whether it's row crop seed, cover crop blends, or young permanent crop stock.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">When to use:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                <li>Cover crop seeding</li>
                <li>New block planting</li>
                <li>Replanting operations</li>
              </ul>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">Common Units:</h3>
              <p className="text-sm text-muted-foreground">LBS/AC, Seeds/AC, Trees/AC</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3">
            <Beaker className="w-6 h-6 text-blue-500" /> Crop Nutrition
          </h2>
          <p className="text-muted-foreground mb-4">
            Materials applied to feed the crop or amend the soil. This includes traditional NPK fertilizers, micronutrients, and soil amendments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">When to use:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                <li>Fertigation runs (e.g. UAN-32, CAN-17)</li>
                <li>Foliar feeds (e.g. Zinc, Boron)</li>
                <li>Dry broadcast applications</li>
                <li>Compost or Gypsum spreading</li>
              </ul>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">Common Units:</h3>
              <p className="text-sm text-muted-foreground">GAL/AC, LBS/AC, Tons/AC</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500" /> Crop Protection
          </h2>
          <p className="text-muted-foreground mb-4">
            Materials used to defend the crop against pests, diseases, and weeds. 
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">When to use:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                <li>Fungicide bloom sprays</li>
                <li>Herbicide strip sprays</li>
                <li>Mite or insect control</li>
                <li>Defoliants or desiccants</li>
              </ul>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">Common Units:</h3>
              <p className="text-sm text-muted-foreground">OZ/AC, PT/AC, LBS/AC</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3">
            <Droplets className="w-6 h-6 text-purple-500" /> Adjuvant
          </h2>
          <p className="text-muted-foreground mb-4">
            Products added to the tank mix to improve the performance of the active ingredients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">When to use:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                <li>Surfactants to spread water droplets</li>
                <li>Stickers for rainfastness</li>
                <li>Water conditioners (e.g. AMS)</li>
                <li>Drift control agents</li>
              </ul>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="font-bold mb-2">Common Units:</h3>
              <p className="text-sm text-muted-foreground">PT/100 GAL, OZ/AC</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b border-border pb-2 flex items-center gap-3">
            <Package className="w-6 h-6 text-orange-500" /> Innvictis®
          </h2>
          <p className="text-muted-foreground mb-4">
            A specialized category for tracking Innvictis brand products specifically, making it easier to report on brand loyalty and performance.
          </p>
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
            <p className="text-sm text-orange-200">
              <strong>Tip:</strong> If you are applying an Innvictis product, categorize it here rather than the generic categories above to utilize advanced reporting features.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
