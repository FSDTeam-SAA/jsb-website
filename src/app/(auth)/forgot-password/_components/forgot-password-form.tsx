"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from 'next/image'
import { useMutation } from "@tanstack/react-query";

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
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});



const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const {mutate, isPending} = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn : async (values:{email:string})=>{
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`,{
        method : "POST",
        headers: {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(values)
      });
      return res.json();
    },
    onSuccess: (data, email)=>{
      if(!data?.success){
        toast?.error(data?.message || "Something went wrong");
        return
      }
      toast?.success(data?.message || "OTP sent to your email");
      router.push(`/forgot-password/otp?email=${encodeURIComponent(email?.email)}`)
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
   console.log(values);
   mutate(values)
  }
  return (
    <div>
      <div className="w-full max-w-[520px] bg-white">
        <div className="hidden w-full items-center justify-center pb-6">
          <Link href="/">
          <Image src="/assets/images/logo.png" alt="auth logo" width={500} height={500} className="w-[174px] h-[174px] object-contain" />
          </Link>
        </div>

        <Link href="/login" className="mb-7 inline-block text-sm text-[#0f2c4f]">← &nbsp; Back</Link>
        <h3 className="text-2xl font-bold text-black text-center leading-[120%] ">
          Forgot Password?
        </h3>
       <p className="text-base md:text-lg font-normal text-[#787878] leading-[150%] text-center pt-2">
          Enter your email and we&apos;ll send you a code to reset your password
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
                   <FormLabel className="text-base font-semibold text-[#2A2A2A] leading-[120%]">Email <sup className="text-[#8C311E]">*</sup></FormLabel>
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
            <div className="pt-2">
              <Button
                disabled={isPending}
                className={`text-base font-medium text-white cursor-pointer leading-[120%] rounded-[8px] py-4 w-full h-[51px] ${
                  isPending ? "opacity-50 cursor-not-allowed" : "bg-primary"
                }`}
                type="submit"
              >
                {isPending ? "Sending..." : "Send Code"}
              </Button>
            </div>
            <div>
              <p className="text-sm text-[#363636] font-medium text-center pt-2 leading-[120%] ">Back to <Link className="text-[#23547B] underline" href="/login">Log In</Link></p>
              </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
