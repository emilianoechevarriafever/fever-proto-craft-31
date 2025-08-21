import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PrototypeRouter from "./pages/PrototypeRouter";
import Analytics from "./pages/Analytics";
import BookingConfirmation from "./pages/BookingConfirmation";
import NotFound from "./pages/NotFound";
import ScrollRestore from "./components/ScrollRestore";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollRestore />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prototype/:prototypeId/:calendarType" element={<PrototypeRouter />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
