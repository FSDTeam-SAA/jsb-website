"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const amounts = [100, 250, 500, 1000];

const AddFundsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;
  const displayedAmount = customAmount || amount;
  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0d1f35]/45 p-4" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="add-funds-title" className="w-full max-w-[650px] rounded-[14px] bg-white p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 id="add-funds-title" className="text-[18px] font-bold text-[#104170]">Add Funds</h2><button onClick={onClose} aria-label="Close add funds"><X className="text-[#585858]" /></button></div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{amounts.map((value) => <button key={value} onClick={() => { setAmount(value); setCustomAmount(""); }} className={`h-[62px] rounded-[8px] text-[24px] font-medium transition ${amount === value && !customAmount ? "border border-[#104170] bg-[#e7f2ff] text-[#104170]" : "bg-[#fafafa] text-[#818181] hover:bg-[#f2f6fa]"}`}>${value}</button>)}</div>
        <label className="mt-4 block text-[12px] font-medium text-[#585858]">Custom Amount<input value={customAmount} onChange={(event) => setCustomAmount(event.target.value.replace(/[^0-9.]/g, ""))} placeholder="$00.000" className="mt-2 h-10 w-full rounded-[8px] border border-[#585858] px-2 text-[14px] outline-none focus:border-[#0073df]" /></label>
        <button className="mt-4 h-12 w-full rounded-[6px] bg-[#0073df] text-[16px] font-medium text-white transition hover:bg-[#0568c9]" onClick={onClose}>Add ${displayedAmount} to the balance</button>
      </section>
    </div>,
    document.body,
  );
};

export default AddFundsModal;
