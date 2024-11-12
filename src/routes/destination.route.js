import express from "express";
import {createDestinationController, getDestinationController} from "../controllers/destination.controller.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.get("/", getDestinationController);

router.post("/", upload.single("image"), createDestinationController);

export default router;