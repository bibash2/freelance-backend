import { error } from "console";
import prisma from "../../config/prisma";
import geoEncodingService from "../../services/geoEncoding/geoEncoding";
import { haversineDistance } from "../../utils/Haversine";

class ServiceProviderService {
    constructor() { }

    async createServiceProvider(payload: any) {
        try {
            const { latitude, longitude } = await geoEncodingService.convertAddressToGeocode(payload.location);
            const serviceProvider = await prisma.user.update({
                data:
                {
                    role: "SERVICE_PROVIDER",
                    category: payload.category,
                    serviceProviderAddress: payload.location,
                    serviceProviderLocation: { latitude, longitude }
                },
                where: { id: payload.userId }
            })
            return serviceProvider;
        } catch (error) {
            throw error;
        }
    }

    async getServiceProviderList(payload: any) {
        try {
            const { userId, category, address } = payload;
            let userDetail: any = await prisma.user.findUnique({ where: { id: userId } });
            const allServiceProvider: any = await prisma.user.findMany({
                where: {
                    role: "SERVICE_PROVIDER",
                    id: {
                        not: userId
                    },
                    //   isAcceptedServiceProvider: true,
                    //   isServiceProvider: true
                }
            });

            if (address) {

                if (category) allServiceProvider.filter((a: any) => a.category === category)
                if (category) userDetail.category = category;
                let { latitude, longitude } = await geoEncodingService.convertAddressToGeocode(address);
                userDetail = {
                    location: {
                        latitude,
                        longitude
                    }
                }
            }


            if (Object.keys(userDetail?.location).length === 0) throw new Error("User location not found")
            let allServiceProviderWithDistance = allServiceProvider.map((a: any) => {
                const { latitude, longitude } = userDetail?.location as any;
                const { latitude: serviceProviderLatitude, longitude: serviceProviderLongitude } = a.serviceProviderLocation as any;
                const distance = haversineDistance(parseFloat(latitude), parseFloat(longitude), parseFloat(serviceProviderLatitude), parseFloat(serviceProviderLongitude))
                return { ...a, distance }
            })
            if (address) {
                allServiceProviderWithDistance = allServiceProviderWithDistance.filter((a: any) => a.distance <= 3)
            }
            allServiceProviderWithDistance.sort((a: any, b: any) => a.distance - b.distance)
            return allServiceProviderWithDistance;

        } catch (error) {
            throw error;
        }
    }


    async getServiceProviderDetail(payload: any) {
        try {
            const { serviceProviderId, userId } = payload;
            const userDetail: any = await prisma.user.findUnique({ where: { id: userId } })
            const serviceProvider: any = await prisma.user.findUnique({ where: { id: serviceProviderId, role: "SERVICE_PROVIDER" } })
            const allReviews = await prisma.review.findMany({ where: { serviceProviderId } })
            const distance = haversineDistance(parseFloat(userDetail?.location?.latitude), parseFloat(userDetail?.location?.longitude), parseFloat(serviceProvider?.serviceProviderLocation?.latitude), parseFloat(serviceProvider?.serviceProviderLocation?.longitude))
            const allRating = allReviews.map((review: any) => {
                return review.rating;
            }).filter(Boolean)

            const averageRating = allRating.reduce((a, b) => a + b, 0) / allRating.length;

            if (!serviceProvider) {
                throw new Error("Service Provider Not Found");
            }

            return { serviceProvider: { ...serviceProvider, distance }, rating: { averageRating, allReviews } };
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async updateServiceProvider(id: string, payload: Record<string, string>) {
        try {
            const serviceProvider = await prisma.user.update({ where: { id, role: "SERVICE_PROVIDER" }, data: payload })
            return serviceProvider;
        } catch (error) {
            throw error;
        }
    }

    async contactServiceProvider(payload: any) {
        try {
            const { userId, serviceProviderId, title, description, address, datetime, budget } = payload;
            const { latitude, longitude } = await geoEncodingService.convertAddressToGeocode(address);
            const dataTime = new Date(datetime).toISOString();
            const pendingWorkCall:any =await prisma.workCall.findFirst({where:{userId, serviceProviderId, status:"pending"}})
            if(pendingWorkCall) throw new Error("Another direct work call is still pending")
            const serviceProvider = await prisma.workCall.create({ data: { serviceProviderId, userId, chatHistory: { message: payload.message }, title, description, address, location: { latitude, longitude }, dateTime: dataTime, budget, status:"pending" } })
            return serviceProvider;
        } catch (error) {
            throw error;
        }
    }

    async acceptBid(payload: { postId: string; serviceProviderId: string }) {
        try {
            const updatedPost = await prisma.post.update({
                where: { id: payload.postId },
                data: {
                    isActive: false,
                    acceptedServiceProviderId: payload.serviceProviderId,
                },
            });
            return updatedPost;
        } catch (error) {
            throw error;
        }
    }

    async getWorkDetail(id: string) {
        try {
            const workDetail = await prisma.workCall.findUnique({ where: { id } })
            const messageHistory = await prisma.message.findMany({
                where: { workCallId: id },
                orderBy: { createdAt: 'asc' }
            });

            
            return { ...workDetail, messages: messageHistory };
        } catch (error) {
            throw error;
        }
    }

    async getWorkCallList({ type, userId }: { type: "to-me" | "by-me", userId: string }) {
        try {
            let criteria = {};
            if (type === "to-me") {
                criteria = { serviceProviderId: userId }
            } else if (type === "by-me") {
                criteria = { userId }
            }
            const workCallList = await prisma.workCall.findMany({ where: criteria })

            if (type === "to-me") {
                const allUser = await prisma.user.findMany({ where: { id: { in: workCallList.map((a: any) => a.userId) } } })
                const allWorkCall = workCallList.map((a: any) => {
                    const user = allUser.find((b: any) => b.id === a.userId)
                    return { ...a, user }
                })
                return allWorkCall;
            }

            if (type === "by-me") {
                const allUser = await prisma.user.findMany({ where: { id: { in: workCallList.map((a: any) => a.serviceProviderId) } } })
                const allRequestedWorkCall = workCallList.map((a: any) => {
                    const user = allUser.find((b: any) => b.id === a.serviceProviderId)
                    return { ...a, user }
                })
                return allRequestedWorkCall;
            }

            return workCallList;
        } catch (error) {
            throw error;
        }
    }

    async pendingServiceProvider() {
        try {
            const response = await prisma.user.findMany({ where: { isAcceptedServiceProvider: false, } })
            return response;
        } catch (error) {
            throw error;
        }
    }

    async approveServiceProvider(payload: any) {
        try {
            const response = await prisma.user.update({ where: { id: payload.userId }, data: { isAcceptedServiceProvider: true, isServiceProvider: true } })
            return response;
        } catch (error) {
            throw error;
        }
    }

    async rejectServiceProvider(payload: any) {
        try {
            const response = await prisma.user.update({ where: { id: payload.userId, }, data: { role: "USER", isAcceptedServiceProvider: false, isServiceProvider: false } })
            return response;
        } catch (error) {
            throw error;
        }
    }

    async changeWorkCallStatus(payload: any) {
        try {
            const response = await prisma.workCall.update({ where: { id: payload.id }, data: { status: payload.status } })
            return response
        } catch (error){
            throw error
        }
    }

    async getCategory(){
        try{
         const response = await prisma.category.findMany()
         return response 
        }catch(error){
            throw error
        }
    }

    async addCategory(payload:any){
        try{
        const response = await prisma.category.create({data:payload})
        }catch(error){

        }
    }








}

const serviceProviderService = new ServiceProviderService();

export default serviceProviderService;