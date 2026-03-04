import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { glossaryData, categories } from "@/data/glossary";

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTerms = useMemo(() => {
    return glossaryData
      .filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.definition.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || item.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-0 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Glossary</h1>
        <p className="text-muted-foreground font-medium mt-1">Field-ready terms for logging, costs, compliance, and projections.</p>
      </div>

      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms..."
            className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto gap-2 mt-4 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mt-2">
        {filteredTerms.length > 0 ? (
          filteredTerms.map(item => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-5 hover:border-white/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <h3 className="text-lg font-bold text-primary">{item.term}</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-1 rounded w-fit">
                  {item.category}
                </span>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground font-medium">No terms found. Try a different search.</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-4 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
