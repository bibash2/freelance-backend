import express from "express";
const router = express.Router();
import authController from "../controllers/authController"
import userController from "../controllers/userController"
router.post("/login", authController.login)
router.post("/register", authController.register)
router.post("/logout", authController.logout)
router.get("/refresh-token", authController.refreshToken)

router.post("/post", userController.createNewPost)
router.get("/post/:id", userController.getPostDetailById)
router.get("/post", userController.getPostList)


export default router

