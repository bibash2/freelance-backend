
import express from "express";
import multer from "multer";
const router = express.Router();
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

import authController from "../controllers/authController"
import userController from "../controllers/userController"
import { authenticateToken } from "../middleware/Authenticator";
import socketController from "../controllers/socketController"
import geoEncodingController from "../controllers/otherController/geoEncoding.controller"
import serviceProviderController from "../controllers/serviceProviderController"

router.post("/login", authController.login) 
router.post("/register",upload.single("image"), authController.register)
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

router.get("/admin/pending-service-provider", serviceProviderController.pendingServiceProvider)
router.post("/admin/approve-service-provider/:id", serviceProviderController.approveServiceProvider)
router.post("/admin/reject-service-provider/:id", serviceProviderController.rejectServiceProvider)
router.get("/admin/category", serviceProviderController.getCategory)
router.post("/admin/add-category", serviceProviderController.addCategory)


router.patch("/work-call/:id/:status", serviceProviderController.changeStatus)



router.post("/socket", authenticateToken, socketController.socket)


export default router

