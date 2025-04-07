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
import { toast } from "@/hooks/use-toast";
import { credentialsLogin } from "@/lib/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import GoogleLogin from "../ui/GoogleLogin";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string({ message: "Enter your email or username" }),
  password: z
    .string({ message: "Enter your password" })
});

type LoginForm = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    mode: "all"
  });

  async function onSubmit(values: LoginForm) {
    const { email, password } = values;
    try {
      await credentialsLogin({ email, password });
      return router.replace("/");
    } catch (err: any) {
      toast({
        title: err?.message,
        variant: "destructive"
      });
    }
  }

  return (
    <section className="w-full max-w-xs">
      <div className="text-center">
        <Logo size={150} fill />
        <Title className="mt-6">Messenger</Title>
        <Subtitle className="mt-5">
          Log in your account to using messenger
        </Subtitle>
      </div>
      <div className="mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="email or username"
                      id="email"
                      {...field}
                      required
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
            <Button className="w-full font-bold">Login</Button>
            <span className="text-sm font-bold mt-3 text-center">OR</span>
            <div>
              <GoogleLogin />
            </div>
            <p className="text-sm mt-4 text-center">
              don&apos;t have account?{" "}
              <Link href="/signup" className="text-primary">
                Create new
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </section>
  );
}
