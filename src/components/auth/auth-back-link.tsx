import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type AuthBackLinkProps = {
  href: string;
  label: string;
};

const AuthBackLink = ({ href, label }: AuthBackLinkProps) => (
  <Link
    href={href}
    className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#104170] transition-colors hover:bg-[#edf6ff] hover:text-[#063f73] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087ce7] focus-visible:ring-offset-2"
  >
    <ArrowLeft aria-hidden="true" size={18} strokeWidth={2} />
    {label}
  </Link>
);

export default AuthBackLink;
