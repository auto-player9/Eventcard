"use client";

import { useState } from "react";
import { ArrowIcon } from "./Icons";
import { CONTACT_EMAIL, NEEDS } from "@/lib/site";

/**
 * Posts to /api/contact. If the server has no email delivery configured (or the request fails),
 * it falls back to opening the visitor's email app with the message filled in.
 */
export function ContactForm() {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const openMail = (d: FormData) => {
    const subject = "Project enquiry: " + d.get("need");
    const body =
      "Name: " + d.get("name") + "\nEmail: " + d.get("email") + "\nNeed: " + d.get("need") + "\n\n" + d.get("message");
    setNote(
      "Your email app should open with this message ready to send. If it doesn't, email us at " + CONTACT_EMAIL + "."
    );
    try {
      window.location.href =
        "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    } catch {
      /* some viewers block mailto links */
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setSending(true);
    setNote("Sending…");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(d)),
      });
      if (res.status === 501) {
        openMail(d);
        return;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      setNote("Thank you, your message was sent. We'll reply by email soon.");
    } catch {
      setNote("Sorry, the message could not be sent. Please email us at " + CONTACT_EMAIL + ".");
    } finally {
      setSending(false);
    }
  };

  return (
    <form id="contact-form" className="reveal" onSubmit={onSubmit}>
      <div className="row2">
        <label>
          Your name
          <input name="name" autoComplete="name" required placeholder="Full name" />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
        </label>
      </div>
      <label>
        What do you need?
        <select name="need" required defaultValue="">
          <option value="">Choose one</option>
          {NEEDS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <label>
        Tell us about the problem
        <textarea
          name="message"
          required
          placeholder="What's slowing your business down, and what would success look like?"
        />
      </label>
      <button className="btn btn-primary" type="submit" disabled={sending}>
        Send message <ArrowIcon />
      </button>
      <p className="form-note" role="status" aria-live="polite">
        {note}
      </p>
    </form>
  );
}
