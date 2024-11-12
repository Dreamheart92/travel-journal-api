import express from "express";
import {loginController, signupController, updateProfileController} from "../controllers/auth.controller.js";
import {
    authMiddleware,
    isAuthMiddleware,
    loginValidationMiddleware,
    signupValidationMiddleware
} from "../middleware/index.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.post('/signup', signupValidationMiddleware, signupController);
router.post('/login', loginValidationMiddleware, loginController);
router.put("/", upload.single("image"), isAuthMiddleware, authMiddleware, updateProfileController);

export default router;