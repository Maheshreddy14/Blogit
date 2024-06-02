import {Hono} from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign,verify } from 'hono/jwt'
import { signupInput, signinInput } from "@m4hez/blog-common";

export const userRouter = new Hono<{
    Bindings:{
      DATABASE_URL: string
      JWT_SECRET:string
    }
}>()
  
userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
    
    const user = await prisma.user.create({
        data: {
            username: body.username,
            email:body.email,
            password: body.password,
        },
    })
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({
        jwt: token
    })
    }
    catch(e){
        console.log(e)
        c.status(411)
        return c.text("invalid")
    }
})

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
    const user = await prisma.user.findUnique({
        where: {
            username: body.username,
            password: body.password,
        },
    })
    if (!user) {
        c.status(403)
        return c.text('user not found')
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({
        jwt: token
    })
    }
    catch(e){
        console.log(e)
        c.status(411)
        return c.text("invalid")
    }
})
