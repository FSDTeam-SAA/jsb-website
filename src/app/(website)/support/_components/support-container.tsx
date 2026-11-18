"use client";

import { useMutation } from "@tanstack/react-query";
import { Clock3, Loader2, Mail, Phone, UserRound } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { submitPublicSupportRequest } from "@/lib/auth-api";

const contactDetails = [
  {
    icon: Clock3,
    label: "Response time",
    value: "Shortly During Business Hours",
  },
  {
    icon: Phone,
    label: "Direct support line",
    value: "(949) 630-1858",
  },
  {
    icon: Mail,
    label: "Email support",
    value: "support@foreclosuregold.com",
  },
  {
    icon: UserRound,
    label: "Hours",
    value: "Mon–Fri, 8am–6pm PST",
  },
];

const fieldClassName =
  "h-[46px] w-full rounded-[7px] border border-[#dde6f0] bg-white px-4 text-[15px] text-[#1c2a3a] outline-none placeholder:text-[#757575] focus:border-[#104170] focus:ring-2 focus:ring-[#104170]/15";

const fieldLabelClassName =
  "text-[13px] font-bold uppercase tracking-[0.8px] text-[#1c2a3a]";

const SupportContainer = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supportMutation = useMutation({
    mutationKey: ["contact-us", "support-request"],
    mutationFn: submitPublicSupportRequest,
    onSuccess: (response) => {
      const message =
        response.message ||
        "Support request submitted successfully. Our team will be in touch shortly.";

      formRef.current?.reset();
      setSuccessMessage(message);
      toast.success(message);
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't submit your support request. Please try again.";

      setSuccessMessage(null);
      toast.error(message);
    },
  });

  const submitSupportRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const describeYourIssue = String(
      formData.get("describeYourIssue") ?? "",
    ).trim();

    setSuccessMessage(null);
    supportMutation.mutate({
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phoneNumber: String(formData.get("phoneNumber") ?? "").trim(),
      issueType: String(formData.get("issueType") ?? ""),
      describeYourIssue,
      message: describeYourIssue,
    });
  };

  return (
    <main>
      <section className="bg-[linear-gradient(135deg,#0a2d52_0%,#104170_60%,#1a5a9e_100%)] pb-[50px] pt-[144px] text-white">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mx-auto max-w-[1240px] lg:px-6">
            <h1 className="font-barlow text-[40px] font-extrabold uppercase leading-none sm:text-[54px] sm:leading-[54px]">
              Client <span className="text-[#c8870a]">Support</span>
            </h1>
            <nav aria-label="Breadcrumb" className="mt-[14px] text-[13.5px]">
              <ol className="flex items-center gap-2 text-white/70">
                <li>Home</li>
                <li aria-hidden="true" className="text-white/30">
                  ›
                </li>
                <li aria-current="page" className="text-white/60">
                  Support
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 lg:py-8">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_324px] lg:gap-16">
            <form
              ref={formRef}
              onSubmit={submitSupportRequest}
              className="rounded-[14px] border border-[#dde6f0] bg-[#f4f7fb] p-5 sm:p-7 lg:px-[34px] lg:py-[38px]"
            >
              <header>
                <h2 className="text-[22px] font-bold uppercase leading-tight text-[#1c2a3a] lg:text-[28px]">
                  Submit a Support Request
                </h2>
                <p className="mt-[7px] max-w-[780px] text-[13px] leading-[1.6] text-[#4a5f74] lg:text-[14.5px] lg:leading-[23.2px]">
                  For the fastest resolution, please fill out the form below with
                  as much detail as possible. Our team takes pride in personal,
                  attentive service and will respond promptly.
                </p>
              </header>

              <fieldset disabled={supportMutation.isPending} className="mt-[17px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block pb-0 sm:pb-4">
                  <span className={fieldLabelClassName}>
                    First Name <span aria-hidden="true">*</span>
                  </span>
                  <input
                    required
                    name="firstName"
                    type="text"
                    placeholder="First Name"
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
                    placeholder="Last Name"
                    className={`mt-[7px] ${fieldClassName}`}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className={fieldLabelClassName}>
                  Email Address <span aria-hidden="true">*</span>
                </span>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className={`mt-[7px] ${fieldClassName}`}
                />
              </label>

              <label className="mt-4 block">
                <span className={fieldLabelClassName}>Phone Number</span>
                <input
                  required
                  name="phoneNumber"
                  type="tel"
                  placeholder="(555) 000-0000"
                  className={`mt-[7px] ${fieldClassName}`}
                />
              </label>

              <label className="mt-4 block">
                <span className={fieldLabelClassName}>Issue Type</span>
                <select
                  required
                  name="issueType"
                  defaultValue=""
                  className={`mt-[7px] ${fieldClassName}`}
                >
                  <option value="" disabled>
                    -- Select Issue Type --
                  </option>
                  <option>Account &amp; Billing</option>
                  <option>Lead Purchase</option>
                  <option>Technical Issue</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="mb-[22px] mt-4 block">
                <span className={fieldLabelClassName}>
                  Describe Your Issue <span aria-hidden="true">*</span>
                </span>
                <textarea
                  required
                  name="describeYourIssue"
                  placeholder="Please describe your issue in detail — the more specific you are, the faster we can resolve it."
                  className="mt-[7px] h-[130px] w-full resize-y rounded-[7px] border border-[#dde6f0] bg-white px-4 py-3 text-[15px] leading-5 text-[#1c2a3a] outline-none placeholder:text-[#757575] focus:border-[#104170] focus:ring-2 focus:ring-[#104170]/15"
                />
              </label>

              </fieldset>

              <button
                type="submit"
                disabled={supportMutation.isPending}
                className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#104170] px-4 text-[15px] font-bold uppercase tracking-[0.8px] text-white transition hover:bg-[#0b355d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#104170] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {supportMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}
                {supportMutation.isPending
                  ? "Submitting Request..."
                  : "Submit Support Request"}
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
              <p className="mt-3 text-center text-[11px] text-[#8ca1b7]">
                A member of our team will be in touch with you shortly during
                normal business hours (Mon–Fri, 8am–6pm PST).
              </p>
            </form>

            <aside className="space-y-4">
              <section className="rounded-[12px] border border-[#104170] bg-[#104170] px-6 py-7 text-white">
                <h2 className="text-[18px] font-bold uppercase">
                  Personal Quality Service
                </h2>
                <p className="mt-4 text-[14px] leading-5 text-white/75">
                  We pride ourselves on responding to every support request
                  quickly and personally. You will always speak with a real
                  human who knows your account.
                </p>

                <dl className="mt-5 space-y-2">
                  {contactDetails.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 pt-2">
                      <span className="grid size-[34px] shrink-0 place-items-center rounded-[6px] bg-white/[0.12] text-white">
                        <Icon aria-hidden="true" size={16} />
                      </span>
                      <div className="min-w-0 pb-px pt-0.5">
                        <dt className="text-[11px] uppercase leading-none tracking-[1px] text-white/50">
                          {label}
                        </dt>
                        <dd className="mt-1 text-[14px] font-bold leading-tight text-white">
                          {value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="rounded-[12px] border border-[#104170] bg-[#104170] px-6 py-7 text-white">
                <h2 className="border-b-2 border-[#c8870a] pb-[13px] text-[18px] font-bold uppercase">
                  Need Immediate Help?
                </h2>
                <p className="mt-4 text-[14px] leading-5 text-white/75">
                  If your issue is urgent, call us directly. A team member is
                  standing by during all business hours.
                </p>
                <a
                  href="tel:+19496301858"
                  className="mt-4 inline-flex items-center gap-2 py-0.5 font-barlow text-[22px] font-extrabold text-[#c8870a] transition hover:text-[#ebb33e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Phone aria-hidden="true" size={18} />
                  (949) 630-1858
                </a>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SupportContainer;
