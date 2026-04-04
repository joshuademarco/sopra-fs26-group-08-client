"use client"
import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

//zod form schema
const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters."),
  email: z
  .string()
  .email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must contain at least 1 number."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], 
})

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const apiService = useApi();

  //set up zod form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  //async -> use await for fetch
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      //send data to backend -> POST /users
      const response = await apiService.post("/users", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      console.log("User successfully created", response);
      router.push("/login"); //or directly redirect to the application page?

      //check for backedn errors
    } catch (error: any) {
      //extract error message from backend response
      const errorMessage = error.response?.data?.message || error.message || "";

      //use form.setError to check for duplicates
      if (errorMessage.toLowerCase().includes("username")) {
        form.setError("username", { 
          type: "server", 
          message: "This username is already taken." 
        });
      }
      
      if (errorMessage.toLowerCase().includes("email")) {
        form.setError("email", { 
          type: "server", 
          message: "This email is already registered." 
        });
      }

      //catch all other errors and display error message
      if (!errorMessage.toLowerCase().includes("username") && !errorMessage.toLowerCase().includes("email")) {
        alert("Registration failed: " + errorMessage);
      }
    }
  }
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* connect form submission to react hook form */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      {...field}
                      id="username"
                      type="text"
                      placeholder="Wim Hof"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field className="grid grid-cols-2 gap-4">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="confirmPassword"
                        type="password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>
              <FieldDescription>
                Password must be at least 8 characters and contain 1 number.
              </FieldDescription>

              <Field>
                <Button type="submit" className="w-full">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login" className="underline">Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
