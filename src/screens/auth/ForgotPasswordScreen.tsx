/**
 * POPCIX Forgot Password Screen
 * Supabase Password Reset Email Dispatch.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Mascot } from '../../components/common/Mascot';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';

interface ForgotPasswordScreenProps {
  onClose: () => void;
  onOpenSignIn: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onClose,
  onOpenSignIn,
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await resetPassword(email);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      triggerHaptic('error');
    } else {
      setIsSent(true);
      triggerHaptic('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#F8F8F5] rounded-t-[36px] sm:rounded-[36px] border border-[#EAEAE4] shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto animate-pop-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenSignIn();
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#EAEAE4] flex items-center justify-center hover:bg-[#F1F1ED]"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <span className="font-extrabold text-sm text-[#6B6B6B] tracking-wider">RESET PASSWORD</span>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <div className="flex flex-col items-center text-center mb-6">
            <Mascot mood="thinking" size={85} className="mb-2" />
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              Reset Your Password
            </h2>
            <p className="text-xs font-medium text-[#6B6B6B] mt-1 max-w-xs">
              Enter your registered email and we'll send a secure Supabase reset link.
            </p>
          </div>

          {isSent ? (
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-[#EAEAE4]">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-base font-bold text-[#111111] mb-1">Check Your Inbox</h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">
                We sent a secure password reset link to <span className="font-bold text-black">{email}</span>.
              </p>
              <Button variant="primary" size="md" fullWidth onClick={onOpenSignIn}>
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 mb-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-xs font-semibold text-[#B91C1C]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8E8E8E] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-white border border-[#DFDFD6] rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-[#111111] placeholder:text-[#9E9E9E] focus:outline-none focus:border-black transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
