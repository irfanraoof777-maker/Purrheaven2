import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import catsRouter from "./cats";
import commentsRouter from "./comments";
import usersRouter from "./users";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(catsRouter);
router.use(commentsRouter);
router.use(usersRouter);
router.use(adminRouter);

export default router;
