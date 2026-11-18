"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { sendPublicContactMessage } from "@/lib/auth-api";

const contactItems = [
  {
    icon: "📞",
    label: "Phone",
    value: "(949) 630-1858",
    description:
      "Speak directly with a lead specialist — no automated menus, no hold queues.",
    href: "tel:+19496301858",
    height: "lg:min-h-[116px]",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "info@foreclosuregold.com",
    description: "We respond to all emails promptly during normal business hours.",
    href: "mailto:info@foreclosuregold.com",
    height: "lg:min-h-[100px]",
  },
  {
    icon: "📍",
    label: "Headquarters",
    value: "438 Main Street, Suite 220, Huntington Beach, CA 92648",
    description:
      "Serving clients nationwide from our Huntington Beach, CA headquarters.",
    height: "lg:min-h-[100px]",
  },
  {
    icon: "🕐",
    label: "Business Hours",
    value: "Monday – Friday, 8am – 6pm PST",
    description: "Extended support available for active clients when needed.",
    height: "lg:min-h-[100px]",
  },
];

const fieldClassName =
  "h-[43px] w-full rounded-[7px] border border-[#dde6f0] bg-white px-4 text-[15px] text-[#1c2a3a] outline-none placeholder:text-[#757575] focus:border-[#104170] focus:ring-2 focus:ring-[#104170]/15";

const fieldLabelClassName =
  "text-[13px] font-bold uppercase tracking-[0.8px] text-[#1c2a3a]";

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
      <section className="bg-[linear-gradient(135deg,#0a2d52_0%,#104170_60%,#1a5a9e_100%)] pb-[50px] pt-[144px] text-white">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mx-auto max-w-[1240px] lg:px-6">
            <h1 className="font-barlow text-[40px] font-extrabold uppercase leading-none sm:text-[54px] sm:leading-[54px]">
              Contact <span className="text-[#c8870a]">Us</span>
            </h1>
            <nav aria-label="Breadcrumb" className="mt-[14px] text-[13.5px]">
              <ol className="flex items-center gap-2 text-white/70">
                <li>Home</li>
                <li aria-hidden="true" className="text-white/30">
                  ›
                </li>
                <li aria-current="page" className="text-white/60">
                  Contact Us
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="max-w-[1240px] lg:px-6">
            <header className="flex flex-col items-center pt-[6.5px] text-center">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="h-[3px] w-[26px] rounded-[2px] bg-[#c8870a]" />
                <p className="text-[11.5px] font-bold uppercase tracking-[2px] text-[#104170]">
                  Get in Touch
                </p>
              </div>
              <h2 className="mt-[13px] font-barlow text-[34px] font-extrabold uppercase leading-none text-[#1c2a3a] sm:text-[44px] sm:leading-[48.4px]">
                We&apos;d Love to <span className="text-[#104170]">Hear From You</span>
              </h2>
              <p className="mt-3 max-w-[580px] text-[14px] leading-6 text-[#4a5f74] sm:text-[16px] sm:leading-7">
                Call us, fill out the form, or send an email. Our team would
                love to speak with you and explore how Foreclosure Gold can
                help your business grow.
              </p>
            </header>

            <div className="mt-[52px] grid items-start gap-8 lg:grid-cols-[533px_603px] lg:gap-14">
              <section className="space-y-8" aria-label="Contact information">
                <div className="space-y-4">
                  {contactItems.map(
                    ({ icon, label, value, description, href, height }) => (
                      <article
                        key={label}
                        className={`flex gap-4 rounded-[10px] border-l-4 border-[#104170] bg-[#f4f7fb] px-[22px] py-5 ${height}`}
                      >
                        <span className="grid size-11 shrink-0 place-items-center rounded-[10px] bg-[#104170] text-xl">
                          {icon}
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[11.5px] font-bold uppercase tracking-[1.5px] text-[#8fa3b8]">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="mt-0.5 block text-[15.5px] font-bold leading-5 text-[#1c2a3a] transition hover:text-[#104170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170]"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="mt-0.5 text-[15.5px] font-bold leading-5 text-[#1c2a3a]">
                              {value}
                            </p>
                          )}
                          <p className="mt-0.5 text-[13.5px] leading-4 text-[#4a5f74]">
                            {description}
                          </p>
                        </div>
                      </article>
                    ),
                  )}
                </div>

                <div className="overflow-hidden rounded-[12px] border border-[#dde6f0] shadow-[0_4px_20px_rgba(16,65,112,0.1)]">
                  <Image
                    src="/images/figma/contact-location-map.png"
                    alt="Map showing the Foreclosure Gold Huntington Beach headquarters"
                    width={573}
                    height={280}
                    className="h-[240px] w-full object-cover"
                  />
                </div>
              </section>

              <form
                ref={formRef}
                onSubmit={submitContactForm}
                className="rounded-[14px] border border-[#dde6f0] bg-[#f4f7fb] p-5 sm:p-7 lg:px-[34px] lg:py-[38px]"
              >
                <header>
                  <h2 className="text-[22px] font-bold uppercase leading-tight text-[#1c2a3a] lg:text-[28px]">
                    Send Us a Message
                  </h2>
                  <p className="mt-[7px] text-[14.5px] leading-[23.2px] text-[#4a5f74]">
                    Fill out the form and a specialist will be in touch with you
                    shortly.
                  </p>
                </header>

                <fieldset disabled={contactMutation.isPending} className="mt-[17px]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block pb-0 sm:pb-4">
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
                    <label className="block pb-0 sm:pb-4">
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
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-[7px] bg-[#104170] px-4 text-[20px] font-bold uppercase tracking-[1px] text-white transition hover:bg-[#0b355d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
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
                <p className="mt-[10px] text-center text-[12.5px] leading-[14px] text-[#8fa3b8]">
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
