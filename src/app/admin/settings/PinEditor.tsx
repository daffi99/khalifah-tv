"use client";

import { useState } from "react";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { updateAdminPin } from "./actions";

export function PinEditor() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("pin", pin);

    const result = await updateAdminPin(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setPin("");
    }
    
    setLoading(false);
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="h-5 w-5 text-primary" />
          Admin PIN Security
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Set a 4-digit PIN to secure this dashboard from unauthorized access. The default is 0000.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            value={pin}
            onChange={(e) => setPin(e.target.value.slice(0, 4))}
            placeholder="New 4-digit PIN"
            className="flex-1 bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="bg-primary text-primary-foreground px-6 rounded-xl font-semibold flex items-center justify-center disabled:opacity-50 transition-active"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p>Admin PIN updated successfully!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
