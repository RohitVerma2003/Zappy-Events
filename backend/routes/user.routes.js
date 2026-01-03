import express from "express";
import { createEvent, sendArrivalOtpToUser, sendCompletionOtpToUser, userLogin } from "../controllers/user.controller.js";
import { userAuthMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user/login", userLogin);

router.post("/user/event", userAuthMiddleware, createEvent);

router.post(
    "/user/otp/arrival/send",
    userAuthMiddleware,
    sendArrivalOtpToUser
);

router.post(
    "/user/otp/completion/send",
    userAuthMiddleware,
    sendCompletionOtpToUser
);

export default router;
