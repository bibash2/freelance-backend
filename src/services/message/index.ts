// src/repositories/message.repository.ts
import { getUserFromToken } from "../../middleware/Authenticator";
import prisma from "../../config/prisma";

 class MessageRepository {

  async createMessage(messageData: any): Promise<any> {
    return prisma.message.create({
      data: {
        roomId: messageData.workCallId,
        senderId: messageData.userId,
        content: messageData.content,
        metadata: messageData.metadata,
        workCallId: messageData.workCallId,
      },
    });
  }

  async getMessagesByRoom(roomId: string, limit: number = 50): Promise<any[]> {
    return prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  }

  async updateMessage(workCallId: string, userId: string, content: string, metadata?: Record<string, any>): Promise<any> {
    return prisma.message.update({
      where: { id: workCallId },
      data: {
        content,
        metadata,
      },
    });
  }

  async saveMessage(data: any): Promise<any> {
    // const user = getUserFromToken(data.token)
    const name = await prisma.user.findUnique({where: {id: data.senderId}, select: {name: true}})
    // if(!user) throw new Error("User not found")
    this.createMessage({
      roomId: data.workCallId,
      userId: data.senderId,
      content: data.content,
      metadata: data.metadata,
      workCallId: data.workCallId,
    })
  }

  async markAsRead(messageId:string, userId:string){
    console.log(messageId, userId)
  }
   
}

const messageRepository = new MessageRepository();

export default messageRepository;
