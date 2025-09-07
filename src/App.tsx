import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionProvider } from "@/contexts/ConnectionContext";
import { AvatarRegistryProvider } from "@/contexts/AvatarRegistry";
import { OfficeSettingsProvider } from "@/contexts/OfficeSettings";
import { ChaosMeterProvider } from "@/contexts/ChaosMeter";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChaosMeterProvider>
      <OfficeSettingsProvider>
        <AvatarRegistryProvider>
          <ConnectionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ConnectionStatus />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ConnectionProvider>
        </AvatarRegistryProvider>
      </OfficeSettingsProvider>
    </ChaosMeterProvider>
  </QueryClientProvider>
);

export default App;
