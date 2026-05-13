import { useLocation, Link } from "wouter";
import {
  useGetMe,
  useGetMyListings,
  useDeleteCat,
  getGetMyListingsQueryKey,
  getListCatsQueryKey,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, MapPin, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MyListings() {
  const [, setLocation] = useLocation();
  const { data: me, isError } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const { data: listings, isLoading } = useGetMyListings({
    query: { queryKey: getGetMyListingsQueryKey(), enabled: !!me },
  });
  const deleteCat = useDeleteCat();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (isError || !me) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Login Required</h2>
        <p className="text-muted-foreground mb-6">You must be logged in to view your listings.</p>
        <Button onClick={() => setLocation("/login")} data-testid="button-go-to-login">
          Login to continue
        </Button>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    deleteCat.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMyListingsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListCatsQueryKey() });
          toast({ title: "Listing deleted" });
        },
        onError: () => {
          toast({ title: "Failed to delete", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-1">My Listings</h1>
            <p className="text-muted-foreground">Cats you've posted for fostering</p>
          </div>
          <Link href="/post">
            <Button data-testid="button-post-new-cat" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Post a Cat
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PlusCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No listings yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              You haven't posted any cats yet. Ready to help one find a home?
            </p>
            <Link href="/post">
              <Button data-testid="button-post-first-cat">Post Your First Cat</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((cat) => (
              <Card
                key={cat.id}
                data-testid={`card-listing-${cat.id}`}
                className="overflow-hidden border border-border/60 bg-card"
              >
                <Link href={`/cats/${cat.id}`}>
                  <div className="aspect-[4/3] overflow-hidden cursor-pointer">
                    <img
                      src={cat.photo1}
                      alt={cat.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">{cat.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{cat.city}</span>
                        <span className="mx-1">&middot;</span>
                        <span>{cat.age} {cat.ageUnit}</span>
                      </div>
                    </div>
                    <Button
                      data-testid={`button-delete-${cat.id}`}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteCat.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{cat.healthNotes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
