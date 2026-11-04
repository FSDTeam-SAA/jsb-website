import Link from "next/link";
import {
  ArrowLeft,
  CircleX,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

const reassurances = [
  "No payment was completed for this checkout.",
  "Your selected leads are still available in your cart.",
  "You can return whenever you are ready to finish your purchase.",
];

const CancelContainer = () => {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_68%)] px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-175px] size-[520px] -translate-x-1/2 rounded-full bg-[#ffe6c4]/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_1px_1px,rgba(154,87,19,0.09)_1px,transparent_0)] [background-size:20px_20px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-180px] left-[-80px] size-[360px] rounded-full bg-[#fff2dd]/80 blur-3xl"
      />

      <section
        aria-labelledby="order-cancel-heading"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#f0dfcb] bg-white shadow-[0_24px_70px_rgba(104,70,32,0.12)]"
      >
        <div className="h-1.5 bg-[linear-gradient(90deg,#9a5713_0%,#e39a45_55%,#f6ce99_100%)]" />
        <div className="p-6 text-center sm:p-10">
          <div className="mx-auto grid size-[82px] place-items-center rounded-full bg-[#fff0dc] text-[#b76819] ring-8 ring-[#fff9f1]">
            <CircleX aria-hidden="true" size={42} strokeWidth={2.4} />
          </div>

          <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#fff5e8] px-3 py-1.5 text-xs font-bold text-[#9a5713]">
            <CreditCard aria-hidden="true" size={15} />
            Checkout cancelled
          </p>
          <h1
            id="order-cancel-heading"
            className="mt-4 text-3xl font-bold tracking-[-0.045em] text-[#0f2c4f] sm:text-[44px]"
          >
            Your checkout was cancelled
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#4c6175] sm:text-base">
            No worries—your payment was not completed. Your cart is still available
            whenever you are ready to continue.
          </p>

          <div className="mt-8 rounded-2xl border border-[#f0e3d2] bg-[#fffaf5] p-4 text-left sm:p-5">
            <div className="flex items-center gap-2 text-[#9a5713]">
              <ShieldCheck aria-hidden="true" size={21} />
              <h2 className="font-bold">Nothing has been lost</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {reassurances.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-5 text-[#5f4a35]"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#ffe9cc] text-[#b76819]">
                    <CheckMark />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/cart"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#104170] px-6 text-sm font-bold text-white transition hover:bg-[#0b3b65] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
            >
              <ShoppingCart aria-hidden="true" size={18} /> Return to cart
            </Link>
            <Link
              href="/dashboard/find-leads"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#b9ccdd] bg-white px-6 text-sm font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
            >
              <ArrowLeft aria-hidden="true" size={18} /> Browse leads
            </Link>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#687b8e]">
            <RotateCcw aria-hidden="true" size={14} />
            Ready when you are—your cart will be waiting.
          </p>
        </div>
      </section>
    </main>
  );
};

const CheckMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="size-3"
  >
    <path d="m3 8 3.1 3L13 4.8" />
  </svg>
);

export default CancelContainer;
