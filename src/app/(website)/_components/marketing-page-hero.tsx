import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { marketingStyles as styles } from "./marketing-styles";

export default function MarketingPageHero({
  title,
  accent,
  parent,
}: {
  title: string;
  accent: string;
  parent?: { label: string; href: string };
}) {
  const plainTitle = title === accent ? "" : title.slice(0, -accent.length).trimEnd();

  return (
    <section className="rounded-b-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#dbeaf8_55%,#b9d6ee_100%)] pb-9 pt-28 lg:pb-14 lg:pt-28">
      <div className={styles.container}>
        <h1 className="text-balance text-3xl font-bold leading-[1.1] text-[#0f2c4f] sm:text-[40px] lg:text-[56px]">
          {plainTitle && `${plainTitle} `}
          <span className="text-[#057050]">{accent}</span>
        </h1>
        <nav aria-label="Breadcrumb" className="mt-4 text-sm text-[#38526e]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            {parent && (
              <li className="flex items-center gap-2">
                <ChevronRight aria-hidden="true" size={14} />
                <Link href={parent.href} className="hover:underline">{parent.label}</Link>
              </li>
            )}
            <li aria-current="page" className="flex items-center gap-2 font-medium">
              <ChevronRight aria-hidden="true" size={14} />
              {title}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
}
