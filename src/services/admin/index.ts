import prisma from "@src/config/prisma";

class AdminService {
    constructor() {}

    async createCategory(payload: any) {
        try {
            const category = await prisma.category.create({data: payload})
            return category;
        } catch (error) {
            throw error;
        }
    }

    async getCategoryList() {
        try {
            const categoryList = await prisma.category.findMany()
            return categoryList;
        } catch (error) {
            throw error;
        }
    }

    async getAllServiceProvider() {
        try {
            const serviceProviderList = await prisma.user.findMany({where: {role: "SERVICE_PROVIDER"}})
            return serviceProviderList;
        } catch (error) {
            throw error;
        }
    }

    async updateServiceProvider(id: string, payload: any) {
        try {
            const serviceProvider = await prisma.user.update({where: {id}, data: payload})
            return serviceProvider;
        } catch (error) {
            throw error;
        }
    }

    async deleteServiceProvider(id: string) {
        try {
            const serviceProvider = await prisma.user.delete({where: {id}})
            return serviceProvider;
        } catch (error) {
            throw error;
        }
    }
}

const adminService = new AdminService();

export default adminService;