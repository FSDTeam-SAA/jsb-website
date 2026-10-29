"use client";

import { useEffect, useState } from "react";
import LeadPreview from "./lead-preview";

const LeadPreviewController = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleViewLead = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof HTMLButtonElement && target.textContent?.trim() === "View Lead") {
        setOpen(true);
      }
    };
    document.addEventListener("click", handleViewLead);
    return () => document.removeEventListener("click", handleViewLead);
  }, []);

  return <LeadPreview open={open} onClose={() => setOpen(false)} />;
};

export default LeadPreviewController;
