import prisma from "@src/config/prisma";
import { getUserFromToken } from "@src/middleware/Authenticator";

class MessageService {
    constructor() {}

    async saveMessage(payload: any) {
        try {
            const { serviceProviderId, token, message, workCallId} = payload;

            const userId = getUserFromToken(token);
            const newMessage = await prisma.workCall.create({data: {serviceProviderId, userId, chatHistory: {message}, id: workCallId}})
            return newMessage;
        } catch (error) {
            throw error;
        }
    }
}
    
export default MessageService;