import { Request, Response } from "express";
import authService from "../../services/auth";

class AuthController {

    async login(req: Request, res: Response) {
        try {
            const response = await authService.loginService(req.body);
            res.status(200).json(response);
        } catch (error: any) {
            if (error.message === "User not found" || error.message === "Invalid password") {
                res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    async register(req: Request, res: Response) {
        try {
            const response = await authService.registerService(req.body);
            res.status(201).json(response);
        } catch (error: any) {
            console.log(error,'error')
            if (error.message === "User already exists") {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const response = await authService.logoutService();
            res.status(200).json(response);
        } catch (error: any) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const response = await authService.refreshTokenService(req.body);
            res.status(200).json(response);
        } catch (error: any) {
            if (error.message === "No token provided" || error.message === "Invalid token") {
                res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }
}

const authController = new AuthController();

export default authController;

