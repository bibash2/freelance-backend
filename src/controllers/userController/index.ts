import userService from "../../services/user"
import { Request, Response } from "express";
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
            const response = await userService.getPostList(req.body)
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

}

const userController = new UserController();

export default userController;