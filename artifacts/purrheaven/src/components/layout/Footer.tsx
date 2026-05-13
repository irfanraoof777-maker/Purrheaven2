import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="font-serif text-2xl font-bold text-primary mb-4 block">PurrHeaven</Link>
          <p className="text-muted-foreground text-sm max-w-sm">A warm, heartfelt cat adoption platform for India. Connecting cats in need with kind-hearted families ready to give them a forever home.</p>
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-foreground mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/cats" className="hover:text-primary transition-colors">Browse Cats</Link></li>
            <li><Link href="/post" className="hover:text-primary transition-colors">Post a Cat</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-serif font-semibold text-foreground mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Fostering Guidelines</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PurrHeaven. All rights reserved.</p>
      </div>
    </footer>
  );
}
