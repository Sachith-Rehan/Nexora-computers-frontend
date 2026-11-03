
import { useState } from "react";
import {
  IoArrowForwardOutline,
  IoCallOutline,
  IoCheckmarkCircleOutline,
  IoChevronDownOutline,
  IoLocationOutline,
  IoMailOutline,
  IoSendOutline,
  IoTimeOutline,
  IoChatbubbleEllipsesOutline,
  IoHeadsetOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import StoreLocation from "../components/storeLocation";

const contactDetails = {
  email: "sachithrehan578@gmail.com",
  phone: "+94 776346955",
  address: "I computers, Matara, Sri Lanka",
  hours: "Monday – Saturday, 9 AM – 6 PM",
};

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Contact our support team with your order number, and we'll help you check the latest status of your purchase.",
  },
  {
    question: "Can I get help choosing a computer?",
    answer:
      "Absolutely. Tell us your budget, preferred specifications, and how you plan to use your computer. Our team can help you explore suitable options.",
  },
  {
    question: "Do you offer warranty support?",
    answer:
      "You can contact us about warranty-related questions. Please include your product details and purchase information so our team can assist you.",
  },
  {
    question: "Can I ask about product availability?",
    answer:
      "Yes! Send us the name or model of the product you're interested in, and our team can help you check its availability.",
  },
];

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactInfoCard({
  icon: Icon,
  title,
  value,
  description,
  href,
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.08] bg-[#111318] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-[#161a23] hover:shadow-[0_12px_40px_rgba(37,99,235,0.08)] sm:p-6">
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/10 text-xl text-blue-400 transition-all duration-300 group-hover:border-blue-500/40 group-hover:bg-blue-500 group-hover:text-white">
        <Icon />
      </div>

      <h3 className="text-sm font-medium text-zinc-400">
        {title}
      </h3>

      {href ? (
        <a
          href={href}
          className="mt-2 block break-all text-base font-semibold text-white transition-colors hover:text-blue-400"
        >
          {value}
        </a>
      ) : (
        <p className="mt-2 break-words text-base font-semibold text-white">
          {value}
        </p>
      )}

      <p className="mt-3 text-xs leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function FormField({ id, label, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 block text-sm font-medium text-zinc-300"
      >
        {label}
        <span className="ml-1 text-blue-400">*</span>
      </label>
      {children}
    </div>
  );
}

export default function ContactUsPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const inputStyle =
    "w-full rounded-xl border border-white/10 bg-[#0d0f14] px-4 py-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-zinc-600 hover:border-white/20 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status) setStatus("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, subject, message } = form;

    if (
      ![name, email, subject, message].every(
        (value) => value.trim()
      )
    ) {
      setStatus("Please complete all required fields.");
      return;
    }

    const emailSubject = encodeURIComponent(
      `[iComputers Contact] ${subject}`
    );

    const emailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:${contactDetails.email}` +
      `?subject=${emailSubject}&body=${emailBody}`;

    setStatus(
      "Your email application should open with your message ready to send."
    );
  };

  return (
    <main className="min-h-screen bg-[#09090b] font-sans text-white selection:bg-blue-500/40">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute -right-32 -top-52 h-[520px] w-[520px] rounded-full bg-blue-600/[0.09] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-52 -left-40 h-[420px] w-[420px] rounded-full bg-indigo-600/[0.07] blur-[110px]" />

        <div className="page-wrapper relative pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pt-28">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.07] px-3.5 py-2 text-xs font-medium tracking-wider text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
            HERE TO HELP
          </div>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                Let's get{" "}
                <span className="text-blue-400">
                  connected.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">
                Questions about your next PC build, an order,
                or a product? Our team is here to make tech easier.
              </p>
            </div>

            <a
              href="#contact-form"
              className="inline-flex w-fit shrink-0 items-center gap-3 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_8px_30px_rgba(37,99,235,0.25)]"
            >
              Send a message
              <IoArrowForwardOutline className="text-lg" />
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS SECTION */}
      <section className="py-16 sm:py-20">
        <div className="page-wrapper">

          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                GET IN TOUCH
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Reach us your way.
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-zinc-500">
              Pick a contact option below, or fill in the
              message form to tell us what you need.
            </p>
          </div>

          {/* CONTACT CARDS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ContactInfoCard
              icon={IoMailOutline}
              title="Email us"
              value={contactDetails.email}
              description="Send us your questions anytime."
              href={`mailto:${contactDetails.email}`}
            />

            <ContactInfoCard
              icon={IoCallOutline}
              title="Call us"
              value={contactDetails.phone}
              description="Talk directly with our team."
              href="tel:+94776346955"
            />

            <ContactInfoCard
              icon={IoLocationOutline}
              title="Visit our store"
              value={contactDetails.address}
              description="Click to view our location on Google Maps."
              href="https://maps.app.goo.gl/dq8vPqsmbGNvZon5A"
            />

            <ContactInfoCard
              icon={IoTimeOutline}
              title="Working hours"
              value={contactDetails.hours}
              description="Our regular support hours."
            />
          </div>

          {/* CONTACT FORM & SUPPORT PANEL */}
          <div
            id="contact-form"
            className="mt-12 grid scroll-mt-8 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#111318] lg:grid-cols-[1.25fr_0.75fr]"
          >

            {/* LEFT SIDE - FORM */}
            <div className="p-6 sm:p-10 lg:p-12">

              <div className="mb-9">
                <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-500/15 bg-blue-500/10 px-3 py-2 text-xs font-semibold tracking-wider text-blue-400">
                  <IoChatbubbleEllipsesOutline className="text-base" />
                  SEND A MESSAGE
                </div>

                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  How can we help?
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-400">
                  Tell us a little about your question and
                  we'll be happy to help.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* NAME & EMAIL */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    id="contact-name"
                    label="Full name"
                  >
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputStyle}
                    />
                  </FormField>

                  <FormField
                    id="contact-email"
                    label="Email address"
                  >
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputStyle}
                    />
                  </FormField>
                </div>

                {/* SUBJECT */}
                <FormField
                  id="contact-subject"
                  label="Subject"
                >
                  <div className="relative">
                    <select
                      id="contact-subject"
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      className={`${inputStyle} appearance-none pr-12 ${
                        !form.subject
                          ? "text-zinc-500"
                          : ""
                      }`}
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option value="Product Inquiry">
                        Product inquiry
                      </option>
                      <option value="Order Support">
                        Order support
                      </option>
                      <option value="Technical Support">
                        Technical support
                      </option>
                      <option value="Warranty Inquiry">
                        Warranty inquiry
                      </option>
                      <option value="Business Inquiry">
                        Business inquiry
                      </option>
                      <option value="Other">
                        Other
                      </option>
                    </select>

                    <IoChevronDownOutline className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                </FormField>

                {/* MESSAGE */}
                <FormField
                  id="contact-message"
                  label="Your message"
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    maxLength={3000}
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={`${inputStyle} resize-y`}
                  />

                  <p className="mt-2 text-right text-xs text-zinc-600">
                    {form.message.length} / 3000
                  </p>
                </FormField>

                {/* STATUS MESSAGE */}
                {status && (
                  <div
                    role="status"
                    className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300"
                  >
                    {status}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_8px_30px_rgba(37,99,235,0.22)] active:scale-[0.99] sm:w-auto"
                >
                  <IoSendOutline className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Prepare Email
                  <IoArrowForwardOutline className="text-lg" />
                </button>

                <p className="text-xs leading-6 text-zinc-500">
                  This opens your email application with
                  your message ready to send.
                </p>

              </form>
            </div>

            {/* RIGHT SIDE - SUPPORT INFORMATION */}
            <aside className="relative flex flex-col justify-between overflow-hidden border-t border-white/[0.08] bg-[#0d1019] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">

              <div className="pointer-events-none absolute -right-36 -top-24 h-96 w-96 rounded-full bg-blue-600/[0.12] blur-[85px]" />

              <div className="relative">

                <div className="mb-9 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-3xl text-blue-400">
                  <IoHeadsetOutline />
                </div>

                <h3 className="text-3xl font-semibold leading-tight tracking-tight">
                  Good technology.
                  <br />
                  <span className="text-blue-400">
                    Great support.
                  </span>
                </h3>

                <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
                  At iComputers, your experience matters
                  long after you've picked your next piece
                  of tech. We're here when you need us.
                </p>

                <div className="my-10 h-px bg-white/10" />

                {/* SUPPORT FEATURES */}
                <div className="space-y-8">
                  {[
                    {
                      Icon: IoCheckmarkCircleOutline,
                      title: "Product guidance",
                      body:
                        "Choose the right technology for your needs and budget.",
                    },
                    {
                      Icon: IoShieldCheckmarkOutline,
                      title: "Purchase assistance",
                      body:
                        "Ask about orders, product information, and warranty questions.",
                    },
                    {
                      Icon: IoChatbubbleEllipsesOutline,
                      title: "Friendly communication",
                      body:
                        "Helpful answers and clear guidance from our team.",
                    },
                  ].map(({ Icon, title, body }) => (
                    <div
                      key={title}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xl text-blue-400">
                        <Icon />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {title}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-zinc-500">
                          {body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-16 border-t border-white/10 pt-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-blue-400">
                  iCOMPUTERS
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Your technology journey starts here.
                </p>
              </div>

            </aside>
          </div>
        </div>
      </section>

      <StoreLocation/>

      {/* FAQ SECTION */}
      <section className="border-t border-white/[0.06] bg-[#0d0f13] py-20 lg:py-24">

        <div className="page-wrapper grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

          {/* FAQ INTRO */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              NEED TO KNOW
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked
              <br />
              questions.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
              Quick answers to some common questions
              about shopping with iComputers.
            </p>

            <a
              href="#contact-form"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition-all hover:gap-3 hover:text-blue-300"
            >
              Still have questions?
              <IoArrowForwardOutline />
            </a>
          </div>

          {/* FAQ ACCORDION */}
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq, index) => (
              <div key={faq.question}>
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq(
                      openFaq === index ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between gap-5 py-6 text-left transition-colors hover:text-blue-400"
                >
                  <span className="text-sm font-medium sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                      openFaq === index
                        ? "rotate-180 bg-blue-600 text-white"
                        : "border border-white/10 bg-white/5 text-zinc-400"
                    }`}
                  >
                    <IoChevronDownOutline />
                  </span>
                </button>

                {openFaq === index && (
                  <p className="max-w-xl pb-6 pr-8 text-sm leading-7 text-zinc-400">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="page-wrapper py-16">

        <div className="relative flex flex-col items-start justify-between gap-7 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-[#111a30] to-[#111318] p-8 sm:p-12 md:flex-row md:items-center">

          <div className="pointer-events-none absolute -right-24 -top-44 h-80 w-80 rounded-full bg-blue-500/15 blur-[65px]" />

          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready for your next upgrade?
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Explore technology built for the way
              you work and play.
            </p>
          </div>

          <a
            href="/products"
            className="relative inline-flex shrink-0 items-center gap-3 rounded-xl border border-white/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#101219] transition-colors hover:bg-blue-100"
          >
            Explore Products
            <IoArrowForwardOutline className="text-lg" />
          </a>

        </div>
      </section>

    </main>
  );
}


