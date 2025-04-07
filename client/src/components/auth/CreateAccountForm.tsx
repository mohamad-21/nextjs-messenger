"use client";

import Logo from "@/components/ui/Logo";
import { Subtitle, Title } from "@/components/ui/Typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import GoogleLogin from "../ui/GoogleLogin";
import { createAccount } from "@/lib/actions/user.actions";
import { toast } from "@/hooks/use-toast";

const formSchema = z
  .object({
    name: z
      .string({ message: "name is required" })
      .min(3, { message: "name must contains at least 3 characters" }),
    email: z
      .string().email({ message: "please provide an valid email" }),
    username: z
      .string({ message: "username is required" })
      .min(5, { message: "username must contains at least 5 characters" }),
    password: z
      .string({ message: "password is required" })
      .min(8, { message: "password must contains at least 8 characters" }),
    confirm: z.string({ message: "passwords don't not match" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "passwords don't not match",
    path: ["confirm"],
  });

export type CreateUser = z.infer<typeof formSchema>;

export default function CreateAccountForm() {
  const form = useForm<CreateUser>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: CreateUser) {
    const { name, username, email, password } = values;

    try {
      await createAccount({ name, username, email, password });
    } catch (err: any) {
      toast({
        title: err?.message || "an unknown error occurred",
        variant: "destructive"
      })
    }
  }

  return (
    <section className="w-full max-w-xs">
      <div className="text-center">
        <Logo size={150} fill />
        <Title className="mt-6">Messenger</Title>
        <Subtitle className="mt-5">lets create your new account😎</Subtitle>
      </div>
      <div className="mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Name" id="name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        id="username"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email"
                      id="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      id="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      id="confirm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full font-bold">Create Account</Button>
            <span className="text-sm font-bold mt-3 text-center">OR</span>
            <div>
              <GoogleLogin />
            </div>
            <p className="text-sm mt-4 text-center">
              Have an account?{" "}
              <Link href="/login" className="text-primary">
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </section>
  );
}
