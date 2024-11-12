import express from "express";

import authRoute from "../routes/auth.route.js";
import commentRoute from "../routes/comment.route.js";
import journalRoute from "../routes/journal.route.js";
import journalsRoute from "../routes/journals.route.js";
import destinationRoute from "../routes/destination.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/journal", journalRoute);
router.use("/journals", journalsRoute);
router.use("/comments", commentRoute);
router.use("/destinations", destinationRoute);

export default router;