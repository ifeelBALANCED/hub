import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email')
    .max(256, 'Email must be less than 256 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters'),
})

export const RegisterFormSchema = z
  .object({
    email: z
      .string()
      .email('Please enter a valid email')
      .max(256, 'Email must be less than 256 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be less than 64 characters'),
    displayName: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof LoginFormSchema>
export type RegisterFormValues = z.infer<typeof RegisterFormSchema>
