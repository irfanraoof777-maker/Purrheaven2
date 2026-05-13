import { Router, type IRouter, type RequestHandler } from "express";
import {
  users,
  cats,
  getCatById,
  deleteCat,
  getAllComments,
  deleteCommentById,
  getAdminStats,
  findUserById,
} from "../lib/store";

const router: IRouter = Router();

const requireAdmin: RequestHandler = (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const user = findUserById(userId);
  if (!user?.isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  res.json(getAdminStats());
});

router.get("/admin/cats", requireAdmin, async (_req, res): Promise<void> => {
  res.json([...cats].reverse());
});

router.delete("/admin/cats/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const cat = getCatById(id);
  if (!cat) {
    res.status(404).json({ error: "Cat not found" });
    return;
  }
  deleteCat(id);
  res.sendStatus(204);
});

router.get("/admin/comments", requireAdmin, async (_req, res): Promise<void> => {
  res.json(getAllComments());
});

router.delete("/admin/comments/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = deleteCommentById(id);
  if (!deleted) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  res.json(users.map(({ password: _p, ...u }) => u));
});

export default router;
