import { Suspense } from "react";
import AuthShell from "@/components/auth/auth-shell";
import OtpForm from './_components/otp-form'
const OtpPage = () => {
  return (
    <AuthShell><Suspense fallback={<div>Loading...</div>}><OtpForm /></Suspense></AuthShell>)
}
export default OtpPage
