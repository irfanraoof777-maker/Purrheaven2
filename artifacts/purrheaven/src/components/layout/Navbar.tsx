import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut, PlusCircle, User as UserIcon, Menu, X, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const logout = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setMobileOpen(false);
        setLocation("/");
      }
    });
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setMobileOpen(false)}
      className="text-sm font-medium hover:text-primary transition-colors"
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="font-serif text-2xl font-bold text-primary">🐱 PurrHeaven</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLink("/cats", "Browse Cats")}
          {navLink("/about", "About Us")}
          {navLink("/contact", "Contact")}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          {!isError && user ? (
            <>
              {user.isAdmin && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="gap-2 text-primary">
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </Button>
                </Link>
              )}
              <Link href="/post">
                <Button variant="ghost" size="sm" className="gap-2">
                  <PlusCircle className="w-4 h-4" /> Post a Cat
                </Button>
              </Link>
              <Link href="/my-listings">
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="w-4 h-4" /> My Listings
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 rounded-full px-6">
                Donate 🐾
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

        {/* Mobile: Donate + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-md shadow-amber-500/20 rounded-full px-4 text-xs">
                Donate 🐾
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

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-4 space-y-1">
          <MobileLink href="/cats" onClick={() => setMobileOpen(false)}>Browse Cats</MobileLink>
          <MobileLink href="/about" onClick={() => setMobileOpen(false)}>About Us</MobileLink>
          <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>

          <div className="pt-2 border-t border-border/40 mt-2 space-y-1">
            {!isError && user ? (
              <>
                {user.isAdmin && (
                  <MobileLink href="/admin" onClick={() => setMobileOpen(false)}>
                    <ShieldCheck className="w-4 h-4 text-primary" /> Admin Panel
                  </MobileLink>
                )}
                <MobileLink href="/post" onClick={() => setMobileOpen(false)}>
                  <PlusCircle className="w-4 h-4" /> Post a Cat
                </MobileLink>
                <MobileLink href="/my-listings" onClick={() => setMobileOpen(false)}>
                  <UserIcon className="w-4 h-4" /> My Listings
                </MobileLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <MobileLink href="/login" onClick={() => setMobileOpen(false)}>Login</MobileLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}
