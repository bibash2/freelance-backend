import { PostConstant } from "../../../constant";
import prisma from "../../../config/prisma";

const postQuery = {
    create: async (payload: any) => {
        try {
            const {title, content, userId, description, category, image, location, price, isNegotiable, isActive} = payload;
            const newPost = await prisma.post.create({data: {title, content, userId, description, category, image, location, price, isNegotiable, isActive}})
            return newPost;
        } catch (error) {
            throw error;
        }
    },
    findById: async (id: string) => {
        try {
            const post = await prisma.post.findUnique({where: {id}, include: {user: true}})
            if(!post) {
                throw new Error(PostConstant.POST_NOT_FOUND);
            }
            return post;
        } catch (error) {
            throw error;
        }
    },
    finaMany: async (payload: any) => {
        try {
            const {page, limit, category, location, price, isNegotiable, isActive} = payload;
            const postList = await prisma.post.findMany({skip: (page - 1) * limit, take: limit, where: {category, location, price, isNegotiable, isActive}})
            return postList;
        } catch (error) {
            throw error;
        }
    }
}

export default postQuery;