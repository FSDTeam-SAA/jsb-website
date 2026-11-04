"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CreditCard,
  Crown,
  Percent,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { type WheelEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  checkoutCart,
  getCart,
  type CartItem,
  type CartSummary,
} from "@/lib/cart-api";

const leadTypeClasses: Record<string, string> = {
  Foreclosure: "bg-[#ffe9ed] text-[#ef4765]",
  "Foreclosure Auction": "bg-[#ffe9ed] text-[#ef4765]",
  "Tax Lien": "bg-[#f3eaff] text-[#a855f7]",
  "Tax Deed Auction": "bg-[#f3eaff] text-[#a855f7]",
  "Pre-Foreclosure": "bg-[#fff2dd] text-[#b7791f]",
  Bankruptcy: "bg-[#dff8f7] text-[#0c8e88]",
  "Bank Owned / REO": "bg-[#eee8ff] text-[#6d42d8]",
  "REO/Bank-Owned": "bg-[#eee8ff] text-[#6d42d8]",
};

const emptyCartItems: CartItem[] = [];

const toAmount = (amount: number | string | undefined) => Number(amount || 0);

const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const CartContainer = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const queryClient = useQueryClient();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [useCredit, setUseCredit] = useState(false);
  const cartQuery = useQuery({
    queryKey: ["cart", accessToken],
    queryFn: () => getCart(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
  });

  const cart = cartQuery.data?.data;
  const items = cart?.items ?? emptyCartItems;
  const apiSummary = cart?.summary;

  useEffect(() => {
    if (!cartQuery.data?.data) return;
    setSelectedIds(
      cartQuery.data.data.items
        .filter((item) => item.available)
        .map((item) => item.cartItemId),
    );
  }, [cartQuery.data]);

  const summary = useMemo(
    () => calculateSummary(items, selectedIds, useCredit, apiSummary),
    [apiSummary, items, selectedIds, useCredit],
  );
  const availableItems = items.filter((item) => item.available);
  const selectedAll =
    availableItems.length > 0 && selectedIds.length === availableItems.length;
  const checkoutMutation = useMutation({
    mutationFn: () => {
      if (!accessToken) throw new Error("Please sign in before checking out.");

      return checkoutCart(accessToken, {
        cartItemIds: summary.selectedItems.map((item) => item.cartItemId),
        useWallet: useCredit,
      });
    },
    onSuccess: (response) => {
      const checkout = response.data;

      if (checkout.checkoutUrl) {
        window.location.assign(checkout.checkoutUrl);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["cart", accessToken] });
      window.location.assign(
        "/order/success?order_id=" + encodeURIComponent(checkout.orderId),
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not start checkout. Please try again.",
      );
    },
  });

  const toggleLead = (cartItemId: string) => {
    setSelectedIds((current) =>
      current.includes(cartItemId)
        ? current.filter((id) => id !== cartItemId)
        : [...current, cartItemId],
    );
  };

  const completePurchase = () => {
    if (!summary.selectedItems.length) {
      toast.error("Select at least one available lead before continuing.");
      return;
    }

    checkoutMutation.mutate();
  };

  const handleCartWheel = (event: WheelEvent<HTMLElement>) => {
    const panel = event.currentTarget;
    const maximumScroll = panel.scrollHeight - panel.clientHeight;

    if (!event.deltaY || maximumScroll <= 0) return;

    event.preventDefault();
    event.stopPropagation();
    panel.scrollTop = Math.max(
      0,
      Math.min(maximumScroll, panel.scrollTop + event.deltaY),
    );
  };

  if (status === "loading" || cartQuery.isLoading) return <CartLoadingState />;

  if (status !== "authenticated" || !accessToken) {
    return (
      <CartMessageState
        icon={ShoppingCart}
        title="Sign in to view your cart"
        description="Your saved leads and checkout summary are available after you sign in."
        actionLabel="Explore leads"
        actionHref="/dashboard/find-leads"
      />
    );
  }

  if (cartQuery.isError) {
    return (
      <CartMessageState
        icon={AlertCircle}
        title="We couldn't load your cart"
        description="Please check your connection and try again. Your saved leads will remain safe."
        actionLabel="Try again"
        onAction={() => cartQuery.refetch()}
        secondaryLabel="Browse leads"
        secondaryHref="/dashboard/find-leads"
        error
      />
    );
  }

  if (!cart || !items.length) {
    return (
      <CartMessageState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Explore available leads and add the ones that fit your next opportunity."
        actionLabel="Browse leads"
        actionHref="/dashboard/find-leads"
      />
    );
  }

  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd]">
      <div className="mx-auto flex min-h-[calc(100vh-75px)] max-w-[1800px] flex-col xl:h-[calc(100dvh-75px)] xl:min-h-0 xl:overflow-hidden xl:flex-row">
        <section
          data-lenis-prevent
          onWheelCapture={handleCartWheel}
          className="dashboard-summary-scroll min-w-0 flex-1 touch-pan-y px-4 py-6 sm:px-6 lg:px-8 xl:h-full xl:overflow-y-auto xl:overscroll-y-contain"
          aria-labelledby="cart-heading"
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 id="cart-heading" className="text-xl font-bold leading-tight text-[#0e1224]">
                  Cart
                </h1>
                <p className="mt-2 text-sm text-[#545454] sm:text-base">
                  Review your selected leads and pricing before proceeding to checkout.
                </p>
              </div>
              <span className="rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#087ce1]">
                {apiSummary?.totalItems || items.length} lead{(apiSummary?.totalItems || items.length) === 1 ? "" : "s"} in cart
              </span>
            </div>

            {apiSummary?.unavailableItems ? (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#fde7b5] bg-[#fffaf0] p-3 text-sm text-[#8b5a16]">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {apiSummary.unavailableItems} lead{apiSummary.unavailableItems === 1 ? " is" : "s are"} currently unavailable and cannot be selected for checkout.
              </div>
            ) : null}

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#f1f4f9] bg-white p-3 shadow-[0_2px_10px_rgba(31,61,96,0.04)] sm:p-4">
              <div className="overflow-x-auto" data-lenis-prevent>
                <table className="w-full min-w-[900px] border-collapse text-left text-[11px]">
                  <thead className="border-b-2 border-[#f1f4f9] bg-[#fafbfd] text-[#676767]">
                    <tr>
                      <th className="w-10 px-3 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAll}
                          onChange={() =>
                            setSelectedIds(
                              selectedAll
                                ? []
                                : availableItems.map((item) => item.cartItemId),
                            )
                          }
                          aria-label="Select all available cart leads"
                          className="size-3.5 rounded border-[#949494] accent-[#087ce1]"
                        />
                      </th>
                      {[
                        "Lead #",
                        "Lead Type",
                        "Location",
                        "Property Type",
                        "Stage",
                        "Purchase Type",
                        "Price",
                        "Status",
                      ].map((heading) => (
                        <th key={heading} className="whitespace-nowrap px-3 py-4 font-medium">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-[#243047]">
                    {items.map((item) => {
                      const isSelected = selectedIds.includes(item.cartItemId);
                      const isExclusive = item.priceType === "EXCLUSIVE";
                      const itemCurrency = item.currency || apiSummary?.currency || "USD";

                      return (
                        <tr
                          key={item.cartItemId}
                          className={
                            "border-b border-[#f1f4f9] last:border-0 " +
                            (item.available ? "hover:bg-[#fbfdff]" : "bg-[#fafafa] text-[#98a2b3]")
                          }
                        >
                          <td className="px-3 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!item.available}
                              onChange={() => toggleLead(item.cartItemId)}
                              aria-label={"Select lead " + item.leadNumber}
                              className="size-3.5 rounded border-[#949494] accent-[#087ce1] disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="px-3 py-4 font-semibold">FG-LD-{item.leadNumber}</td>
                          <td className="px-3 py-4">
                            <span
                              className={
                                "inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium " +
                                (leadTypeClasses[item.categoryName] ||
                                  "bg-slate-100 text-slate-600")
                              }
                            >
                              {item.categoryName}
                            </span>
                          </td>
                          <td className="max-w-[170px] px-3 py-4 leading-4">{item.location}</td>
                          <td className="whitespace-nowrap px-3 py-4">{item.propertyType || "—"}</td>
                          <td className="whitespace-nowrap px-3 py-4">{item.stage || "—"}</td>
                          <td className="px-3 py-4">
                            <span
                              className={
                                "inline-flex rounded-full px-2 py-1 text-[10px] font-medium " +
                                (isExclusive
                                  ? "bg-[#ddf9e8] text-[#10a44c]"
                                  : "bg-[#e4f4ff] text-[#087ce7]")
                              }
                            >
                              {isExclusive ? "Exclusive" : "Shared"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 font-medium">
                            {formatCurrency(toAmount(item.finalPrice), itemCurrency)}
                          </td>
                          <td className="px-3 py-4">
                            <span
                              className={
                                item.available
                                  ? "rounded-full bg-[#dcf7ea] px-2 py-1 text-[10px] font-medium text-[#078654]"
                                  : "rounded-full bg-[#f2f4f7] px-2 py-1 text-[10px] font-medium text-[#667085]"
                              }
                            >
                              {item.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <aside
          className="w-full shrink-0 border-t border-[#e6edf5] bg-white xl:sticky xl:top-[75px] xl:flex xl:h-[calc(100vh-75px)] xl:w-[360px] xl:flex-col xl:border-l xl:border-t-0"
          aria-label="Purchase summary"
        >
          <div className="shrink-0 px-4 pt-5 sm:px-6 xl:px-5">
            <div className="flex items-center gap-2 border-b border-[#e6edf5] pb-5">
              <span className="grid size-8 place-items-center rounded-full bg-[#eef5ff] text-[#087ce1]">
                <ShoppingCart size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold text-[#0f1839]">Purchase Summary</h2>
            </div>
          </div>

          <div
            data-lenis-prevent
            className="dashboard-summary-scroll scroll-smooth overscroll-y-contain px-4 pb-5 sm:px-6 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:px-5"
          >
            <div className="space-y-6 py-5">
              <SummarySection title="Purchase Overview">
                <SummaryRow label="Selected leads" value={summary.totalQuantity.toString()} />
                <SummaryRow label="Shared leads" value={summary.sharedQuantity.toString()} />
                <SummaryRow label="Exclusive leads" value={summary.exclusiveQuantity.toString()} />
              </SummarySection>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-2 transition hover:bg-[#fafbfd]">
                <input
                  type="checkbox"
                  checked={useCredit}
                  onChange={(event) => setUseCredit(event.target.checked)}
                  className="mt-[3px] size-4 rounded border-[#949494] accent-[#087ce1]"
                />
                <span>
                  <span className="block text-sm font-semibold leading-5 text-[#334155]">
                    Apply account credit
                  </span>
                  <span className="mt-0.5 block text-xs leading-4 text-[#878a9b]">
                    Available balance: {formatCurrency(summary.walletBalance, summary.currency)}
                  </span>
                </span>
              </label>

              <SummarySection title="Payment Overview">
                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(summary.subtotal, summary.currency)}
                />
                <SummaryRow
                  label={
                    summary.subscriptionName
                      ? "Membership discount · " + summary.subscriptionName
                      : "Discount"
                  }
                  value={
                    summary.discount
                      ? "-" + formatCurrency(summary.discount, summary.currency)
                      : formatCurrency(0, summary.currency)
                  }
                  accent={Boolean(summary.discount)}
                />
                <SummaryRow
                  label="Account credit"
                  value={
                    summary.credit
                      ? "-" + formatCurrency(summary.credit, summary.currency)
                      : formatCurrency(0, summary.currency)
                  }
                  accent={Boolean(summary.credit)}
                />
                <SummaryRow
                  label="Amount charged to card"
                  value={formatCurrency(summary.amountDue, summary.currency)}
                />
              </SummarySection>

              <SummarySection title="Payment Method">
                <div className="flex w-full items-center justify-between rounded-xl border border-[#cedcf0] bg-white p-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                    <span className="size-4 rounded-full border-[5px] border-[#087ce1]" aria-hidden="true" />
                    Stripe checkout
                  </span>
                  <CreditCard size={18} className="text-[#635bff]" aria-hidden="true" />
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-[#cedcf0] bg-[#eaf4ff] p-3 shadow-sm">
                  <span className="text-sm font-bold text-[#0e1224]">Total due</span>
                  <output className="text-xl font-bold text-[#0e1224]" aria-live="polite">
                    {formatCurrency(summary.amountDue, summary.currency)}
                  </output>
                </div>
              </SummarySection>

              <button
                type="button"
                onClick={completePurchase}
                disabled={!summary.selectedItems.length || checkoutMutation.isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0073df] px-3 text-sm font-semibold text-white transition hover:bg-[#0065c5] disabled:cursor-not-allowed disabled:bg-[#aebdce] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2"
              >
                {checkoutMutation.isPending
                  ? "Opening secure checkout..."
                  : "Continue to checkout"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              {apiSummary?.appliedDiscountPercent ? (
                <div className="rounded-xl border border-[#d8efe3] bg-[#f5fcf8] p-3">
                  <div className="flex items-start gap-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#dcf7ea] text-[#078654]">
                      <Percent size={14} aria-hidden="true" />
                    </span>
                    <p className="pt-1 text-xs font-semibold leading-5 text-[#246443]">
                      Your active membership discount is included in the pricing above.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-[#fde7b5] bg-[#fffaf0] p-3">
                  <div className="flex items-start gap-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#fff0bd] text-[#b7791f]">
                      <Crown size={15} aria-hidden="true" />
                    </span>
                    <p className="pt-1 text-xs font-semibold leading-5 text-[#6b572e]">
                      Membership plans can add automatic discounts to eligible lead purchases.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

const calculateSummary = (
  items: CartItem[],
  selectedIds: string[],
  useCredit: boolean,
  apiSummary?: CartSummary,
) => {
  const selectedItems = items.filter(
    (item) => item.available && selectedIds.includes(item.cartItemId),
  );
  const availableItemCount = items.filter((item) => item.available).length;
  const allAvailableSelected =
    availableItemCount > 0 && availableItemCount === selectedItems.length;
  const currency = apiSummary?.currency || selectedItems[0]?.currency || "USD";
  const useServerTotals = Boolean(apiSummary && allAvailableSelected);
  const subtotal = useServerTotals
    ? toAmount(apiSummary?.subtotal)
    : selectedItems.reduce((total, item) => total + toAmount(item.originalPrice), 0);
  const discount = useServerTotals
    ? toAmount(apiSummary?.discount)
    : selectedItems.reduce((total, item) => total + toAmount(item.discount), 0);
  const totalBeforeCredit = useServerTotals
    ? toAmount(apiSummary?.total)
    : selectedItems.reduce((total, item) => total + toAmount(item.finalPrice), 0);
  const walletBalance = toAmount(apiSummary?.walletBalance);
  const credit = useCredit ? Math.min(walletBalance, totalBeforeCredit) : 0;

  return {
    selectedItems,
    totalQuantity: selectedItems.length,
    sharedQuantity: selectedItems.filter((item) => item.priceType === "SHARED").length,
    exclusiveQuantity: selectedItems.filter((item) => item.priceType === "EXCLUSIVE").length,
    subtotal,
    discount,
    walletBalance,
    credit,
    amountDue: Math.max(0, totalBeforeCredit - credit),
    currency,
    subscriptionName: apiSummary?.subscriptionName,
  };
};

const CartLoadingState = () => (
  <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1280px] animate-pulse">
      <div className="h-7 w-24 rounded bg-[#e6edf5]" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-[#e6edf5]" />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-[#edf2f7] bg-white p-4">
          <div className="h-12 rounded-xl bg-[#f1f5f9]" />
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="mt-3 h-14 rounded-xl bg-[#f8fafc]" />
          ))}
        </section>
        <aside className="rounded-2xl border border-[#edf2f7] bg-white p-5">
          <div className="h-7 w-44 rounded bg-[#e6edf5]" />
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="mt-5 h-5 rounded bg-[#f1f5f9]" />
          ))}
          <div className="mt-8 h-12 rounded-xl bg-[#dceafb]" />
        </aside>
      </div>
    </div>
  </main>
);

const CartMessageState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  error,
}: {
  icon: typeof ShoppingCart;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  error?: boolean;
}) => (
  <main className="grid min-h-[calc(100vh-75px)] min-w-0 flex-1 place-items-center bg-[#f6f9fd] px-4 py-10">
    <section className="w-full max-w-lg rounded-3xl border border-[#e1eaf3] bg-white p-7 text-center shadow-[0_16px_40px_rgba(31,61,96,0.08)] sm:p-10">
      <span
        className={
          "mx-auto grid size-16 place-items-center rounded-full " +
          (error ? "bg-[#fff0f1] text-[#d92d20]" : "bg-[#eaf4ff] text-[#087ce7]")
        }
      >
        <Icon size={30} strokeWidth={1.7} />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-[#17212e]">{title}</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#667085]">{description}</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#104170] px-5 text-sm font-semibold text-white transition hover:bg-[#0b3b65]"
          >
            {actionLabel} <ArrowRight size={17} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#104170] px-5 text-sm font-semibold text-white transition hover:bg-[#0b3b65]"
          >
            <RefreshCw size={17} /> {actionLabel}
          </button>
        )}
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#b9ccdd] px-5 text-sm font-semibold text-[#104170] transition hover:bg-[#f4f8ff]"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </section>
  </main>
);

const SummarySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h3 className="text-base font-semibold text-[#0f1839]">{title}</h3>
    <div className="mt-3 space-y-3 px-0.5">{children}</div>
  </section>
);

const SummaryRow = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-[#878a9b]">{label}</span>
    <span className={"shrink-0 font-medium " + (accent ? "text-[#078654]" : "text-[#111827]")}>
      {value}
    </span>
  </div>
);

export default CartContainer;
