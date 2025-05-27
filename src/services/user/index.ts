import prisma from "../../config/prisma";
import { PostConstant } from "../../constant";
import geoEncodingService from "../../services/geoEncoding/geoEncoding";
import { haversineDistance } from "../../utils/Haversine";

class UserService {
    constructor() {}

    async createNewPost(payload: any) {
        try {
            payload.address = payload.location.trim();
            const {latitude, longitude} = await geoEncodingService.convertAddressToGeocode(payload.location);
            payload.location = {latitude, longitude};
            const {title, userId, description, category, location, price, urgency, address} = payload;
            const newPost = await prisma.post.create({
                data: {
                  title,
                  user: {
                    connect: {
                      id: userId
                    }
                  },
                  address,
                  description,
                  category,
                  location,
                  price: Number(price),
                  urgency: urgency.toUpperCase(),
                }
              });      
          return newPost;
        } catch (error) {
            throw error;
        }
    }

    async getPostDetailById(id: string) {
        try {
            const post = await prisma.post.findUnique({where: {id}})
            if(!post) throw new Error(PostConstant.POST_NOT_FOUND);
            const bidList = await prisma.bid.findMany({where: {postId: id}})
            return {postDetail: post, bids: bidList}
        } catch (error) {
            throw error;
        }
    }

    async getPostList(payload: any) {
        try {
            const {address, userId, category} = payload;
            let latitude = null;
            let longitude = null;
            let userDetail:any = null;
            if(address){
                let {latitude, longitude} = await geoEncodingService.convertAddressToGeocode(address);
                 userDetail = {
                    location:{
                        latitude,
                        longitude
                    },
                    category
                }
            }
          

            if(!address) {
                 userDetail = await prisma.user.findUnique({where: {id: userId}})
                if(Object.keys(userDetail?.location).length === 0) throw new Error("User location not found")
                latitude = userDetail?.location?.latitude;
                longitude = userDetail?.location?.longitude;
            }
            
            const postList = await prisma.post.findMany({ where: {category: userDetail.category}})
            const postListWithDistance = postList.map((a:any) => {
                const {latitude, longitude} = a.location as any;
                const distance = haversineDistance(parseFloat(userDetail?.location?.latitude), parseFloat(userDetail?.location?.longitude), parseFloat(latitude), parseFloat(longitude))
                return {...a, distance}
            })
            if(payload.category){
                postListWithDistance.filter((a:any) => a.distance <= 5)
            }
            postListWithDistance.sort((a:any, b:any) => a.distance - b.distance)
            return postListWithDistance;    
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

    async getUserDetailById(id: string) {
        try {
            const user = await prisma.user.findUnique({where: {id}})
            if(!user) throw new Error("User not Found");
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getMyPost(userId: string) {
        try {
            const postList = await prisma.post.findMany({where: {userId}})
            return postList;
        } catch (error) {
            throw error;
        }
    }
}

const userService = new UserService();

export default userService;