import express from "express";
import { setupCompleted, vendorArrived, vendorLogin, verifyArrivalOtp, verifyCompletionOtp } from "../controllers/vendor.controller.js";
import { vendorAuthMiddleware } from "../middleware/auth.middleware.js";
import { uploadArrivalImage } from "../middleware/upload.middleware.js";
import { uploadSetupImages } from "../middleware/uploadSetup.middleware.js";

const router = express.Router();

router.post("/vendor/login", vendorLogin);
router.post(
    "/vendor/event/arrived",
    vendorAuthMiddleware,
    uploadArrivalImage.single("image"),
    vendorArrived
);

router.post(
    "/vendor/event/setup-completed",
    vendorAuthMiddleware,
    uploadSetupImages.fields([
        { name: "pre", maxCount: 1 },
        { name: "post", maxCount: 1 }
    ]),
    setupCompleted
);


router.post(
    "/vendor/otp/arrival/verify",
    vendorAuthMiddleware,
    verifyArrivalOtp
);

router.post(
    "/vendor/otp/completion/verify",
    vendorAuthMiddleware,
    verifyCompletionOtp
)

export default router;
