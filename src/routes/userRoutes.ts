import express from "express";
import * as userController from "../controllers/userController";
import {
  validateUserCreate,
  validateUserUpdate,
  validateUserIdAndToDoIdParams,
  validateUserId,
  authenticateToken,
} from "../middleware";
import { upload } from "../middleware";
import * as authService from "../services/authService";

// Create a router
const router = express.Router();

// Add routes to the router
router.get("/users/login", authService.loginUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", validateUserId, userController.getUserById);
router.post(
  "/users",
  validateUserCreate,
  upload.single("profilePicture"),
  authService.registerUser
);
router.put(
  "/users/:id",
  validateUserUpdate,
  upload.single("profilePicture"),
  userController.updateUser
);
router.patch(
  "/users/:id",
  validateUserUpdate,
  upload.single("profilePicture"),
  userController.updateUser
);
router.delete("/users/:id", validateUserId, userController.deleteUser);
router.get(
  "/users/:id/todos",
  validateUserId,
  userController.getAllToDosOfUser
);
router.get(
  "/users/:id/todos/:toDoId",
  validateUserIdAndToDoIdParams,
  userController.getToDoByUserIdAndToDoId
);
//n
export default router;
