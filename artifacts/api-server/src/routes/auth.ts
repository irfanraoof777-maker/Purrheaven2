import { Router, type IRouter } from "express";
import {
  SignupBody,
  LoginBody,
} from "@workspace/api-zod";
import {
  findUserByUsername,
  createUser,
  findUserById,
} from "../lib/store";

const router: IRouter = Router();

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = SignupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  if (findUserByUsername(username)) {
    res.status(409).json({ error: "Username already taken" });
    return;
  }
  const user = createUser(username, password);
  req.session.userId = user.id;
  res.status(201).json({ id: user.id, username: user.username });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, password } = parsed.data;
  const user = findUserByUsername(username);
  if (!user || user.password !== password) {
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }
  req.session.userId = user.id;
  res.json({ id: user.id, username: user.username });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.sendStatus(204);
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
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
  res.json({ id: user.id, username: user.username });
});

export default router;
