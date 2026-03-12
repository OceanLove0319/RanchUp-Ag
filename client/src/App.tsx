import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import GuildLanding from "@/pages/guild/GuildLanding";
import Thanks from "@/pages/guild/Thanks";
import Admin from "@/pages/guild/Admin";
import HowItWorks from "@/pages/HowItWorks";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Shell from "@/components/layout/Shell";
import Home from "@/pages/Home";
import Blocks from "@/pages/Blocks";
import BlockDetail from "@/pages/BlockDetail";
import Log from "@/pages/Log";
import Vault from "@/pages/Vault";
import VaultPrint from "@/pages/VaultPrint";
import Chemicals from "@/pages/Chemicals";
import ChemicalNew from "@/pages/ChemicalNew";
import Pricing from "@/pages/Pricing";
import Billing from "@/pages/Billing";
import WeeklyPacket from "@/pages/WeeklyPacket";
import MonthlySummary from "@/pages/MonthlySummary";
import VarianceFlags from "@/pages/VarianceFlags";
import ProjectionsDashboard from "@/pages/ProjectionsDashboard";
import BlockProjectionDetail from "@/pages/BlockProjectionDetail";
import TemplatesManager from "@/pages/TemplatesManager";
import Glossary from "@/pages/Glossary";
import Recommendations from "@/pages/Recommendations";

import PacketsHome from "@/pages/packets/PacketsHome";
import PacketToday from "@/pages/packets/PacketToday";
import PacketMonthly from "@/pages/packets/PacketMonthly";
import PacketSeason from "@/pages/packets/PacketSeason";

import MaterialsProducts from "@/pages/operations/MaterialsProducts";
import InputsLibrary from "@/pages/operations/InputsLibrary";
import ProductLoggingGuide from "@/pages/help/ProductLoggingGuide";
import GrowerMaterialsGuide from "@/pages/help/GrowerMaterialsGuide";

import BudgetWatch from "@/pages/pca/BudgetWatch";
import BudgetWatchDetail from "@/pages/pca/BudgetWatchDetail";
import RecommendationNew from "@/pages/RecommendationNew";

function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/guild" component={GuildLanding} />
      <Route path="/guild/thanks" component={Thanks} />
      <Route path="/guild/admin" component={Admin} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      
      {/* Print route must be outside the normal Shell so it takes over the full page styling */}
      <Route path="/app/vault/print/:id" component={VaultPrint} />

      {/* App Routes wrapped in Shell */}
      <Route path="/app">
        <Shell><Home /></Shell>
      </Route>

      <Route path="/app/blocks">
        <Shell><Blocks /></Shell>
      </Route>
      <Route path="/app/blocks/:id">
        <Shell><BlockDetail /></Shell>
      </Route>
      <Route path="/app/log">
        <Shell><Log /></Shell>
      </Route>
      <Route path="/app/recommendations/new">
        <Shell><RecommendationNew /></Shell>
      </Route>
      <Route path="/app/recommendations">
        <Shell><Recommendations /></Shell>
      </Route>
      <Route path="/app/inputs">
        <Shell><InputsLibrary /></Shell>
      </Route>
      <Route path="/app/materials-products">
        <Shell><InputsLibrary /></Shell>
      </Route>
      <Route path="/app/chemicals">
        <Shell><InputsLibrary /></Shell>
      </Route>
      <Route path="/app/vault">
        <Shell><Vault /></Shell>
      </Route>
      <Route path="/app/projections">
        <Shell><ProjectionsDashboard /></Shell>
      </Route>
      <Route path="/app/projections/templates">
        <Shell><TemplatesManager /></Shell>
      </Route>
      <Route path="/app/projections/block/:id">
        <Shell><BlockProjectionDetail /></Shell>
      </Route>
      <Route path="/app/pricing">
        <Shell><Pricing /></Shell>
      </Route>
      <Route path="/app/settings/billing">
        <Shell><Billing /></Shell>
      </Route>
      
      <Route path="/app/packets">
        <Shell><PacketsHome /></Shell>
      </Route>
      <Route path="/app/packets/today">
        <Shell><PacketToday /></Shell>
      </Route>
      <Route path="/app/packets/monthly">
        <Shell><PacketMonthly /></Shell>
      </Route>
      <Route path="/app/packets/season">
        <Shell><PacketSeason /></Shell>
      </Route>
      
      <Route path="/app/reports/weekly">
        <Shell><WeeklyPacket /></Shell>
      </Route>
      <Route path="/app/reports/monthly">
        <Shell><MonthlySummary /></Shell>
      </Route>
      <Route path="/app/reports/variance">
        <Shell><VarianceFlags /></Shell>
      </Route>

      {/* PCA Routes */}
      <Route path="/pca/budget-watch">
        <Shell><BudgetWatch /></Shell>
      </Route>
      <Route path="/pca/budget-watch/:id">
        <Shell><BudgetWatchDetail /></Shell>
      </Route>
      
      {/* Legacy today packet, redirecting or keeping for backwards compat for now */}
      <Route path="/app/share/today">
        <Shell><PacketToday /></Shell>
      </Route>
      
      <Route path="/app/glossary">
        <Shell><Glossary /></Shell>
      </Route>
      <Route path="/app/help/product-logging">
        <Shell><ProductLoggingGuide /></Shell>
      </Route>
      <Route path="/app/help/grower-materials">
        <Shell><GrowerMaterialsGuide /></Shell>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
