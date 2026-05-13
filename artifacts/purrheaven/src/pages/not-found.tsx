import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-serif text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button data-testid="button-go-home">Back to Home</Button>
      </Link>
    </div>
  );
}
