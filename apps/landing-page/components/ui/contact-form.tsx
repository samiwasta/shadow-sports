"use client"

import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@workspace/ui/lib/utils"

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

const subjects = [
  { value: "", label: "Select a subject" },
  { value: "membership", label: "Membership & joining the club" },
  { value: "fixtures", label: "Match fixtures & scheduling" },
  { value: "training", label: "Training & net sessions" },
  { value: "events", label: "Club events & tournaments" },
  { value: "partnership", label: "Sponsorship & partnerships" },
  { value: "general", label: "General enquiry" },
]

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20"

const labelClass = "font-heading text-xs font-semibold tracking-[0.14em] text-zinc-400 uppercase"

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required"
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required"
    if (!form.email.trim()) {
      nextErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address"
    }
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required"
    } else if (!/^[+\d\s()-]{8,}$/.test(form.phone)) {
      nextErrors.phone = "Enter a valid phone number"
    }
    if (!form.subject) nextErrors.subject = "Please select a subject"
    if (!form.message.trim()) {
      nextErrors.message = "Message is required"
    } else if (form.message.trim().length < 20) {
      nextErrors.message = "Message should be at least 20 characters"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card variant="plus" className="border-zinc-800 bg-zinc-950/70">
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-5 flex size-16 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
            <CheckCircle2 className="size-8 text-blue-400" />
          </div>
          <p className="font-heading text-xs font-semibold tracking-[0.18em] text-blue-400 uppercase">
            Message received
          </p>
          <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-white uppercase md:text-3xl">
            We&apos;ll be in touch
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
            Thanks for reaching out to Shadow Sports. A club member will get back
            to you shortly about your enquiry.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false)
              setForm(initialState)
            }}
            className="font-heading mt-8 text-sm font-semibold tracking-wide text-blue-400 uppercase transition-colors hover:text-blue-300"
          >
            Send another message
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:pt-6"
      >
        <p className="font-heading text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
          Shadow Sports · Ratnagiri
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight text-white uppercase md:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
          Questions about membership, fixtures, or training? Drop us a line and
          we&apos;ll get back to you from the club.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Ratnagiri, Maharashtra</p>
              <p className="mt-1 text-xs text-zinc-500">Shadow Sports Cricket Club</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Mail className="mt-0.5 size-4 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">hello@shadowsports.club</p>
              <p className="mt-1 text-xs text-zinc-500">We reply within 1–2 days</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Phone className="mt-0.5 size-4 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">+91 98765 43210</p>
              <p className="mt-1 text-xs text-zinc-500">Match days & club enquiries</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        <Card variant="plus" className="border-zinc-800 bg-zinc-950/70">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="firstName"
                label="First name"
                error={errors.firstName}
              >
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(event) => updateField("firstName", event.target.value)}
                  placeholder="Your first name"
                  className={fieldClass}
                />
              </Field>

              <Field id="lastName" label="Last name" error={errors.lastName}>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(event) => updateField("lastName", event.target.value)}
                  placeholder="Your last name"
                  className={fieldClass}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="email" label="Email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </Field>

              <Field id="phone" label="Phone" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+91 98765 43210"
                  className={fieldClass}
                />
              </Field>
            </div>

            <Field id="subject" label="Subject" error={errors.subject}>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                className={cn(fieldClass, "appearance-none")}
              >
                {subjects.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-zinc-950 text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="message" label="Message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Tell us about your enquiry — membership, fixtures, training, or anything else."
                className={cn(fieldClass, "resize-none")}
              />
            </Field>

            <button
              type="submit"
              className="font-heading group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold tracking-widest text-black uppercase transition hover:bg-blue-50 sm:w-auto"
            >
              Send message
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  )
}
