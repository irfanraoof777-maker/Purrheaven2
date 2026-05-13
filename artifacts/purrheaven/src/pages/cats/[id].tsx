import { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGetCat, getGetCatQueryKey,
  useListComments, getListCommentsQueryKey,
  useCreateComment, useCreateReply,
  useGetMe, useDeleteCat, getGetMeQueryKey, getGetMyListingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Check, Trash2, ChevronLeft, MessageCircle, Reply } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

function CommentItem({
  comment,
  catPosterId,
  currentUserId,
  catId,
  onReply,
}: {
  comment: {
    id: string; username: string; text: string; createdAt: string;
    replies?: { id: string; username: string; text: string; createdAt: string }[]
  };
  catPosterId: string;
  currentUserId?: string;
  catId: string;
  onReply: (commentId: string) => void;
}) {
  const isOwner = currentUserId === catPosterId;

  return (
    <div className="group" data-testid={`comment-${comment.id}`}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-semibold text-primary">
            {comment.username[0].toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-sm text-foreground">{comment.username}</span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          <p className="text-sm text-foreground/80">{comment.text}</p>
          {isOwner && (
            <button
              data-testid={`button-reply-${comment.id}`}
              onClick={() => onReply(comment.id)}
              className="mt-1 text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Reply className="w-3 h-3" /> Reply
            </button>
          )}
        </div>
      </div>
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 pl-4 border-l-2 border-border/60">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="flex gap-3" data-testid={`reply-${reply.id}`}>
              <div className="w-7 h-7 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-secondary-foreground">
                  {reply.username[0].toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{reply.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(reply.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: cat, isLoading: catLoading } = useGetCat(params.id, {
    query: { queryKey: getGetCatQueryKey(params.id) },
  });
  const { data: comments, isLoading: commentsLoading } = useListComments(params.id, {
    query: { queryKey: getListCommentsQueryKey(params.id) },
  });
  const { data: me } = useGetMe({ query: { retry: false, queryKey: getGetMeQueryKey() } });
  const createComment = useCreateComment();
  const createReply = useCreateReply();
  const deleteCat = useDeleteCat();

  const handleComment = () => {
    if (!commentText.trim()) return;
    createComment.mutate(
      { id: params.id, data: { text: commentText } },
      {
        onSuccess: () => {
          setCommentText("");
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(params.id) });
          toast({ title: "Comment posted!" });
        },
      }
    );
  };

  const handleReply = () => {
    if (!replyText.trim() || !replyingTo) return;
    createReply.mutate(
      { id: params.id, commentId: replyingTo, data: { text: replyText } },
      {
        onSuccess: () => {
          setReplyText("");
          setReplyingTo(null);
          queryClient.invalidateQueries({ queryKey: getListCommentsQueryKey(params.id) });
          toast({ title: "Reply posted!" });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCat.mutate(
      { id: params.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMyListingsQueryKey() });
          toast({ title: "Listing deleted" });
          setLocation("/my-listings");
        },
      }
    );
  };

  if (catLoading) {
    return (
      <div className="py-12 px-4 container mx-auto max-w-4xl">
        <Skeleton className="h-96 rounded-2xl mb-8" />
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="py-24 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Cat not found</h2>
        <p className="text-muted-foreground mb-6">This listing may have been removed.</p>
        <Button onClick={() => setLocation("/cats")}>Browse all cats</Button>
      </div>
    );
  }

  const isOwner = me?.id === cat.postedBy;

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => setLocation("/cats")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Browse
        </button>

        {/* Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img src={cat.photo1} alt={`${cat.name} - photo 1`} className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden">
            <img src={cat.photo2} alt={`${cat.name} - photo 2`} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-serif text-4xl font-bold text-foreground mb-1">{cat.name}</h1>
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <span>{cat.age} {cat.ageUnit} old</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{cat.city}</span>
                </div>
              </div>
              {isOwner && (
                <Button
                  data-testid="button-delete-listing"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteCat.isPending}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </div>

            <div className="space-y-3 p-5 bg-card rounded-2xl border border-border/60">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">Spayed / Neutered:</span>{" "}
                  {cat.spayedNeutered ? "Yes" : "No"}
                </span>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Health Notes</p>
                <p className="text-sm text-muted-foreground">{cat.healthNotes}</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-card rounded-2xl border border-border/60 h-fit">
            <h3 className="font-serif text-lg font-semibold mb-3">Posted by</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-semibold text-primary">{cat.postedByUsername[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="font-medium text-sm">{cat.postedByUsername}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Listed {format(new Date(cat.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-2xl font-bold text-foreground">Comments</h2>
            <span className="text-sm text-muted-foreground ml-1">({comments?.length ?? 0})</span>
          </div>

          {me ? (
            <div className="mb-8 p-5 bg-card rounded-2xl border border-border/60">
              <Textarea
                data-testid="input-comment"
                placeholder="Share your thoughts or ask a question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-3 resize-none bg-background"
                rows={3}
              />
              <Button
                data-testid="button-post-comment"
                onClick={handleComment}
                disabled={!commentText.trim() || createComment.isPending}
                size="sm"
              >
                Post Comment
              </Button>
            </div>
          ) : (
            <div className="mb-8 p-5 bg-muted/50 rounded-2xl border border-border/60 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                <a href="/login" className="text-primary font-medium hover:underline">Login</a> to leave a comment
              </p>
            </div>
          )}

          {commentsLoading ? (
            <div className="space-y-6">
              {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
            </div>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem
                    comment={comment}
                    catPosterId={cat.postedBy}
                    currentUserId={me?.id}
                    catId={params.id}
                    onReply={(id) => {
                      setReplyingTo(id);
                      setReplyText("");
                    }}
                  />
                  {replyingTo === comment.id && (
                    <div className="ml-11 mt-3 p-4 bg-card rounded-xl border border-border/60">
                      <Textarea
                        data-testid={`input-reply-${comment.id}`}
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="mb-2 resize-none bg-background"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button
                          data-testid={`button-submit-reply-${comment.id}`}
                          size="sm"
                          onClick={handleReply}
                          disabled={!replyText.trim() || createReply.isPending}
                        >
                          Reply
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No comments yet. Be the first to leave one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
