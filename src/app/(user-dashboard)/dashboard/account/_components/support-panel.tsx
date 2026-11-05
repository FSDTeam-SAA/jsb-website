"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  CircleAlert,
  Inbox,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ContactTicket,
  getMyContactMessages,
  submitContactMessage,
} from "@/lib/auth-api";

const categories = [
  "Bad Leads",
  "Account / Billing",
  "Lead Purchase",
  "Technical Issue",
  "Other",
];

const formatTicketDate = (createdAt: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

const StatusBadge = ({ status }: { status: string }) => {
  const normalizedStatus = status.replace("_", " ").toLowerCase();
  const isResolved = normalizedStatus === "resolved";
  const label =
    normalizedStatus === "pending"
      ? "Pending"
      : normalizedStatus
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" ");

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-medium",
        isResolved
          ? "bg-[rgba(16,185,129,0.1)] text-[#10b981]"
          : "bg-[#fff7e6] text-[#efae00]",
      ].join(" ")}
    >
      <i
        className={[
          "size-1.5 rounded-full",
          isResolved ? "bg-[#10b981]" : "bg-[#efae00]",
        ].join(" ")}
      />
      {label}
    </span>
  );
};

const HistoryTable = ({ tickets }: { tickets: ContactTicket[] }) => (
  <section className="overflow-hidden rounded-2xl bg-white p-4 sm:overflow-x-auto sm:p-6">
    <h3 className="border-b border-[#f5f7ff] pb-2 text-xl font-bold text-[#0e1224]">
      History
    </h3>
    <div className="space-y-3 pt-4 sm:hidden">
      {tickets.map((ticket) => (
        <article
          key={ticket.id}
          className="rounded-xl border border-[#edf1f5] bg-[#fafcff] p-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1b1b3a]">
                {ticket.subject}
              </p>
              <p className="mt-1 truncate text-xs text-[#667085]">
                #{ticket.id}
              </p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="mt-3 text-xs text-[#667085]">
            {formatTicketDate(ticket.createdAt)}
          </p>
        </article>
      ))}
    </div>
    <div className="hidden min-w-[660px] sm:block">
      <div className="grid grid-cols-4 border-b border-[#f5f7ff] pb-4 pt-4 text-sm font-medium text-[#0e1224]">
        <span>Ticket ID</span>
        <span>Date</span>
        <span className="text-center">Subject</span>
        <span className="text-right">Status</span>
      </div>
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="grid grid-cols-4 items-center py-2 text-sm text-[#1b1b3a]"
        >
          <span className="truncate">{ticket.id}</span>
          <span>{formatTicketDate(ticket.createdAt)}</span>
          <span className="truncate text-center">{ticket.subject}</span>
          <span className="text-right">
            <StatusBadge status={ticket.status} />
          </span>
        </div>
      ))}
    </div>
  </section>
);

const SupportHistorySkeleton = () => (
  <section
    aria-busy="true"
    aria-live="polite"
    className="rounded-2xl bg-white p-6"
  >
    <span className="sr-only">Loading support history</span>
    <div className="h-7 w-24 animate-pulse rounded bg-[#e8eff7] motion-reduce:animate-none" />
    <div className="mt-3 border-t border-[#f5f7ff] pt-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 py-2.5 sm:grid-cols-4 sm:gap-6"
          aria-hidden="true"
        >
          <div className="h-4 w-36 animate-pulse rounded bg-[#e8eff7] motion-reduce:animate-none" />
          <div className="h-4 w-28 animate-pulse rounded bg-[#e8eff7] motion-reduce:animate-none" />
          <div className="mx-auto h-4 w-32 animate-pulse rounded bg-[#e8eff7] motion-reduce:animate-none" />
          <div className="ml-auto h-6 w-20 animate-pulse rounded-lg bg-[#e8eff7] motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  </section>
);

const SupportHistoryError = ({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void;
  isRetrying: boolean;
}) => (
  <section
    role="alert"
    className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-[#fecaca] bg-[#fff7f7] p-6 text-center"
  >
    <span className="grid size-12 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626]">
      <CircleAlert size={24} />
    </span>
    <h3 className="mt-4 text-lg font-bold text-[#7f1d1d]">
      Unable to load support history
    </h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-[#991b1b]">
      We could not load your previous support messages. Please try again.
    </p>
    <button
      type="button"
      onClick={onRetry}
      disabled={isRetrying}
      className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#104170] px-4 text-sm font-semibold text-white transition hover:bg-[#0b355d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <RefreshCw className={isRetrying ? "size-4 animate-spin" : "size-4"} />
      {isRetrying ? "Retrying..." : "Try again"}
    </button>
  </section>
);

const SupportHistoryEmpty = () => (
  <section className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#bcd8f2] bg-white p-6 text-center">
    <span className="grid size-12 place-items-center rounded-full bg-[#d1e4f6] text-[#104170]">
      <Inbox size={24} />
    </span>
    <h3 className="mt-4 text-lg font-bold text-[#104170]">
      No support messages yet
    </h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-[#50657a]">
      Your submitted support requests will appear here.
    </p>
  </section>
);

const SupportPanel = () => {
  const [category, setCategory] = useState("Account / Billing");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [message, setMessage] = useState("");
  const categoryRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const accessToken = session?.user.accessToken;

  const supportHistoryQuery = useQuery({
    queryKey: ["contact-us", "my", accessToken],
    queryFn: () => getMyContactMessages(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
  });

  const contactMutation = useMutation({
    mutationKey: ["contact-us"],
    mutationFn: () =>
      submitContactMessage(accessToken!, {
        subject: category,
        message: message.trim(),
      }),
    onSuccess: (response) => {
      setMessage("");
      queryClient.invalidateQueries({
        queryKey: ["contact-us", "my", accessToken],
      });
      toast.success(
        response.message || "Contact message submitted successfully.",
      );
    },
    onError: (error) =>
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not send your message. Please try again.",
      ),
  });

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!categoryRef.current?.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoryOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const submitSupportRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message before sending.");
      return;
    }
    if (status !== "authenticated" || !accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    contactMutation.mutate();
  };

  return (
    <div className="min-w-0 pb-8 sm:pb-16">
      <form
        onSubmit={submitSupportRequest}
        noValidate
        className="min-w-0 overflow-visible rounded-[8px] border border-[#f8e5c1] bg-white p-3 sm:p-4"
      >
        <div className="relative" ref={categoryRef}>
          <span className="block text-sm font-medium text-[#585858]">
            Subject
          </span>
          <button
            type="button"
            onClick={() => setCategoryOpen((open) => !open)}
            className={[
              "mt-2 flex h-10 w-full items-center justify-between rounded-[8px] border px-2 text-left text-xs font-medium outline-none transition focus-visible:border-[#104170] focus-visible:ring-2 focus-visible:ring-[#104170]/15",
              categoryOpen
                ? "border-[#104170] bg-[#eaf4ff] text-[#104170]"
                : "border-[#949494] bg-white text-black hover:border-[#5f7892]",
            ].join(" ")}
            aria-haspopup="listbox"
            aria-expanded={categoryOpen}
          >
            <span>{category}</span>
            <ChevronDown
              className={
                "shrink-0 transition-transform " +
                (categoryOpen ? "rotate-180" : "")
              }
              size={16}
              aria-hidden="true"
            />
          </button>
          {categoryOpen && (
            <div
              role="listbox"
              aria-label="Support category"
              className="absolute z-20 mt-2 w-full rounded-[8px] border border-[#e3eaf4] bg-[#f8fafe] p-2 shadow-[0_10px_24px_rgba(25,51,83,0.14)]"
            >
              {categories.map((option) => {
                const selected = option === category;
                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setCategory(option);
                      setCategoryOpen(false);
                    }}
                    className={[
                      "flex min-h-9 w-full items-center justify-center rounded-[8px] px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]",
                      selected
                        ? "border border-[#104170] bg-[#eaf4ff] text-[#104170]"
                        : "bg-white text-[#8b93b8] hover:bg-[#eef5ff] hover:text-[#104170]",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <label className="mt-4 block text-sm font-medium text-[#585858]">
          Message
          <textarea
            placeholder="Tell us how we can help..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={contactMutation.isPending}
            className="mt-2 h-[106px] w-full resize-none rounded-[8px] border border-[#949494] bg-white p-2 text-xs text-black outline-none placeholder:text-[#a3a3a3] focus:border-[#104170] focus:ring-2 focus:ring-[#104170]/15 disabled:cursor-not-allowed disabled:bg-[#f8fafe]"
          />
        </label>

        <button
          type="submit"
          disabled={contactMutation.isPending}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-[#0073df] px-4 text-base font-medium text-white transition hover:bg-[#0067c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:h-9 sm:w-auto"
        >
          {contactMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              Send Message
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
          {contactMutation.isPending && "Sending..."}
        </button>
        <p className="mt-3 text-xs text-[#a3a3a3]">
          Billing errors are reviewed for a payment refund when appropriate.
        </p>
      </form>

      <div className="pt-8">
        {status === "loading" || supportHistoryQuery.isLoading ? (
          <SupportHistorySkeleton />
        ) : status !== "authenticated" || !accessToken || supportHistoryQuery.isError ? (
          <SupportHistoryError
            onRetry={() => {
              if (status !== "authenticated" || !accessToken) {
                window.location.assign("/login");
                return;
              }
              supportHistoryQuery.refetch();
            }}
            isRetrying={supportHistoryQuery.isFetching}
          />
        ) : supportHistoryQuery.data?.data.length ? (
          <HistoryTable tickets={supportHistoryQuery.data.data} />
        ) : (
          <SupportHistoryEmpty />
        )}
      </div>
    </div>
  );
};

export default SupportPanel;
