import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Block, ChemicalApp, Recommendation } from "@/hooks/useData";
import { format, parseISO, startOfMonth, addMonths, endOfMonth, isWithinInterval, subMonths } from "date-fns";

interface BudgetTimelineProps {
  block: Block;
  apps: ChemicalApp[];
  recommendations: Recommendation[];
}

export function BudgetTimeline({ block, apps, recommendations }: BudgetTimelineProps) {
  // Simple mock data generator for the season timeline based on actuals vs estimates
  const data = useMemo(() => {
    // Generate a 6-month season starting 2 months ago
    const start = startOfMonth(subMonths(new Date(), 2));
    const points = [];
    
    let cumulativeActual = 0;
    let cumulativeEstimated = 0;
    
    // Sort apps by date
    const sortedApps = [...apps].sort((a, b) => new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime());
    
    for (let i = 0; i < 6; i++) {
      const currentMonth = addMonths(start, i);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const monthLabel = format(currentMonth, 'MMM');
      
      // Calculate actuals for this month
      const monthApps = sortedApps.filter(a => {
        const d = new Date(a.dateApplied);
        return isWithinInterval(d, { start: monthStart, end: monthEnd });
      });
      
      const monthSpend = monthApps.reduce((sum, app) => sum + (app.estimatedCost || 0), 0);
      
      // Add some realistic variation for the estimated path
      const baseEstimate = (block.acreage * 45) / 6; // Rough math: $45/ac over 6 months
      const monthEstimate = baseEstimate + (Math.random() * 200 - 100); 
      
      if (currentMonth <= new Date()) {
        cumulativeActual += monthSpend;
        cumulativeEstimated += monthEstimate;
        
        points.push({
          month: monthLabel,
          actual: cumulativeActual,
          estimated: cumulativeEstimated,
        });
      } else {
        cumulativeEstimated += monthEstimate;
        
        points.push({
          month: monthLabel,
          actual: null, // Future months have no actuals yet
          estimated: cumulativeEstimated,
        });
      }
    }
    
    return points;
  }, [block, apps]);

  const latestActual = data.findLast(d => d.actual !== null);
  const isOverBudget = latestActual ? latestActual.actual > latestActual.estimated : false;

  return (
    <div className="w-full h-64 mt-4">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cumulative Season Spend</p>
          <p className="text-2xl font-black text-foreground mt-1">
            ${latestActual?.actual?.toLocaleString() || 0}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</p>
          <p className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
            {isOverBudget ? 'Trending Over' : 'On Budget'}
          </p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#666" 
            tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} 
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#666" 
            tickFormatter={(val) => `$${val}`} 
            tick={{ fill: '#888', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111113', borderColor: '#333', borderRadius: '8px' }}
            itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
            labelStyle={{ color: '#888', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
          />
          <Line 
            type="monotone" 
            dataKey="estimated" 
            name="PCA Target"
            stroke="#888" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="actual" 
            name="Actual Spend"
            stroke="#ea993d" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#ea993d', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
