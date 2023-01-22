import express from 'express';
import { userController } from '../controllers/user-conroller.js';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import { accessMiddleware } from '../middlewares/access-middleware.js';
import { loginMiddleware } from '../middlewares/login-middleware.js';

export const router = express.Router();

router.post("/registration",
  body("email").isEmail(),
  userController.registration
);
router.post("/login", loginMiddleware, userController.login);
router.post("/logout", userController.logout);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);
router.delete("/users/:id", accessMiddleware, userController.deleteUser);
router.patch("/users/:id", accessMiddleware, userController.blockAndUnblockUser);