"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { logoutUser } from "@/lib/auth-api";
import { categoryHref, publicCategoriesQueryOptions } from "@/lib/public-categories";

const navigation = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "LEAD TYPES", href: "/lead-types" },
  { label: "CONTACT US", href: "/contact-us" },
];

const desktopLinkClass =
  "px-3 py-2 text-[12px] font-bold leading-none text-[#104170] transition hover:text-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2";
const mobileLinkClass =
  "flex min-h-11 items-center rounded-[6px] px-[14px] text-[18px] font-bold leading-6 text-[#104170] transition hover:bg-[#f1f6fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]";

function LeadTypesDropdown({
  pathname,
  mobile = false,
  onSelect,
}: {
  pathname: string;
  mobile?: boolean;
  onSelect?: () => void;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  const { data, isPending, isError, refetch } = useQuery(publicCategoriesQueryOptions);
  const isActive = pathname === "/lead-types" || pathname.startsWith("/lead-types/");

  useEffect(() => {
    if (mobile) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const dropdown = details.current;
      if (dropdown?.open && event.target instanceof Node && !dropdown.contains(event.target)) {
        dropdown.open = false;
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [mobile]);

  const close = () => {
    if (details.current) details.current.open = false;
  };
  const select = () => {
    close();
    onSelect?.();
  };

  return (
    <details
      ref={details}
      className="group relative"
      onBlur={(event) => {
        if (!mobile && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !details.current?.open) return;
        event.stopPropagation();
        close();
        trigger.current?.focus();
      }}
    >
      <summary
        ref={trigger}
        data-active={isActive || undefined}
        className={`flex cursor-pointer list-none items-center gap-1 whitespace-nowrap [&::-webkit-details-marker]:hidden ${
          mobile ? mobileLinkClass : desktopLinkClass
        } ${
          mobile ? "data-[active=true]:text-[20px]" : "data-[active=true]:text-[14px]"
        } data-[active=true]:font-extrabold`}
      >
        LEAD TYPES
        <ChevronDown aria-hidden="true" size={14} className="group-open:rotate-180" />
      </summary>
      <ul
        aria-label="Lead type categories"
        tabIndex={mobile ? undefined : 0}
        className={`space-y-1 rounded-lg border border-[#dde6f0] bg-white p-1.5 ${
          mobile
            ? "ml-3"
            : "absolute left-0 top-full max-h-[min(22rem,calc(100dvh-5rem))] min-w-52 overflow-y-auto overscroll-y-contain shadow-md [scrollbar-color:#8ba5c0_#f1f6fb] [scrollbar-gutter:stable] [scrollbar-width:thin] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]"
        }`}
      >
        <li>
          <Link
            href="/lead-types"
            aria-current={pathname === "/lead-types" ? "page" : undefined}
            onClick={select}
            className="block rounded px-3 py-2 text-sm font-bold text-[#104170] hover:bg-[#f1f6fb]"
          >
            All Lead Types
          </Link>
        </li>
        {data?.map((category) => {
          const href = categoryHref(category.id);

          return (
            <li key={category.id}>
              <Link
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={select}
                className="block rounded px-3 py-2 text-sm text-[#104170] hover:bg-[#f1f6fb] aria-[current=page]:bg-[#f1f6fb] aria-[current=page]:font-extrabold"
              >
                {category.name}
              </Link>
            </li>
          );
        })}
        {isPending && <li className="px-3 py-2 text-sm text-[#4a5f74]">Loading categories…</li>}
        {isError && (
          <li>
            <button type="button" onClick={() => void refetch()} className="w-full rounded px-3 py-2 text-left text-sm text-[#104170] hover:bg-[#f1f6fb]">
              Retry loading categories
            </button>
          </li>
        )}
        {data?.length === 0 && !isError && (
          <li className="px-3 py-2 text-sm text-[#4a5f74]">No categories available</li>
        )}
      </ul>
    </details>
  );
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const queryClient = useQueryClient();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsMenuOpen(false);

    try {
      await logoutUser();
    } catch {
      // Clear the frontend session even if the backend cookie is already absent.
    } finally {
      queryClient.clear();
      await signOut({ callbackUrl: "/" });
    }
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 -mb-[88px] h-[88px] lg:-mb-[66px] lg:h-[66px]"
    >
      <div
        className={`pointer-events-auto absolute inset-x-0 top-0 transition-[background-color,box-shadow] duration-200 ${
          isScrolled
            ? "bg-white/95 shadow-[0_4px_18px_rgba(15,44,79,0.14)] backdrop-blur"
            : isHomePage
              ? "bg-transparent"
              : "bg-white"
        }`}
      >
        <div
          className="container mx-auto flex h-[88px] items-center justify-between px-4 lg:px-0 lg:h-[66px]"
        >
          <Link
            href="/"
            aria-label="Foreclosure Gold home"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            <Image
              src="/images/footer_logo.png"
              alt="Foreclosure Gold"
              width={1092}
              height={280}
              sizes="(min-width: 1024px) 190px, (min-width: 477px) 200px, 42vw"
              priority
              className="h-auto w-[clamp(132px,42vw,200px)] lg:w-[190px]"
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex"
          >
            {navigation.map((item) => item.href === "/lead-types" ? (
              <LeadTypesDropdown key={`lead-types:${pathname}`} pathname={pathname} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`${desktopLinkClass} aria-[current=page]:text-[14px] aria-[current=page]:font-extrabold`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[5px] bg-[#104170] font-bold text-white transition hover:bg-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 h-[34px] px-3.5 text-[12px]"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center justify-center rounded-[5px] bg-[#104170] font-bold text-white transition hover:bg-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 h-[34px] px-3.5 text-[12px]"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-[5px] border border-[#104170] font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 h-[34px] px-3 text-[12px]"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              aria-controls="guest-mobile-navigation"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex size-9 items-center justify-center rounded-[4px] bg-[#104170] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
            >
              {isMenuOpen ? (
                <X aria-hidden="true" size={19} />
              ) : (
                <Menu aria-hidden="true" size={20} />
              )}
            </button>
            {isAuthenticated && (
              <Link
                href="/dashboard/account"
                className="inline-flex h-11 items-center justify-center rounded-[5px] bg-[#104170] px-3.5 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
              >
                My Account
              </Link>
            )}
          </div>

          <div
            id="guest-mobile-navigation"
            onClick={() => setIsMenuOpen(false)}
            className={`fixed inset-0 z-[60] bg-black/55 transition-opacity duration-200 lg:hidden ${
              isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <nav
              aria-label="Mobile navigation"
              aria-modal="true"
              role="dialog"
              onClick={(event) => event.stopPropagation()}
              className="absolute inset-x-4 top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[10px] bg-white px-[18px] pb-[18px] pt-[22px] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation menu"
                className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-[#104170] transition hover:bg-[#f1f6fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]"
              >
                <X aria-hidden="true" size={24} strokeWidth={2.5} />
              </button>
              <div className="flex flex-col gap-5 pt-9">
                {navigation.map((item) => item.href === "/lead-types" ? (
                  isMenuOpen && <LeadTypesDropdown key={`lead-types:${pathname}`} pathname={pathname} mobile onSelect={() => setIsMenuOpen(false)} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${mobileLinkClass} aria-[current=page]:text-[20px] aria-[current=page]:font-extrabold`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-5">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex h-11 items-center justify-center rounded-[9px] bg-[#104170] px-3 text-[18px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex h-14 items-center justify-center rounded-[9px] bg-[#104170] px-3 text-[18px] font-bold text-white"
                    >
                      Create Free Account
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex h-11 items-center justify-center rounded-[9px] border border-[#104170] px-3 text-[18px] font-bold text-[#104170]"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
