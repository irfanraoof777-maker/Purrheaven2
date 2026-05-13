import { Link } from "wouter";
import { useListCats, useGetStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Heart, Users, Cat } from "lucide-react";

function CatCard({ cat }: { cat: { id: string; name: string; age: number; ageUnit: string; city: string; photo1: string; spayedNeutered: boolean; healthNotes: string } }) {
  return (
    <Link href={`/cats/${cat.id}`}>
      <Card
        data-testid={`card-cat-${cat.id}`}
        className="group cursor-pointer overflow-hidden border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={cat.photo1}
            alt={cat.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-xl font-semibold text-foreground">{cat.name}</h3>
            <span className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
              {cat.age} {cat.ageUnit}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{cat.city}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{cat.healthNotes}</p>
          {cat.spayedNeutered && (
            <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Spayed / Neutered
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/60 shadow-sm">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <span className="font-serif text-3xl font-bold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

export default function Home() {
  const { data: cats, isLoading: catsLoading } = useListCats();
  const { data: stats, isLoading: statsLoading } = useGetStats();

  const featured = cats?.slice(0, 3) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 right-12 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-48 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
            India's Cat Fostering Community
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Every cat deserves a<br />
            <span className="text-primary">warm, loving home.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            PurrHeaven connects cats in need of temporary shelter with kind-hearted fosters across India. 
            Open your home, change a life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cats">
              <Button
                data-testid="button-browse-cats"
                size="lg"
                className="rounded-full px-8 text-base font-medium shadow-lg shadow-primary/20"
              >
                Browse Cats
              </Button>
            </Link>
            <Link href="/post">
              <Button
                data-testid="button-post-cat"
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base font-medium"
              >
                Post a Cat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          {statsLoading ? (
            <div className="grid grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard icon={Cat} value={stats.totalCats} label="Cats Listed" />
              <StatCard icon={MapPin} value={stats.citiesCovered} label="Cities Covered" />
              <StatCard icon={Users} value={stats.happyFosters} label="Happy Fosters" />
            </div>
          ) : null}
        </div>
      </section>

      {/* Featured Cats */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Featured Cats</h2>
              <p className="text-muted-foreground mt-1">Meet some wonderful cats looking for a foster home</p>
            </div>
            <Link href="/cats">
              <Button variant="ghost" className="text-primary hover:text-primary/80" data-testid="link-view-all-cats">
                View all &rarr;
              </Button>
            </Link>
          </div>
          {catsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((cat) => <CatCard key={cat.id} cat={cat} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="font-serif text-3xl font-bold mb-4">Ready to make a difference?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Fostering a cat is one of the most rewarding things you can do. It doesn't have to be forever — just long enough for them to find their forever home.
          </p>
          <Link href="/cats">
            <Button
              data-testid="button-start-fostering"
              variant="secondary"
              size="lg"
              className="rounded-full px-8 text-base font-medium bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Start Fostering Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
