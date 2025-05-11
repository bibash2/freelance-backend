import prisma from "../../config/prisma";
import { PostConstant } from "../../constant";

class UserService {
    constructor() {}

    async createNewPost(payload: any) {
        try {
            const {title, content, userId, description, category, image, location, price, isNegotiable, isActive} = payload;
            const newPost = await prisma.post.create({data: {title, content, userId, description, category, image, location, price, isNegotiable, isActive}})
            return newPost;
        } catch (error) {
            throw error;
        }
    }

    async getPostDetailById(id: string) {
        try {
            const post = await prisma.post.findUnique({where: {id}, include: {user: true}})
            if(!post) {
                throw new Error(PostConstant.POST_NOT_FOUND);
            }
            return post;
        } catch (error) {
            throw error;
        }
    }

    async getPostList(payload: any) {
        try {
            const {page, limit, category, location, price, isNegotiable, isActive} = payload;
            const postList = await prisma.post.findMany({skip: (page - 1) * limit, take: limit, where: {category, location, price, isNegotiable, isActive}})
            return postList;
        } catch (error) {
            throw error;
        }
    }

    async updatePost(id:string, payload: any) {
        try {
            const post = await prisma.post.update({where: {id}, data: payload})
            return post;
        } catch (error) {
            throw error;
        }
    }

    async deletePost(id: string) {
        try {
            const post = await prisma.post.delete({where: {id}})
            return post;
        } catch (error) {
            throw error;
        }
    }
}

const userService = new UserService();

export default userService;