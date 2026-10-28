"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
    email: z.string().trim().email("Please enter a valid email address."),
    phoneNumber: z.string().trim().min(6, "Please enter a valid phone number."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long."),
    agreeToTerms: z.literal(true, { error: "You must agree to the terms and privacy policy." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof formSchema>;

const inputClassName =
  "h-12 rounded-[7px] border border-[#dce1e9] bg-white px-3 text-sm text-[#161616] shadow-none placeholder:text-[#a9adb5] focus-visible:ring-1 focus-visible:ring-[#174d7e]";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phoneNumber: "", password: "", confirmPassword: "", agreeToTerms: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (values: { fullName: string; email: string; password: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registration failed");
      return data;
    },
    onSuccess: (data) => {
      if (!data?.success) return toast.error(data?.message || "Something went wrong!");
      toast.success(data?.message || "Registration successful");
      form.reset();
      window.setTimeout(() => router.push("/select-plan"), 1200);
    },
    onError: (error: Error) => toast.error(error.message || "Something went wrong"),
  });

  const onSubmit = (values: FormValues) => mutate({
    fullName: `${values.firstName} ${values.lastName}`.trim(), email: values.email, password: values.password,
  });

  return (
    <div className="w-full max-w-[520px] bg-white">
      <Link href="/" className="mb-7 inline-flex items-center gap-2 text-sm text-[#111b2b] transition hover:text-[#174d7e]">
        <ArrowLeft size={17} strokeWidth={1.5} /> Back
      </Link>
      <h1 className="text-center text-[30px] font-bold leading-tight text-black sm:text-[32px]">Create Account</h1>
      <p className="mt-2 text-center text-sm text-black">Please enter your email &amp; password to access your account.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem className="space-y-1.5"><FormLabel className="text-sm font-medium text-[#151515]">First name</FormLabel><FormControl><Input className={inputClassName} placeholder="Enter your first name" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem className="space-y-1.5"><FormLabel className="text-sm font-medium text-[#151515]">Last name</FormLabel><FormControl><Input className={inputClassName} placeholder="Enter your last name" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem className="space-y-1.5"><FormLabel className="text-sm font-medium text-[#151515]">Email</FormLabel><FormControl><Input className={inputClassName} type="email" placeholder="Enter your email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phoneNumber" render={({ field }) => (
            <FormItem className="space-y-1.5"><FormLabel className="text-sm font-medium text-[#151515]">Phone Number</FormLabel><FormControl><Input className={inputClassName} type="tel" placeholder="Enter your phone number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem className="space-y-1.5"><FormLabel className="text-sm font-medium text-[#151515]">Password</FormLabel><FormControl><div className="relative"><Input className={`${inputClassName} pr-11`} type={showPassword ? "text" : "password"} placeholder="**********" {...field} /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070]" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem className="space-y-1.5"><FormLabel className="text-sm font-medium text-[#151515]">Confirm Password</FormLabel><FormControl><div className="relative"><Input className={`${inputClassName} pr-11`} type={showConfirmPassword ? "text" : "password"} placeholder="**********" {...field} /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707070]" type="button" aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} onClick={() => setShowConfirmPassword((value) => !value)}>{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></FormControl><FormMessage /></FormItem>
          )} />

          <FormField control={form.control} name="agreeToTerms" render={({ field }) => (
            <FormItem className="flex items-start gap-2 space-y-0 pt-0.5"><FormControl><Checkbox className="mt-0.5 size-4 rounded-[3px]" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} /></FormControl><div><label className="text-sm leading-5 text-[#1c1c1c]">I agree to the Foreclosure Gold <Link className="font-semibold" href="/terms-and-conditions">Terms &amp; Conditions</Link> and <Link className="font-semibold" href="/privacy-policy">Privacy Policy.</Link></label><FormMessage /></div></FormItem>
          )} />

          <Button disabled={isPending} className="mt-1 h-12 w-full rounded-[7px] bg-[#174d7e] text-sm font-semibold hover:bg-[#113d66]" type="submit">{isPending ? "Creating..." : "Sign Up"}</Button>
          <p className="pt-2 text-center text-sm text-[#171717]">Already have an account? <Link className="ml-2 text-[#174d7e]" href="/login">Login</Link></p>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
