"use client";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; title: string; desc: string };

const SuccessfullyApprovedModal = ({ open, onOpenChange, title, desc }: Props) => {
  if (!open) return null;
  return <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4"><div className="max-w-sm rounded-xl bg-white p-6 text-center shadow-xl"><h2 className="text-xl font-bold text-[#104170]">{title}</h2><p className="mt-3 text-sm text-[#333]">{desc}</p><button onClick={() => onOpenChange(false)} className="mt-5 rounded-[8px] bg-[#104170] px-4 py-2 text-sm font-bold text-white">Close</button></div></div>;
};

export default SuccessfullyApprovedModal;
