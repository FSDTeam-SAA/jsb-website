"use client";

import { useState } from "react";
import AccountPanels from "./account-panels";
import AccountSettingsNav, { type AccountTab } from "./account-settings-nav";
import DeleteAccountModal from "./delete-account-modal";

const AccountContainer = () => {
  const [active, setActive] = useState<AccountTab>("profile");
  const [deleteOpen, setDeleteOpen] = useState(false);

  return <main className="min-w-0 flex-1 bg-[#f8fafe] px-4 py-6 md:px-6"><section className="mx-auto max-w-[1640px]"><header><h1 className="text-2xl font-bold text-[#0e1224]">Account</h1><p className="mt-2 text-xl text-[#545454]">Manage your membership and get support.</p></header><div className="mt-6 flex flex-col items-start gap-6 lg:flex-row lg:gap-8"><AccountSettingsNav active={active} onChange={setActive} onDelete={() => setDeleteOpen(true)} /><AccountPanels active={active} /></div></section><DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} /></main>;
};

export default AccountContainer;
