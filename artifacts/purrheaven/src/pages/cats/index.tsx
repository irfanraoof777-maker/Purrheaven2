import { useState } from "react";
import { Link } from "wouter";
import { useListCats, getListCatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { INDIAN_CITIES } from "@/lib/constants";

export default function BrowseCats() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const { data: cats, isLoading } = useListCats(undefined, {
    query: { queryKey: getListCatsQueryKey() },
  });

  const filtered = selectedCity === "all"
    ? (cats ?? [])
    : (cats ?? []).filter((c) => c.city === selectedCity);

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Browse Cats</h1>
          <p className="text-muted-foreground">Find a cat to foster in your city</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-4 bg-card rounded-2xl border border-border/60">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" />
            Filter by city
          </div>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger
              data-testid="select-city-filter"
              className="w-56 bg-background"
            >
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {INDIAN_CITIES.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!isLoading && (
            <span className="text-sm text-muted-foreground" data-testid="text-result-count">
              {filtered.length} cat{filtered.length !== 1 ? "s" : ""}
              {selectedCity !== "all" ? ` in ${selectedCity}` : " total"}
            </span>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No cats found</h3>
            <p className="text-muted-foreground text-sm">
              {selectedCity !== "all"
                ? `No cats listed in ${selectedCity} yet.`
                : "No cats listed yet. Be the first to post one!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((cat) => (
              <Link href={`/cats/${cat.id}`} key={cat.id}>
                <Card
                  data-testid={`card-cat-${cat.id}`}
                  className="group cursor-pointer overflow-hidden border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-card h-full"
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
                      <h3 className="font-serif text-lg font-semibold text-foreground">{cat.name}</h3>
                      <span className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
