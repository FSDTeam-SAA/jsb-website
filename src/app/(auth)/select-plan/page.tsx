"use client";

import AuthShell from "@/components/auth/auth-shell";
import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  ["Free", "0", "0%"],
  ["Silver", "49", "5%"],
  ["Gold", "99", "10%"],
  ["Diamond", "149", "15%"],
] as const;

export default function SelectPlanPage() {
  const [selected, setSelected] = useState("Free");
  const router = useRouter();
  return (
    <AuthShell>
      <div className="w-full max-w-[640px]">
        <button
          onClick={() => router.back()}
          className="mb-8 text-sm text-[#0f2c4f]"
        >
          ← &nbsp; Back
        </button>
        <h1 className="text-center text-3xl font-bold">Select Plan</h1>
        <p className="mt-2 text-center text-sm">
          Select the plan that fits your needs and save more on every lead you
          purchase.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {plans.map(([name, price, discount]) => (
            <button
              key={name}
              onClick={() => setSelected(name)}
              className={`h-[215px] rounded-[8px] border p-4 text-center ${selected === name ? "border-[3px] border-[#104170]" : "border-[#aaa]"}`}
            >
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="mt-4 text-3xl font-bold">
                ${price}
                <span className="text-xs">/month</span>
              </p>
              <div className="mt-7 rounded-[8px] bg-[#f3f7ff] py-3 text-[#104170]">
                <b className="text-xl">{discount}</b>
                <p className="text-xs font-bold">Lead Discount</p>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push("/lead-interests")}
          className="mt-6 h-12 w-full rounded-[8px] bg-[#104170] text-sm font-bold text-white"
        >
          Continue to Payment
        </button>
      </div>
    </AuthShell>
  );
}
