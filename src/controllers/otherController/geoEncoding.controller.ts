import {Request, Response} from "express";
import geoEncodingService from "../../services/geoEncoding/geoEncoding";
class GeoEncodingController {
    constructor() {}

    async getSuggestLocation(req: Request, res: Response) {
        try {
            const response = await geoEncodingService.getGooglePlacesAutocomplete({
                apiKey: 'AIzaSyBr2wqrbPk4xxs8vS3qvZRiMrlI3vVx7fo',
                searchTerm: req.params.param,
                types: 'ADDRESS',
                restrictToUSAndCanada: false   
            })
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }
    async getGeocode(req: Request, res: Response) {
        try {
            const response = await geoEncodingService.convertAddressToGeocode(req.params.param)
            res.status(200).json(response)
        } catch (error: unknown) {
            res.status(500).json({message: error instanceof Error ? error.message : 'An error occurred'})
        }
    }


}
    
const geoEncodingController = new GeoEncodingController();

export default geoEncodingController;
