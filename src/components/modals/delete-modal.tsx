import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  desc: string;
  isPending?: boolean;
};

const DeleteModal = ({ isOpen, onClose, onConfirm, title, desc, isPending = false }: DeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-w-[400px] rounded-[12px] bg-white p-6 shadow-[0_16px_40px_rgba(16,65,112,0.18)]" showCloseButton={!isPending}>
        <DialogHeader className="items-center gap-3 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-[#fff0f1] text-[#ed2532]">
            <AlertTriangle size={22} aria-hidden="true" />
          </span>
          <DialogTitle className="text-lg font-bold leading-normal text-[#17212e]">{title}</DialogTitle>
          <DialogDescription className="max-w-[310px] text-sm font-normal leading-relaxed text-[#667085]">
            {desc}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 grid w-full grid-cols-2 gap-3 border-0 bg-transparent p-0">
          <button type="button" disabled={isPending} className="h-10 rounded-[6px] border border-[#cbd5e1] text-sm font-medium text-[#344054] transition hover:bg-[#f8fafc] disabled:opacity-60" onClick={onClose}>Cancel</button>
          <button type="button" disabled={isPending} className="flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#ed2532] text-sm font-medium text-white transition hover:bg-[#c91c28] disabled:cursor-not-allowed disabled:opacity-60" onClick={onConfirm}><Trash2 size={16} aria-hidden="true" />{isPending ? "Deleting..." : "Delete"}</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
