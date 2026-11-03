"use client";

import { useEffect, useState } from "react";
import type { MarketplaceLead } from "@/lib/marketplace-api";
import LeadPreview from "./lead-preview";

type LeadPreviewControllerProps = {
  lead?: MarketplaceLead | null;
  onClose?: () => void;
};

const LeadPreviewController = ({ lead, onClose }: LeadPreviewControllerProps) => {
  const [legacyOpen, setLegacyOpen] = useState(false);
  const isControlled = lead !== undefined;

  useEffect(() => {
    if (isControlled) return;

    const handleViewLead = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLButtonElement &&
        target.textContent?.trim() === "View Lead"
      ) {
        setLegacyOpen(true);
      }
    };

    document.addEventListener("click", handleViewLead);
    return () => document.removeEventListener("click", handleViewLead);
  }, [isControlled]);

  return (
    <LeadPreview
      open={isControlled ? Boolean(lead) : legacyOpen}
      lead={lead}
      onClose={isControlled ? () => onClose?.() : () => setLegacyOpen(false)}
    />
  );
};

export default LeadPreviewController;
