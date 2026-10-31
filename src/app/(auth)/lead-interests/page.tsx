"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "@/components/auth/auth-shell";
import { updateLeadInterests } from "@/lib/auth-api";

const leadTypes = [
  "Foreclosure Leads",
  "Pre-Foreclosure Leads",
  "Mortgage Leads",
  "Bankruptcy Leads",
  "Tax Lien Leads",
  "Probate Leads",
  "REO & Bank-Owned Leads",
  "Debt Settlement Leads",
];

const listFromInput = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default function LeadInterestsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedLeadTypes, setSelectedLeadTypes] = useState<string[]>([]);
  const [states, setStates] = useState("");
  const [cities, setCities] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/lead-interests");
    }
  }, [router, status]);

  const saveMutation = useMutation({
    mutationKey: ["user", "lead-interests"],
    mutationFn: () => {
      const accessToken = session?.user.accessToken;
      if (!accessToken) throw new Error("Please log in to save your interests.");
      return updateLeadInterests(accessToken, {
        leadTypes: selectedLeadTypes,
        interestedStates: listFromInput(states),
        interestedCities: listFromInput(cities),
      });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Interests saved successfully.");
      router.push("/select-plan");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleLeadType = (leadType: string) => {
    setSelectedLeadTypes((current) =>
      current.includes(leadType)
        ? current.filter((item) => item !== leadType)
        : [...current, leadType],
    );
  };

  const continueWithoutSaving = () => router.push("/select-plan");

  if (status === "unauthenticated") return null;

  return (
    <AuthShell>
      <div className="w-full max-w-[600px]">
        <button onClick={() => router.back()} className="mb-8 text-sm text-[#0f2c4f]">
          ← &nbsp; Back
        </button>
        <h1 className="text-center text-3xl font-bold">What Leads Interest You?</h1>
        <p className="mt-2 text-center text-sm">Optional. We&apos;ll use this to personalize saved searches and daily alerts.</p>

        <label className="mt-6 block text-sm">Lead types</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {leadTypes.map((leadType) => {
            const selected = selectedLeadTypes.includes(leadType);
            return (
              <button
                key={leadType}
                type="button"
                onClick={() => toggleLeadType(leadType)}
                className={`rounded-[6px] border px-3 py-2 text-sm ${selected ? "border-[#104170] text-[#104170]" : "border-[#ccc] text-[#9a9a9a]"}`}
              >
                {leadType}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="text-sm">
            States of interest
            <input value={states} onChange={(event) => setStates(event.target.value)} placeholder="Florida, Texas" className="mt-2 h-11 w-full rounded-[6px] border px-3" />
          </label>
          <label className="text-sm">
            Cities of interest
            <input value={cities} onChange={(event) => setCities(event.target.value)} placeholder="Miami, Orlando" className="mt-2 h-11 w-full rounded-[6px] border px-3" />
          </label>
        </div>

        <button onClick={() => saveMutation.mutate()} disabled={status === "loading" || saveMutation.isPending} className="mt-6 h-12 w-full rounded-[8px] bg-[#104170] text-sm font-bold text-white disabled:opacity-60">
          {saveMutation.isPending ? "Saving..." : "Save Interests"}
        </button>
        <button onClick={continueWithoutSaving} className="mt-7 block w-full text-center text-sm font-bold text-[#104170]">Skip for Now</button>
      </div>
    </AuthShell>
  );
}
