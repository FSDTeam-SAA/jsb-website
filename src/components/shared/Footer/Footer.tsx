"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

type FooterGroup = {
  title: string;
  links: string[];
  hrefs?: string[];
};

type Category = {
  id: string;
  name: string;
};

const getCategories = () => apiRequest<Category[]>("/categories");

const footerGroups: FooterGroup[] = [
  {
    title: "Company",
    links: ["Home", "How It Works", "Pricing", "FAQ"],
    hrefs: ["/", "#how-it-works", "#pricing", "#faq"],
  },
  {
    title: "Account",
    links: ["Login", "Create Free Account"],
    hrefs: ["/login", "/sign-up"],
  },
];

const LeadTypesSkeleton = () => (
  <ul aria-label="Loading lead types" className="mt-3 space-y-3">
    {Array.from({ length: 5 }, (_, index) => (
      <li key={index} aria-hidden="true" className="h-3 w-24 animate-pulse rounded bg-[#e8edf4]" />
    ))}
  </ul>
);

const LeadTypesError = ({ retry }: { retry: () => void }) => (
  <div role="alert" className="mt-3 max-w-[150px] rounded-md border border-[#f1c5c5] bg-[#fff7f7] p-3">
    <p className="text-xs leading-snug text-[#8c311e]">Lead types could not be loaded.</p>
    <button
      type="button"
      onClick={retry}
      className="mt-2 text-xs font-bold text-[#104170] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d]"
    >
      Try again
    </button>
  </div>
);

const LeadTypesNotFound = () => (
  <div className="mt-3 max-w-[150px] rounded-md border border-dashed border-[#b7c9dc] bg-[#f7fbff] p-3">
    <p className="text-xs leading-snug text-[#38526e]">No lead types are available right now.</p>
  </div>
);

const Footer = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });
  const categories = categoriesQuery.data?.data ?? [];

  return (
    <footer className="bg-white text-black">
      <div className="container mx-auto px-4 pt-9 pb-8 lg:min-h-[318px] lg:px-0 lg:pb-0 lg:pt-10">
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 lg:flex lg:items-start lg:justify-between lg:gap-0">
          <section className="col-span-3 max-w-none lg:col-span-1 lg:max-w-[230px]">
            <Link href="/" aria-label="Foreclosure Gold home" className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2">
              <Image src="/images/footer_logo.png" alt="Foreclosure Gold" width={1092} height={280} className="h-auto w-[273px] lg:w-[228px]" />
            </Link>
            <p className="mt-4 text-base font-medium leading-none text-black lg:mt-2 lg:text-xs">Online marketplace for real estate leads.</p>
          </section>

          <nav aria-label="Lead Types">
            <h2 className="text-base font-bold leading-none tracking-[-0.035em] text-[#104170] lg:text-xl lg:font-medium">Lead Types</h2>
            {categoriesQuery.isLoading && <LeadTypesSkeleton />}
            {categoriesQuery.isError && <LeadTypesError retry={() => categoriesQuery.refetch()} />}
            {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 && <LeadTypesNotFound />}
            {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length > 0 && (
              <ul className="mt-3 space-y-3">
                {categories.map((category) => (
                  <li key={category.id} className="leading-none">
                    <Link
                      href="#lead-types"
                      className="text-xs font-medium leading-none text-black transition hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-base font-bold leading-none tracking-[-0.035em] text-[#104170] lg:text-xl lg:font-medium">{group.title}</h2>
              <ul className="mt-3 space-y-3">
                {group.links.map((link, index) => (
                  <li key={link} className="leading-none">
                    <Link
                      href={group.hrefs?.[index] ?? "#lead-types"}
                      className="text-xs font-medium leading-none text-black transition hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <section className="col-span-3 pt-2 text-center lg:col-span-1 lg:pt-0 lg:text-left">
            <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.045em] text-[#104170] lg:max-w-[245px] lg:text-[32px]">
              Ready to find<span className="hidden lg:inline"><br /></span><span className="lg:hidden"> </span>your next lead?
            </h2>
            <Link
              href="/sign-up"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[8px] bg-[linear-gradient(270deg,#05976a_0%,#0eb57e_100%)] px-3 text-base font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104a7d] focus-visible:ring-offset-2 lg:mt-8 lg:h-10 lg:px-4 lg:text-xs"
            >
              Create Free Account
            </Link>
          </section>
        </div>
      </div>

      <div className=" bg-[#104a7d] text-white ">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 px-16 py-3 text-sm font-medium sm:flex-row sm:justify-center lg:min-h-[35px] lg:px-0 lg:py-0 lg:text-[11px]">
          <p className="whitespace-nowrap text-center text-[15px]">© 2026 Foreclosure Gold. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <Link href="/privacy-policy" className="transition hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Privacy Policy</Link>
            <span aria-hidden="true">|</span>
            <Link href="/terms-and-conditions" className="transition hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
