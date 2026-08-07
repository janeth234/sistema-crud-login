import { Router } from "express";

import {
  login,
  logout,
  profile,
  refresh,
  register,
} from "../controllers/auth.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/profile", authenticate, profile);

export default router;