import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
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
      <Route path="/app/chemicals">
        <Shell><Chemicals /></Shell>
      </Route>
      <Route path="/app/chemicals/new">
        <Shell><ChemicalNew /></Shell>
      </Route>
      <Route path="/app/vault">
        <Shell><Vault /></Shell>
      </Route>
      <Route path="/app/pricing">
        <Shell><Pricing /></Shell>
      </Route>
      <Route path="/app/settings/billing">
        <Shell><Billing /></Shell>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
