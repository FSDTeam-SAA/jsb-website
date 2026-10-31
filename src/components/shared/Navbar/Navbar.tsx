"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { getCurrentUserProfile, logoutUser } from "@/lib/auth-api";

const navigation = [
  { label: "HOME", href: "/" },
  { label: "HOW IT WORKS", href: "#how-it-works" },
  { label: "PRICING", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const accessToken = session?.user.accessToken;
  const profileQuery = useQuery({
    queryKey: ["user", "profile", accessToken],
    queryFn: () => getCurrentUserProfile(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });
  const user = profileQuery.data?.data ?? session?.user;
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";
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
    <header className="sticky top-0 z-50 -mb-[88px] h-[88px] lg:-mb-[66px] lg:h-[66px]">
      <div
        className={`pointer-events-auto absolute inset-x-0 top-0 transition-[background-color,box-shadow] duration-200 ${isScrolled ? "bg-white/95 shadow-[0_4px_18px_rgba(15,44,79,0.14)] backdrop-blur" : "bg-transparent"}`}
      >
        <div className="container mx-auto flex h-[88px] items-center justify-between px-4 lg:h-[66px] lg:px-0">
          <Link
            href="/"
            aria-label="Foreclosure Gold home"
            className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
          >
            <Image
              src="/images/sm_logo.png"
              alt="Foreclosure Gold"
              width={1092}
              height={280}
              priority
              className="h-[56px] w-[200px] lg:hidden"
            />
            <Image
              src="/images/figma/foreclosure-gold-logo.png"
              alt="Foreclosure Gold"
              width={198}
              height={42}
              priority
              className="hidden h-auto w-[122px] lg:block"
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-[12px] font-bold leading-none text-[#104170] transition hover:text-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <Link
                href="/dashboard/account"
                aria-label={`Open ${user?.firstName ?? "your"} profile`}
                className="flex size-[34px] items-center justify-center overflow-hidden rounded-full bg-[#104170] text-[12px] font-bold text-white transition hover:bg-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
              >
                {user?.photo ? (
                  // Backend photo URLs may originate from a configurable image host.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photo}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="size-full object-cover"
                  />
                ) : (
                  initials
                )}
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="inline-flex h-[34px] items-center justify-center rounded-[5px] bg-[#104170] px-3.5 text-[12px] font-bold text-white transition hover:bg-[#0d345a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-[34px] items-center justify-center rounded-[5px] border border-[#104170] px-3 text-[12px] font-bold text-[#104170] transition hover:bg-[#f4f8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
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
                aria-label={`Open ${user?.firstName ?? "your"} profile`}
                className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-[#104170] text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
              >
                {user?.photo ? (
                  // Backend photo URLs may originate from a configurable image host.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photo}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="size-full object-cover"
                  />
                ) : (
                  initials
                )}
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
              className="absolute inset-x-4 top-4 rounded-[10px] bg-white px-[18px] pb-[18px] pt-[22px] shadow-2xl"
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
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-[6px] px-[14px] text-[18px] font-bold leading-6 text-[#104170] transition hover:bg-[#f1f6fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]"
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
