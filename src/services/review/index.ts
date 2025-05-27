import prisma from "../../config/prisma";

class ReviewService {
    constructor() {}

    async addReview(payload: any) {
        try {
            const review = await prisma.review.create({data: payload})
            return review;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async addBid(payload: any) {
        try {
            payload.serviceProviderId = payload.userId;
            delete payload.userId;
            const bid = await prisma.bid.create({data: payload})
            return bid;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

const reviewService = new ReviewService();

export default reviewService;