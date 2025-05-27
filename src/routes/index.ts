import express from "express";
const router = express.Router();
import authController from "../controllers/authController"
import userController from "../controllers/userController"
import { authenticateToken } from "../middleware/Authenticator";
import socketController from "../controllers/socketController"
import geoEncodingController from "../controllers/otherController/geoEncoding.controller"
import serviceProviderController from "../controllers/serviceProviderController"

router.post("/login", authController.login)
router.post("/register", authController.register)
router.post("/logout", authController.logout)
router.get("/refresh-token", authController.refreshToken)
router.get("/user", authenticateToken, userController.getUserDetailById)

router.get("/service-provider-list", authenticateToken, serviceProviderController.getAllServiceProvider)
router.post("/accept-bid", authenticateToken, serviceProviderController.acceptBid)

router.post("/create-post", authenticateToken, userController.createNewPost)
router.get("/post/:id", authenticateToken, userController.getPostDetailById)
router.get("/post-list", authenticateToken, userController.getPostList)
router.put("/post/:id", authenticateToken, userController.updatePost)
router.delete("/post/:id", authenticateToken, userController.deletePost)
router.get("/service-provider/:id", authenticateToken, userController.getServiceProviderDetailById)
router.post("/service-provider", authenticateToken, userController.createServiceProvider)
router.post("/review", authenticateToken, userController.addReview)
router.post("/bid", authenticateToken, userController.addBid)
router.post("/get-suggest-location/:param", geoEncodingController.getSuggestLocation)
router.post("/get-geocode/:param", geoEncodingController.getGeocode)
router.post("/contact-service-provider", authenticateToken, serviceProviderController.contactServiceProvider)
router.get("/my-post", authenticateToken, userController.getMyPost)
router.get("/work-call/:id", authenticateToken, userController.getWorkDetail)
router.get("/work-request/:type", authenticateToken, serviceProviderController.getWorkCallList)



router.post("/socket", authenticateToken, socketController.socket)


export default router

