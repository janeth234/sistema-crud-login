import { Router } from "express";
import {
  destroyUser,
  editUser,
  listUsers,
  showUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateUserSchema } from "../schemas/user.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", listUsers);
router.get("/:id", showUser);

router.put(
  "/:id",
  validate(updateUserSchema),
  editUser,
);

router.delete(
  "/:id",
  authorize("ADMIN"),
  destroyUser,
);

export default router;