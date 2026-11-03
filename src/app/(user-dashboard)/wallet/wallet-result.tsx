import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleX,
  Clock3,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

const successSteps = [
  "Your payment checkout was completed successfully.",
  "We are verifying the payment with our payment provider.",
  "Your account balance will update after verification is complete.",
];

const cancelledSteps = [
  "No payment was completed for this funding request.",
  "Your current account balance has not changed.",
  "You can start a new funding request whenever you are ready.",
];

const WalletResult = ({ status }: { status: "success" | "cancelled" }) => {
  const isSuccess = status === "success";
  const steps = isSuccess ? successSteps : cancelledSteps;

  return (
    <main
      className={`relative isolate grid min-h-screen place-items-center overflow-hidden px-4 py-12 ${
        isSuccess
          ? "bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_58%)]"
          : "bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_58%)]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-10 size-[420px] -translate-x-1/2 rounded-full blur-3xl ${
          isSuccess ? "bg-[#d9ebfb]/70" : "bg-[#ffe8cb]/65"
        }`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_1px_1px,rgba(16,65,112,0.1)_1px,transparent_0)] [background-size:18px_18px]"
      />

      <section
        aria-labelledby="wallet-result-heading"
        className={`relative z-10 w-full max-w-2xl rounded-3xl border bg-white p-6 text-center sm:p-10 ${
          isSuccess
            ? "border-[#dbe7f4] shadow-[0_22px_60px_rgba(16,65,112,0.12)]"
            : "border-[#f0dfcb] shadow-[0_22px_60px_rgba(104,70,32,0.1)]"
        }`}
      >
        <div
          className={`mx-auto grid size-[76px] place-items-center rounded-full ring-8 ${
            isSuccess
              ? "bg-[#dcf7ea] text-[#078654] ring-[#f1fcf6]"
              : "bg-[#fff0dc] text-[#b76819] ring-[#fff9f1]"
          }`}
        >
          {isSuccess ? (
            <Check aria-hidden="true" size={39} strokeWidth={3} />
          ) : (
            <CircleX aria-hidden="true" size={39} strokeWidth={2.5} />
          )}
        </div>

        <p
          className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
            isSuccess
              ? "bg-[#edf7ff] text-[#104170]"
              : "bg-[#fff5e8] text-[#9a5713]"
          }`}
        >
          {isSuccess ? (
            <Clock3 aria-hidden="true" size={15} />
          ) : (
            <CreditCard aria-hidden="true" size={15} />
          )}
          {isSuccess ? "Payment verification in progress" : "Checkout cancelled"}
        </p>

        <h1
          id="wallet-result-heading"
          className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#0f2c4f] sm:text-[42px]"
        >
          {isSuccess ? "Your payment was received" : "Your payment was cancelled"}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#4c6175] sm:text-base">
          {isSuccess
            ? "Thanks for adding funds. Your account credit is added only after your payment has been verified."
            : "No worries—your payment was not completed, and no money has been added to your account."}
        </p>

        <div
          className={`mt-8 rounded-2xl border p-4 text-left sm:p-5 ${
            isSuccess
              ? "border-[#dceaf6] bg-[#f8fbff]"
              : "border-[#f0e3d2] bg-[#fffaf5]"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              isSuccess ? "text-[#104170]" : "text-[#9a5713]"
            }`}
          >
            <ShieldCheck aria-hidden="true" size={21} />
            <h2 className="font-bold">
              {isSuccess ? "What happens next" : "You’re all set"}
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {steps.map((step) => (
              <li
                key={step}
                className={`flex items-start gap-3 text-sm leading-5 ${
                  isSuccess ? "text-[#324b63]" : "text-[#5f4a35]"
                }`}
              >
                <span
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                    isSuccess
                      ? "bg-[#dff5ea] text-[#078654]"
                      : "bg-[#ffe9cc] text-[#b76819]"
                  }`}
                >
                  {isSuccess ? <Check aria-hidden="true" size={13} strokeWidth={3} /> : "•"}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] bg-[#104170] px-6 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            <LayoutDashboard aria-hidden="true" size={18} /> Go to dashboard
          </Link>
          <Link
            href={isSuccess ? "/dashboard/find-leads" : "/dashboard"}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[9px] border border-[#b9ccdd] bg-white px-6 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            {isSuccess ? "Explore leads" : "Try again later"}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default WalletResult;
