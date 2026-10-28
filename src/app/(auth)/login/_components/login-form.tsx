"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from 'next/image'

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  // 2. Define a submit handler.
async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    setIsLoading(true);

    const res = await signIn("credentials", {
      email: values?.email,
      password: values?.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error || "Login failed");
      return;
    }

    toast.success("Login successful!");

    router.push("/");

  } catch (error) {
    console.error("Login failed:", error);
    toast.error("Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
}
  return (
    <div>
      <div className="w-full max-w-[520px] bg-white">
        <div className="hidden w-full items-center justify-center">
          <Link href="/">
            <Image src="/assets/images/logo.png" alt="auth logo" width={500} height={500} className="w-[174px] h-[174px] object-contain" />
          </Link>
        </div>

        <Link href="/" className="mb-7 inline-block text-sm text-[#0f2c4f]">← &nbsp; Back</Link>
        <h3 className="text-2xl font-bold text-black text-center leading-[120%] ">
          Welcome Back!
        </h3>
        <p className="text-base md:text-lg font-normal text-[#787878] leading-[150%] text-center pt-2">
          Please enter your email &amp; password to access your account.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-5 md:pt- lg:pt-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Email <sup className="text-[#8C311E]">*</sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-[48px] !rounded-[6px] border border-[#dbe1ea] bg-white text-sm placeholder:text-[#b5b5b5]"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">
                    Password <sup className="text-[#8C311E]">*</sup>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-[48px] !rounded-[6px] border border-[#dbe1ea] bg-white text-sm placeholder:text-[#b5b5b5]"
                        placeholder="**********"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-3.5 right-4"
                      >
                        {showPassword ? (
                          <Eye className="text-[#787878]" onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                          <EyeOff
                          className="text-[#787878]"
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="w-full flex items-center justify-between">
                  <FormItem className="flex items-center gap-[10px]">
                    <FormControl className="mt-1">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary"
                      />
                    </FormControl>
                    <Label
                      className="text-sm font-medium text-[#2A2A2A] leading-[120%]"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </Label>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                  <Link
                    className="text-sm font-medium text-[#8C311ECC]/80 cursor-pointer leading-[120%] hover:underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            />
            <div className="pt-2">
              <Button
                disabled={isLoading}
                className={`text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] ${isLoading ? "opacity-50 cursor-not-allowed" : "bg-primary"
                  }`}
                type="submit"
              >
                {isLoading ? "Login ..." : "Login"}
              </Button>
            </div>
              <p className="text-sm text-[#363636] font-medium text-center pt-2 leading-[120%] ">Don’t have an account? <Link className="text-[#104170]" href="/sign-up">Create account</Link></p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
