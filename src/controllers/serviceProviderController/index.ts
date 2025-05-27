import serviceProviderService from "../../services/serviceProvider"
import { Request, Response } from "express";

class ServiceProviderController {
    constructor() {}

    async contactServiceProvider(req: Request, res: Response) {
        try {
            const response = await serviceProviderService.contactServiceProvider(req.body)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async getAllServiceProvider(req: Request, res: Response) {
        try {
            const response = await serviceProviderService.getServiceProviderList(req.params)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async acceptBid(req: Request, res: Response) {
        try {
            const response = await serviceProviderService.acceptBid(req.body)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }

    async  getWorkCallList(req:Request, res:Response) {
        try {
            const response = await serviceProviderService.getWorkCallList({type: req.params.type as "to-me" | "by-me", userId: req.params.userId})
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }
}

const serviceProviderController = new ServiceProviderController();

export default serviceProviderController;
