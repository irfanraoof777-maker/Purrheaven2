import { Router, type IRouter } from "express";
import { cats, findUserById } from "../lib/store";

const router: IRouter = Router();

router.get("/users/me/listings", async (req, res): Promise<void> => {
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
  const myListings = cats.filter((c) => c.postedBy === userId);
  res.json(myListings.slice().reverse());
});

export default router;
