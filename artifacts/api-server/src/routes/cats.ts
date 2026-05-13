import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import {
  CreateCatBody,
  ListCatsQueryParams,
  GetCatParams,
  DeleteCatParams,
} from "@workspace/api-zod";
import {
  cats,
  getCatById,
  createCat,
  deleteCat,
  findUserById,
  getStats,
} from "../lib/store";

const router: IRouter = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), "public/uploads"));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.get("/stats", async (_req, res): Promise<void> => {
  res.json(getStats());
});

router.get("/cats", async (req, res): Promise<void> => {
  const parsed = ListCatsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { city } = parsed.data;
  const result = city
    ? cats.filter((c) => c.city.toLowerCase() === city.toLowerCase())
    : [...cats];
  res.json(result.slice().reverse());
});

router.post("/cats", async (req, res): Promise<void> => {
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
  const parsed = CreateCatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cat = createCat({
    ...parsed.data,
    postedBy: user.id,
    postedByUsername: user.username,
  });
  res.status(201).json(cat);
});

router.get("/cats/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetCatParams.safeParse({ id: raw });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cat = getCatById(parsed.data.id);
  if (!cat) {
    res.status(404).json({ error: "Cat not found" });
    return;
  }
  res.json(cat);
});

router.delete("/cats/:id", async (req, res): Promise<void> => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = DeleteCatParams.safeParse({ id: raw });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cat = getCatById(parsed.data.id);
  if (!cat) {
    res.status(404).json({ error: "Cat not found" });
    return;
  }
  if (cat.postedBy !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  deleteCat(parsed.data.id);
  res.sendStatus(204);
});

router.post(
  "/upload",
  upload.single("photo"),
  async (req, res): Promise<void> => {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ url });
  },
);

router.post(
  "/cats/:id/upload",
  upload.single("photo"),
  async (req, res): Promise<void> => {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ url });
  },
);

export default router;
