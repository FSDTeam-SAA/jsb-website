"use client";

import AuthShell from "@/components/auth/auth-shell";
import { useRouter } from "next/navigation";

const leadTypes = ["Foreclosure Leads", "Pre-Foreclosure Leads", "Mortgage Leads", "Bankruptcy Leads", "Tax Lien Leads", "Probate Leads", "REO & Bank-Owned Leads", "Debt Settlement Leads"];

export default function LeadInterestsPage() {
  const router = useRouter();
  return <AuthShell><div className="w-full max-w-[600px]"><button onClick={() => router.back()} className="mb-8 text-sm text-[#0f2c4f]">← &nbsp; Back</button><h1 className="text-center text-3xl font-bold">What Leads Interest you?</h1><p className="mt-2 text-center text-sm">Optional. We&apos;ll use this to personalize saved searches and daily alerts.</p><label className="mt-6 block text-sm">Leads Type</label><div className="mt-2 flex flex-wrap gap-3">{leadTypes.map((type, i) => <button key={type} className={`rounded-[6px] border px-3 py-2 text-sm ${i === 0 || i === 4 ? "border-[#104170] text-[#104170]" : "border-[#ccc] text-[#9a9a9a]"}`}>{type}</button>)}</div><div className="mt-5 grid grid-cols-2 gap-3"><label className="text-sm">States of interest<select className="mt-2 h-11 w-full rounded-[6px] border px-3 text-[#9a9a9a]"><option>Select states</option></select></label><label className="text-sm">Cities of interest<select className="mt-2 h-11 w-full rounded-[6px] border px-3 text-[#9a9a9a]"><option>Select Cities</option></select></label></div><button className="mt-6 h-12 w-full rounded-[8px] bg-[#104170] text-sm font-bold text-white">Save Interests</button><button onClick={() => router.push("/")} className="mt-7 block w-full text-center text-sm font-bold text-[#104170]">Skip for Now</button></div></AuthShell>;
}
