import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Shell from "@/components/layout/Shell";
import Home from "@/pages/Home";
import Blocks from "@/pages/Blocks";
import BlockDetail from "@/pages/BlockDetail";
import Log from "@/pages/Log";
import Vault from "@/pages/Vault";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      
      {/* App Routes wrapped in Shell */}
      <Route path="/app/*">
        <Shell>
          <Switch>
            <Route path="/app" component={Home} />
            <Route path="/app/blocks" component={Blocks} />
            <Route path="/app/blocks/:id" component={BlockDetail} />
            <Route path="/app/log" component={Log} />
            <Route path="/app/vault" component={Vault} />
            <Route component={NotFound} />
          </Switch>
        </Shell>
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
