import { z } from "zod";

export const registerUserSchema = z.object({
    body:z.object({
        name: z.string({required_error:"Name is required"}),
        email: z.string({required_error:"Email is required"}).email("Invalid Email"),
        password: z.string({required_error:"Password is required"}).min(6,'Password is weak, min 6 characters required'),
    })
})

export const loginUserSchema = z.object({
    body:z.object({
        email: z.string({required_error:"Email is required"}).email("Invalid Email"),
        password: z.string({required_error:"Password is required"}).min(6,'Password is weak, min 6 characters required'),
    })
})