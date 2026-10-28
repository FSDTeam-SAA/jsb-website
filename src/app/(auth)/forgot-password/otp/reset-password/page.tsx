import { Suspense } from "react";
import AuthShell from "@/components/auth/auth-shell";
import ResetPasswordForm from './_components/reset-password-form'
const ResetPasswordPage = () => {
  return (
    <AuthShell><Suspense fallback={<div>Loading...</div>}><ResetPasswordForm /></Suspense></AuthShell>)
}
export default ResetPasswordPage
