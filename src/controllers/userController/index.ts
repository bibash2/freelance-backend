import userService from "../../services/user"
import { Request, Response } from "express";
import serviceProviderService from "../../services/serviceProvider"
import reviewService from "../../services/review"
class UserController {
    constructor() {}

    async createNewPost(req: Request, res: Response) {
      try {
       const response = await userService.createNewPost(req.body)
       res.status(200).json(response)
      } catch (error: unknown) {
        res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
      }
    }

    async getPostDetailById(req: Request, res: Response) {
        try {
            const response = await userService.getPostDetailById(req.params.id)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async getPostList(req: Request, res: Response) {
        try {
            const {address} = req.query;
            const {userId} = req.params;
            const payload = {
                userId,
                address: address as string,
                category: req.query.category as string
            }
            console.log(payload)
            const response = await userService.getPostList(payload)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const response = await userService.updatePost(req.params.id, req.body)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const response = await userService.deletePost(req.params.id)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async createServiceProvider(req: Request, res: Response) {
        try {
            const response = await serviceProviderService.createServiceProvider(req.body)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async addReview(req: Request, res: Response) {
        try {
            const response = await reviewService.addReview(req.body)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async addBid(req: Request, res: Response) {
        try {
            const response = await reviewService.addBid(req.body)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async getServiceProviderDetailById(req: Request, res: Response) {
        try {
            const {id:serviceProviderId, userId} = req.params;
            const payload = {
                userId,
                serviceProviderId
            }
            const response = await serviceProviderService.getServiceProviderDetail(payload)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async getUserDetailById(req: Request, res: Response) {
        try {
            const response = await userService.getUserDetailById(req.params.userId)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async getMyPost(req: Request, res: Response) {
        try {
            const response = await userService.getMyPost(req.params.userId)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async getWorkDetail(req: Request, res: Response) {
        try {
            const response = await serviceProviderService.getWorkDetail(req.params.id)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

}

const userController = new UserController();

export default userController;