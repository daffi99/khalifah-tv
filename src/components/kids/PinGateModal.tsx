"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Delete } from "lucide-react";
import { toast } from "sonner";

interface PinGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CORRECT_PIN = "1234"; // Hardcoded for now, can be moved to DB/settings later

export function PinGateModal({ isOpen, onClose }: PinGateModalProps) {
  const router = useRouter();
  const [pin, setPin] = useState("");

  if (!isOpen) return null;

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          toast.success("Access granted");
          router.push("/admin");
        } else {
          toast.error("Incorrect PIN");
          setPin("");
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-foreground">Parent Area</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <p className="text-muted-foreground mb-6 text-center">
            Enter your 4-digit PIN to access settings
          </p>

          {/* PIN Indicators */}
          <div className="flex gap-4 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                  i < pin.length ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="aspect-square flex items-center justify-center text-2xl font-bold bg-secondary hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-95"
              >
                {num}
              </button>
            ))}
            <div /> {/* Empty slot for bottom left */}
            <button
              onClick={() => handleNumberClick("0")}
              className="aspect-square flex items-center justify-center text-2xl font-bold bg-secondary hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all active:scale-95"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="aspect-square flex items-center justify-center text-xl bg-secondary hover:bg-destructive hover:text-destructive-foreground rounded-2xl transition-all active:scale-95"
            >
              <Delete className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
