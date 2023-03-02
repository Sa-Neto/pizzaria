import { hash } from "bcryptjs"
import { prismaClient } from "../../prisma"

interface UserRequest{
  name: string
  email: string
  password: string
}

export class CreateUserService{
  async execute({name,email,password}:UserRequest){
    
    if (!email) {
      throw new Error('Email incorrect')
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where:{
        email
      }
    })

    if(userAlreadyExists){
      throw new Error('User already exists')
    }

    const passowrdHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passowrdHash,
      },
      select:{
        id: true,
        name:true,
        email:true,
      }
    })

    return user;
  }
}