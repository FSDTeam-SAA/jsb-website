"use client";

import { useMutation } from "@tanstack/react-query";
import { Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { sendPublicContactMessage } from "@/lib/auth-api";
import MarketingPageHero from "../../_components/marketing-page-hero";
import { marketingStyles as styles } from "../../_components/marketing-styles";

const contactItems = [
  {
    icon: Phone,
    label: "Phone",
    value: "(949) 630-1858",
    description:
      "Speak directly with a lead specialist — no automated menus, no hold queues.",
    href: "tel:+19496301858",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@foreclosuregold.com",
    description: "We respond to all emails promptly during normal business hours.",
    href: "mailto:info@foreclosuregold.com",
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "438 Main Street, Suite 220, Huntington Beach, CA 92648",
    description:
      "Serving clients nationwide from our Huntington Beach, CA headquarters.",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday – Friday, 8am – 6pm PST",
    description: "Extended support available for active clients when needed.",
  },
];

const fieldClassName =
  "h-[43px] w-full rounded-[7px] border border-[#dde6f0] bg-white px-4 text-[15px] text-[#1c2a3a] outline-none placeholder:text-[#757575] focus:border-[#104170] focus:ring-2 focus:ring-[#104170]/15";

const fieldLabelClassName =
  "text-sm font-semibold text-[#104170]";

const ContactUsContainer = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const contactMutation = useMutation({
    mutationKey: ["contact-us", "send-message"],
    mutationFn: sendPublicContactMessage,
    onSuccess: (response) => {
      const message =
        response.message ||
        "Message sent successfully. Our specialist will be in touch shortly.";

      formRef.current?.reset();
      setSuccessMessage(message);
      toast.success(message);
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again.";

      setSuccessMessage(null);
      toast.error(message);
    },
  });

  const submitContactForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const interestedIn = String(formData.get("interestedIn") ?? "");

    setSuccessMessage(null);
    contactMutation.mutate({
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      phoneNumber: String(formData.get("phoneNumber") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      interestedIn,
      issueType: interestedIn,
      message: String(formData.get("message") ?? "").trim(),
    });
  };

  return (
    <main>
      <MarketingPageHero title="Contact Us" accent="Us" />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className="mx-auto max-w-[1240px]">
            <header className="flex flex-col items-center text-center">
              <p className={styles.label}>Get in Touch</p>
              <h2 className={`mt-3 ${styles.heading}`}>
                We&apos;d Love to Hear From You
              </h2>
              <p className={`mt-3 max-w-[580px] ${styles.body}`}>
                Call us, fill out the form, or send an email. Our team would
                love to speak with you and explore how Foreclosure Gold can
                help your business grow.
              </p>
            </header>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
              <section className="space-y-8" aria-label="Contact information">
                <div className="space-y-4">
                  {contactItems.map(
                    ({ icon: Icon, label, value, description, href }) => (
                      <article
                        key={label}
                        className={`flex gap-4 ${styles.card}`}
                      >
                        <span className={styles.icon}><Icon aria-hidden="true" size={22} /></span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-sm font-semibold text-[#104170]">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="mt-0.5 block break-words text-base font-bold leading-snug text-[#0f2c4f] transition hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="mt-0.5 break-words text-base font-bold leading-snug text-[#0f2c4f]">
                              {value}
                            </p>
                          )}
                          <p className={`mt-1 ${styles.body}`}>
                            {description}
                          </p>
                        </div>
                      </article>
                    ),
                  )}
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=438+Main+Street%2C+Suite+220%2C+Huntington+Beach%2C+CA+92648"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open the Huntington Beach headquarters in Google Maps (opens in a new tab)"
                  className="relative block aspect-[532/238] overflow-hidden rounded-[18px] border border-[#dde6f0] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2"
                >
                  <Image
                    src="/images/figma/contact-location-map.png"
                    alt=""
                    width={573}
                    height={280}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="absolute -left-[3.76%] -top-[7.14%] h-auto w-[107.71%] max-w-none"
                  />
                </a>
              </section>

              <form
                ref={formRef}
                onSubmit={submitContactForm}
                className={`min-w-0 ${styles.card}`}
              >
                <header>
                  <h2 className={styles.subheading}>
                    Send Us a Message
                  </h2>
                  <p className={`mt-2 ${styles.body}`}>
                    Fill out the form and a specialist will be in touch with you
                    shortly.
                  </p>
                </header>

                <fieldset disabled={contactMutation.isPending} className="mt-[17px]">
                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className={fieldLabelClassName}>
                        First Name <span aria-hidden="true">*</span>
                      </span>
                      <input
                        required
                        name="firstName"
                        type="text"
                        placeholder="John"
                        className={`mt-[7px] ${fieldClassName}`}
                      />
                    </label>
                    <label className="block">
                      <span className={fieldLabelClassName}>
                        Last Name <span aria-hidden="true">*</span>
                      </span>
                      <input
                        required
                        name="lastName"
                        type="text"
                        placeholder="Smith"
                        className={`mt-[7px] ${fieldClassName}`}
                      />
                    </label>
                  </div>

                <label className="block">
                  <span className={fieldLabelClassName}>
                    Phone Number <span aria-hidden="true">*</span>
                  </span>
                  <input
                    required
                    name="phoneNumber"
                    type="tel"
                    placeholder="(555) 000-0000"
                    className={`mt-[7px] ${fieldClassName}`}
                  />
                </label>

                <label className="mt-4 block">
                  <span className={fieldLabelClassName}>
                    Email Address <span aria-hidden="true">*</span>
                  </span>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`mt-[7px] ${fieldClassName}`}
                  />
                </label>

                <label className="mt-4 block">
                  <span className={fieldLabelClassName}>I&apos;m Interested In</span>
                  <select
                    required
                    name="interestedIn"
                    defaultValue=""
                    className={`mt-[7px] ${fieldClassName}`}
                  >
                    <option value="" disabled>
                      -- Select a Lead Type --
                    </option>
                    <option>Probate Leads</option>
                    <option>Debt Settlement</option>
                    <option>REO / Bank-Owned</option>
                    <option>Tax Lien Leads</option>
                    <option>Bankruptcy Leads</option>
                    <option>Mortgage Leads</option>
                    <option>Pre-Foreclosure</option>
                    <option>Foreclosure Leads</option>
                  </select>
                </label>

                <label className="mb-[22px] mt-4 block">
                  <span className={fieldLabelClassName}>
                    Message <span aria-hidden="true">*</span>
                  </span>
                  <textarea
                    required
                    name="message"
                    placeholder="Tell us about your business, target market, and monthly lead volume goals..."
                    className="mt-[7px] h-[130px] w-full resize-y rounded-[7px] border border-[#dde6f0] bg-white px-4 py-3 text-[15px] leading-5 text-[#1c2a3a] outline-none placeholder:text-[#757575] focus:border-[#104170] focus:ring-2 focus:ring-[#104170]/15"
                  />
                </label>

                </fieldset>

                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className={`w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${styles.primaryButton}`}
                >
                  {contactMutation.isPending && (
                    <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                  )}
                  {contactMutation.isPending ? "Sending Message..." : "Send Message"}
                </button>
                {successMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className="mt-3 rounded-[7px] border border-[#9bd6ba] bg-[#effaf3] px-3 py-2 text-center text-sm leading-5 text-[#146c43]"
                  >
                    {successMessage}
                  </p>
                )}
                <p className="mt-[10px] text-center text-sm leading-snug text-[#38526e]">
                  A member of our team will be in touch with you shortly during
                  normal business hours (Mon–Fri, 8am–6pm PST).
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUsContainer;
