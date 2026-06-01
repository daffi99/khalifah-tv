"use client";

import { useState, useEffect } from "react";
import { loginWithPin } from "./actions";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setError("");
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError("");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("pin", pin);
    
    const result = await loginWithPin(formData);
    
    if (result?.error) {
      setError(result.error);
      setPin("");
      setLoading(false);
    }
  };



  // Auto-submit when 4 digits are entered
  useEffect(() => {
    if (pin.length === 4 && !loading && !error) {
      const submit = async () => {
        setLoading(true);
        setError("");
        
        const formData = new FormData();
        formData.append("pin", pin);
        
        const result = await loginWithPin(formData);
        
        if (result?.error) {
          setError(result.error);
          setPin("");
          setLoading(false);
        }
      };
      submit();
    }
  }, [pin, loading, error]);

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 selection:bg-primary/30">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden border border-border">
        <div className="p-8 pb-6 flex flex-col items-center bg-primary/5">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your 4-digit PIN to unlock the dashboard
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  pin.length > i 
                    ? "bg-primary scale-110" 
                    : "bg-muted border border-border"
                }`} 
              />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                disabled={loading}
                className="h-16 rounded-2xl bg-muted/50 hover:bg-muted text-2xl font-bold text-foreground transition-colors active:scale-95"
              >
                {num}
              </button>
            ))}
            <div className="h-16"></div>
            <button
              onClick={() => handleNumberClick("0")}
              disabled={loading}
              className="h-16 rounded-2xl bg-muted/50 hover:bg-muted text-2xl font-bold text-foreground transition-colors active:scale-95"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="h-16 rounded-2xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive text-lg font-bold text-foreground transition-colors active:scale-95 flex items-center justify-center"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
