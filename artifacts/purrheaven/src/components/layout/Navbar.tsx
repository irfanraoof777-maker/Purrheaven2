import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, User as UserIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { data: user, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const logout = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setLocation("/");
      }
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-primary">PurrHeaven</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cats" className="text-sm font-medium hover:text-primary transition-colors">Browse Cats</Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isError && user ? (
            <>
              <Link href="/post">
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                  <PlusCircle className="w-4 h-4" /> Post a Cat
                </Button>
              </Link>
              <Link href="/my-listings">
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
                  <UserIcon className="w-4 h-4" /> My Listings
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">Login</Button>
            </Link>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 rounded-full px-6">
                Donate 💛
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md text-center">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl mb-2">Payment gateway coming soon!</DialogTitle>
                <DialogDescription className="text-base text-foreground/80">
                  Thank you for your generosity 🐾<br/> Every rupee helps a cat find a home.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
