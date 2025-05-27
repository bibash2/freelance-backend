
import axios from "axios";
class GeoEncodingService {
    constructor() {}
    PLACE_TYPES: Record<string, string> = {
        ADDRESS: 'address',
        ESTABLISHMENT: 'establishment',
        GEOCODE: 'geocode',
        CITIES: '(cities)',
        REGIONS: '(regions)'
    };
    
    
    
    // Google Places Autocomplete
    async  getGooglePlacesAutocomplete({
        apiKey = 'AIzaSyBr2wqrbPk4xxs8vS3qvZRiMrlI3vVx7fo',
        searchTerm,
        types = 'GEOCODE',
        restrictToUSAndCanada = false
    }: {
        apiKey: string;
        searchTerm: string;
        types?: string;
        restrictToUSAndCanada?: boolean;
    }) {
        if (!apiKey) throw new Error('Missing Google API key');
        if (!searchTerm) throw new Error('Missing search term');
    
        let criteria: Record<string, string> = {
            input: searchTerm,
            key: apiKey,
            types: this.PLACE_TYPES[types.toUpperCase()] || 'geocode',
        };
        if (restrictToUSAndCanada) {
            criteria['components'] = 'country:us|country:ca';
        }

        const AUTOCOMPLETE_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    
        try {
            const response = await axios.get(AUTOCOMPLETE_API, { params: criteria });
            const predictedLocation = response.data?.predictions.map((prediction: any) => prediction.description) || [];
            const nepalLocation = predictedLocation.filter((address:string) => address.includes("Nepal"))
            console.log(nepalLocation)
            return nepalLocation;
        } catch (err: unknown) {
            console.error('Failed to fetch Google autocomplete:', err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    
    }

    async convertAddressToGeocode(address:string) {
        try {
            
            const urlEncodedAddress = encodeURIComponent(address);
            const googleLocationKey = "AIzaSyD1WC-07rfhCPOaSCmuvKDr5-x5nbquf04"

            const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleLocationKey}&address=${urlEncodedAddress}`;
            const options = {
                method: 'GET',
                url,
                json: true,
            };
            const response = await axios.get(url);
            return {latitude: response.data.results[0].geometry.location.lat, longitude: response.data.results[0].geometry.location.lng};
        } catch (error: unknown) {
            console.error('Failed to fetch Google autocomplete:', error instanceof Error ? error.message : 'An error occurred');
            throw error;
        }
    }

    async convertGeocodeToAddress({lat, lng}:Record<string, string>) {
        try {
            const googleLocationKey = "AIzaSyD1WC-07rfhCPOaSCmuvKDr5-x5nbquf04"

            const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleLocationKey}&latlng=${lat},${lng}`;
            const options = {
                method: 'GET',
                url,
                json: true,
            };
            const response = await axios.get(url, options);
            return response.data;
        } catch (error: unknown) {
            console.error('Failed to fetch Google autocomplete:', error instanceof Error ? error.message : 'An error occurred');
            throw error;
        }
    }
}

const geoEncodingService = new GeoEncodingService();
export default geoEncodingService;



// 1. Get suggestions from Google
