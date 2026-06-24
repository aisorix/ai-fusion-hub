import React, { useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2, Shield, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  bn?: boolean;
}

const REASONS_EN = [
  "Too expensive",
  "Missing features I need",
  "Privacy concerns",
  "Found an alternative",
  "Just taking a break",
  "Other",
];
const REASONS_BN = [
  "অনেক ব্যয়বহুল",
  "প্রয়োজনীয় ফিচার নেই",
  "গোপনীয়তা নিয়ে উদ্বেগ",
  "বিকল্প পেয়েছি",
  "শুধু বিরতি নিচ্ছি",
  "অন্যান্য",
];

const DeleteAccountModal: React.FC<Props> = ({ open, onClose, bn = false }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const reasons = bn ? REASONS_BN : REASONS_EN;

  if (!open) return null;

  const close = () => {
    if (submitting) return;
    setStep(1);
    setReason("");
    setDetails("");
    onClose();
  };

  const confirmDelete = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("account-delete-request", {
        body: { reason: reason || "unspecified", details },
      });
      if (error) throw error;
      const date = (data as any)?.scheduled_purge_at
        ? new Date((data as any).scheduled_purge_at).toLocaleDateString()
        : "";
      toast.success(
        bn
          ? `অ্যাকাউন্ট ডিলিট শিডিউল হয়েছে। ${date} এ স্থায়ীভাবে মুছে যাবে।`
          : `Account scheduled for deletion${date ? ` on ${date}` : ""}. You can recover any time before then.`
      );
      await signOut();
      navigate("/");
      close();
    } catch (e: any) {
      toast.error(e?.message || (bn ? "অনুরোধ ব্যর্থ" : "Request failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const purgeDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2.5">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s === 3 ? 2 : 1) as 1 | 2 | 3)}
              disabled={submitting}
              className="w-8 h-8 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-destructive/15 text-destructive grid place-items-center">
              <Trash2 className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">
              {bn ? "অ্যাকাউন্ট মুছুন" : "Delete account"}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {bn ? `ধাপ ${step} / 3` : `Step ${step} of 3`}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          {step === 1 && (
            <>
              <p className="text-sm text-foreground/90">
                {bn ? "চলে যাওয়ার কারণটা জানতে চাই" : "Sorry to see you go — why are you leaving?"}
              </p>
              <div className="space-y-1.5">
                {reasons.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      reason === r
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">{r}</span>
                  </label>
                ))}
              </div>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value.slice(0, 1500))}
                placeholder={bn ? "আরও কিছু বলতে চান? (ঐচ্ছিক)" : "Anything else? (optional)"}
                rows={3}
                className="w-full text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Shield className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs text-foreground/90 leading-relaxed">
                  {bn ? (
                    <>
                      আপনার অ্যাকাউন্ট আগামী <strong>৩০ দিন</strong> পর্যন্ত পুনরুদ্ধারযোগ্য থাকবে।
                      এই সময়ের মধ্যে লগইন করে যেকোনো সময় <strong>একটি ক্লিকে</strong> অ্যাকাউন্ট ফিরিয়ে আনতে পারবেন।
                      <br />
                      <strong>{purgeDate}</strong> তারিখের পর সব ডেটা স্থায়ীভাবে মুছে যাবে এবং ফেরানো যাবে না।
                    </>
                  ) : (
                    <>
                      Your account will stay recoverable for the next <strong>30 days</strong>.
                      Sign back in any time before then to restore everything with one click.
                      <br />
                      After <strong>{purgeDate}</strong>, all your data is permanently deleted and cannot be recovered.
                    </>
                  )}
                </div>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1.5 px-1">
                <li>• {bn ? "চ্যাট, প্রজেক্ট, ছবি, ভিডিও — সব মুছে যাবে।" : "Chats, projects, images, and videos will be removed."}</li>
                <li>• {bn ? "সাবস্ক্রিপশন বাতিল হবে, কোনো রিফান্ড স্বয়ংক্রিয় নয়।" : "Subscription will be cancelled. Refunds are not automatic."}</li>
                <li>• {bn ? "একই ইমেইলে আবার সাইন-আপ করতে পারবেন।" : "You can sign up again later with the same email."}</li>
              </ul>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-foreground/90">
                  {bn
                    ? "আপনি কি সত্যিই অ্যাকাউন্ট ডিলিট করতে চান?"
                    : "Are you sure you want to delete your account?"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {bn
                  ? "নিশ্চিত করলে আপনাকে সাইন-আউট করা হবে এবং ৩০ দিনের রিকভারি উইন্ডো শুরু হবে।"
                  : "Confirming will sign you out and start the 30-day recovery window."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-end gap-2">
          <button
            onClick={close}
            disabled={submitting}
            className="px-3.5 py-2 text-sm rounded-lg hover:bg-muted text-muted-foreground"
          >
            {bn ? "বাতিল" : "Cancel"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              disabled={step === 1 && !reason}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-foreground text-background hover:opacity-90 disabled:opacity-40"
            >
              {bn ? "পরবর্তী" : "Continue"}
            </button>
          ) : (
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {bn ? "অ্যাকাউন্ট মুছুন" : "Delete account"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
