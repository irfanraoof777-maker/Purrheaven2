import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  useGetMe, getGetMeQueryKey,
  useGetAdminStats,
  useAdminListCats, useAdminDeleteCat,
  useAdminListComments, useAdminDeleteComment,
  useAdminListUsers,
  getAdminListCatsQueryKey,
  getAdminListCommentsQueryKey,
  getAdminListUsersQueryKey,
  getGetAdminStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  LayoutDashboard, Cat, MessageCircle, Users, Trash2,
  IndianRupee, ShieldCheck, MapPin, ExternalLink,
} from "lucide-react";

type Tab = "overview" | "cats" | "comments" | "users";

function StatCard({
  icon: Icon, label, value, sub,
}: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
}) {
  return (
    <div className="p-5 bg-card rounded-2xl border border-border/60 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey(), retry: false },
  });
  const { data: stats } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey(), enabled: !!me?.isAdmin },
  });
  const { data: allCats, isLoading: catsLoading } = useAdminListCats({
    query: { queryKey: getAdminListCatsQueryKey(), enabled: tab === "cats" && !!me?.isAdmin },
  });
  const { data: allComments, isLoading: commentsLoading } = useAdminListComments({
    query: { queryKey: getAdminListCommentsQueryKey(), enabled: tab === "comments" && !!me?.isAdmin },
  });
  const { data: allUsers, isLoading: usersLoading } = useAdminListUsers({
    query: { queryKey: getAdminListUsersQueryKey(), enabled: tab === "users" && !!me?.isAdmin },
  });

  const deleteCat = useAdminDeleteCat();
  const deleteComment = useAdminDeleteComment();

  const handleDeleteCat = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteCat.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListCatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: `"${name}" deleted` });
      },
    });
  };

  const handleDeleteComment = (id: string) => {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    deleteComment.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListCommentsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "Comment deleted" });
      },
    });
  };

  if (meLoading) {
    return (
      <div className="py-16 px-4 container mx-auto max-w-5xl">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You don't have permission to view this page.</p>
        <Button onClick={() => setLocation("/")}>Go Home</Button>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "cats", label: "Cat Listings", icon: Cat },
    { id: "comments", label: "Comments", icon: MessageCircle },
    { id: "users", label: "Users", icon: Users },
  ];

  return (
    <div className="py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Logged in as {me.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-muted rounded-xl w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${tab === id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Cat} label="Total Cats" value={stats?.totalCats ?? "—"} sub="across all cities" />
              <StatCard icon={Users} label="Registered Users" value={stats?.totalUsers ?? "—"} />
              <StatCard icon={MessageCircle} label="Comments" value={stats?.totalComments ?? "—"} sub="all listings" />
              <StatCard
                icon={IndianRupee}
                label="Total Donated"
                value={stats ? `₹${stats.totalDonatedRupees.toLocaleString("en-IN")}` : "—"}
                sub="simulated total"
              />
            </div>

            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-sm font-medium text-amber-800 mb-1">Donation Note</p>
              <p className="text-sm text-amber-700">
                The donation total shown is simulated — the payment gateway is not yet live.
                Once integrated, real-time totals will appear here.
              </p>
            </div>
          </div>
        )}

        {/* Cats */}
        {tab === "cats" && (
          <div className="space-y-3">
            {catsLoading ? (
              [0,1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)
            ) : allCats && allCats.length > 0 ? (
              allCats.map((cat) => (
                <div key={cat.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/60">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={cat.photo1} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm text-foreground">{cat.name}</p>
                      {cat.breed && <span className="text-xs text-muted-foreground">· {cat.breed}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cat.city}</span>
                      <span>by {cat.postedByUsername}</span>
                      <span>{format(new Date(cat.createdAt), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/cats/${cat.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() => handleDeleteCat(cat.id, cat.name)}
                      disabled={deleteCat.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12 text-sm">No cat listings yet.</p>
            )}
          </div>
        )}

        {/* Comments */}
        {tab === "comments" && (
          <div className="space-y-3">
            {commentsLoading ? (
              [0,1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)
            ) : allComments && allComments.length > 0 ? (
              allComments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/60">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-primary">{comment.username[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.username}</span>
                      {comment.parentId && (
                        <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">reply</span>
                      )}
                      <span className="text-xs text-muted-foreground">{format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                    <p className="text-sm text-foreground/80 break-words">{comment.text}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 shrink-0"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={deleteComment.isPending}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12 text-sm">No comments yet.</p>
            )}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="space-y-3">
            {usersLoading ? (
              [0,1,2].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)
            ) : allUsers && allUsers.length > 0 ? (
              allUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/60">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">{u.username[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{u.username}</p>
                    <p className="text-xs text-muted-foreground">{u.id}</p>
                  </div>
                  {u.isAdmin && (
                    <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12 text-sm">No users yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
