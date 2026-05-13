import { Router, type IRouter } from "express";
import {
  ListCommentsParams,
  CreateCommentParams,
  CreateCommentBody,
  CreateReplyParams,
  CreateReplyBody,
} from "@workspace/api-zod";
import {
  getCatById,
  getCommentsByCat,
  createComment,
  getComment,
  getReplies,
  findUserById,
} from "../lib/store";

const router: IRouter = Router();

function serializeComment(comment: ReturnType<typeof getComment>) {
  if (!comment) return null;
  const replies = getReplies(comment.id).map((r) => ({
    ...r,
    replies: [],
  }));
  return { ...comment, replies };
}

router.get("/cats/:id/comments", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = ListCommentsParams.safeParse({ id: raw });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cat = getCatById(parsed.data.id);
  if (!cat) {
    res.status(404).json({ error: "Cat not found" });
    return;
  }
  const topLevel = getCommentsByCat(parsed.data.id);
  const result = topLevel.map((c) => serializeComment(c));
  res.json(result);
});

router.post("/cats/:id/comments", async (req, res): Promise<void> => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const user = findUserById(userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsedParams = CreateCommentParams.safeParse({ id: rawId });
  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }
  const cat = getCatById(parsedParams.data.id);
  if (!cat) {
    res.status(404).json({ error: "Cat not found" });
    return;
  }
  const parsedBody = CreateCommentBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.message });
    return;
  }
  const comment = createComment({
    catId: parsedParams.data.id,
    userId: user.id,
    username: user.username,
    text: parsedBody.data.text,
    parentId: null,
  });
  res.status(201).json({ ...comment, replies: [] });
});

router.post("/cats/:id/comments/:commentId/replies", async (req, res): Promise<void> => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const user = findUserById(userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawCommentId = Array.isArray(req.params.commentId)
    ? req.params.commentId[0]
    : req.params.commentId;
  const parsedParams = CreateReplyParams.safeParse({ id: rawId, commentId: rawCommentId });
  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }
  const cat = getCatById(parsedParams.data.id);
  if (!cat) {
    res.status(404).json({ error: "Cat not found" });
    return;
  }
  if (cat.postedBy !== userId) {
    res.status(403).json({ error: "Only the cat's poster can reply to comments" });
    return;
  }
  const parentComment = getComment(parsedParams.data.commentId);
  if (!parentComment) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  const parsedBody = CreateReplyBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.message });
    return;
  }
  const reply = createComment({
    catId: parsedParams.data.id,
    userId: user.id,
    username: user.username,
    text: parsedBody.data.text,
    parentId: parsedParams.data.commentId,
  });
  res.status(201).json({ ...reply, replies: [] });
});

export default router;
