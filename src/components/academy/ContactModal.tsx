import { useState } from "react";
import { X, Send } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const SUPPORT_EMAIL = "support@aisorix.com";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a little more (10+ chars)").max(2000),
  extra: z.string().trim().max(500).optional(),
});

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  subjectPrefix: string; // e.g. "Enroll: Prompt Engineering Foundations"
  extraLabel?: string; // optional extra field label
}

export default function ContactModal({
  open,
  onClose,
  title,
  subtitle,
  subjectPrefix,
  extraLabel,
}: ContactModalProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "", extra: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const subject = `[SorixLab] ${subjectPrefix}`;
    const body = [
      `Name: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      extraLabel && parsed.data.extra ? `${extraLabel}: ${parsed.data.extra}` : null,
      ``,
      `Message:`,
      parsed.data.message,
    ]
      .filter(Boolean)
      .join("\n");
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    toast.success("Opening your email client — send the prefilled message and we'll reply within 24 hours.");
    setForm({ name: "", email: "", message: "", extra: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full sm:max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl font-bold text-foreground tracking-tight">{title}</h3>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground"
              placeholder="Your name"
              maxLength={100}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground"
              placeholder="you@company.com"
              maxLength={255}
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          {extraLabel && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">{extraLabel}</label>
              <input
                type="text"
                value={form.extra}
                onChange={(e) => setForm({ ...form, extra: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground"
                placeholder={extraLabel}
                maxLength={500}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground resize-none"
              placeholder="Tell us about your goals, team size, timeline..."
              maxLength={2000}
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4" />
            Send to AI Sorix Team
          </button>
          <p className="text-xs text-muted-foreground text-center">
            We reply within 24 hours, weekdays. Or email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline">{SUPPORT_EMAIL}</a> directly.
          </p>
        </form>
      </div>
    </div>
  );
}
