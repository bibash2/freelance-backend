import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AuthConstant from "../../constant";
import geoEncodingService from "../../services/geoEncoding/geoEncoding";
import { uploadImage } from "../../utils/Haversine";
dotenv.config();

class AuthService {
    constructor() {}
    
    private generateToken(user: any) {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );
    }

    async loginService(payload: any) {
        try {
            const {email, password} = payload;
            const user = await prisma.user.findUnique({where: {email}});
            if(!user) {
                throw new Error(AuthConstant.USER_NOT_FOUND);
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                throw new Error(AuthConstant.INVALID_PASSWORD);
            }

            const token = this.generateToken(user);
            return { token, user: { id: user.id, email: user.email, name: user.name } };
        } catch (error) {
            throw error;
        }
    }

    async registerService(payload: any) {
        try {
            const {email, password, name, location, phone:userContact, base64Image} = payload;
            const returnPath = await uploadImage(base64Image, email)
            const {latitude, longitude} = await geoEncodingService.convertAddressToGeocode(location);
            const user = await prisma.user.findUnique({where: {email}});
            if(user) {
                throw new Error(AuthConstant.USER_ALREADY_EXISTS);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
        
            const newUser = await prisma.user.create({
                data: {
                    email,
                    userContact,
                    password: hashedPassword,
                    name: name,
                    userAddress: location,
                    location: {
                        latitude,
                        longitude
                    },
                    image: returnPath   
                }
            });
            
            return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
        } catch (error) {
            throw error;
        }
    }

    async logoutService() {
        // Since we're using JWT, we don't need to do anything on the server side
        // The client should remove the token
        return { message: "Logged out successfully" };
    }

    async refreshTokenService(payload: any) {
        try {
            const { token } = payload;
            if (!token) {
                throw new Error("No token provided");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
            const user = await prisma.user.findUnique({ where: { email: decoded.email } });
            
            if (!user) {
                throw new Error("User not found");
            }

            const newToken = this.generateToken(user);
            return { token: newToken, user: { id: user.id, email: user.email, name: user.name } };
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}

const authService = new AuthService();

export default authService;