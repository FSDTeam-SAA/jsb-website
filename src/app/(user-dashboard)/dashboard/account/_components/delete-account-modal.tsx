"use client";

import { AlertTriangle, X } from "lucide-react";

const DeleteAccountModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  if (!open) return null;

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#141936]/45 p-4" onClick={onClose}><section role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="w-full max-w-[520px] rounded-[12px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><header className="flex items-center justify-between border-b border-[#e4eaf8] p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#fff1f2] text-[#ef4444]"><AlertTriangle size={21} /></span><h2 id="delete-account-title" className="text-xl font-bold text-[#0e1224]">Delete Account</h2></div><button onClick={onClose} aria-label="Close dialog" className="rounded p-1 text-[#545454] hover:bg-[#f5f7ff]"><X size={22} /></button></header><div className="p-5"><p className="text-base text-[#545454]">This action permanently removes your account and cannot be undone.</p><label className="mt-5 block text-base font-medium text-[#104170]">Reason<textarea placeholder="Tell us why you want to delete your account..." className="mt-2 h-32 w-full resize-none rounded-[12px] border-0 bg-[#f5f7ff] p-4 text-base text-[#505050] outline-none" /></label></div><footer className="flex flex-col-reverse gap-3 border-t border-[#e4eaf8] p-5 sm:flex-row sm:justify-end"><button onClick={onClose} className="h-12 rounded-[6px] border border-[#d0d5dd] px-5 text-base font-medium text-[#344054]">Cancel</button><button onClick={onClose} className="h-12 rounded-[6px] bg-[#ef4444] px-5 text-base font-medium text-white">Delete Account</button></footer></section></div>;
};

export default DeleteAccountModal;
