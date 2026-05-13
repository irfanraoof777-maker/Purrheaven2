import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import BrowseCats from "@/pages/cats/index";
import CatDetail from "@/pages/cats/[id]";
import PostCat from "@/pages/post";
import Login from "@/pages/login";
import MyListings from "@/pages/my-listings";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import AdminPanel from "@/pages/admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/cats" component={BrowseCats} />
                <Route path="/cats/:id" component={CatDetail} />
                <Route path="/post" component={PostCat} />
                <Route path="/login" component={Login} />
                <Route path="/my-listings" component={MyListings} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/admin" component={AdminPanel} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
