"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const { login } = useAuth()
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NEXT_PUBLIC_DEFAULT_EMAIL || "",
      password: process.env.NEXT_PUBLIC_DEFAULT_PASSWORD || "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setFormError(null)

    try {
      await login(data)
      router.replace("/app")
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Login failed")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...form.register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={form.formState.errors.email ? true : false}
                  required
                />
                {form.formState.errors.email && (
                  <FieldError errors={[form.formState.errors.email]} />
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  {...form.register("password")}
                  id="password"
                  type="password"
                  aria-invalid={form.formState.errors.password ? true : false}
                  required
                />
                {form.formState.errors.password && (
                  <FieldError errors={[form.formState.errors.password]} />
                )}
              </Field>
              <Field>
                {formError && <FieldError>{formError}</FieldError>}
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
