/**
 * POPCIX Sign In Screen
 * Supabase Auth Email/Password Sign In & Google OAuth.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Mascot } from '../../components/common/Mascot';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';
import logoLightHoriz from '../../assets/branding/logo-light-horizontal.png';

interface SignInScreenProps {
  onClose: () => void;
  onOpenSignUp: () => void;
  onOpenForgotPassword: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onClose,
  onOpenSignUp,
  onOpenForgotPassword,
}) => {
  const { signInWithEmail, signInWithGoogle, isDemoMode, toggleDemoMode } = useAuth();
  const [email, setEmail] = useState<string>('aarav.sharma@popcix.app');
  const [password, setPassword] = useState<string>('popcix1234');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const res = await signInWithEmail(email, password);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      triggerHaptic('error');
    } else {
      triggerHaptic('success');
      onClose();
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    const res = await signInWithGoogle();
    if (res.error) {
      setErrorMessage(res.error);
    } else {
      onClose();
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
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#EAEAE4] flex items-center justify-center hover:bg-[#F1F1ED]"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <span className="font-extrabold text-sm text-[#6B6B6B] tracking-wider">POPCIX AUTH</span>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <div className="flex flex-col items-center text-center mb-6">
            <img
              src={logoLightHoriz}
              alt="POPCIX"
              className="h-9 object-contain mb-3"
            />
            <Mascot mood="happy" size={80} className="mb-2" />
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xs font-medium text-[#6B6B6B] mt-1">
              Sign in with your verified Supabase credentials
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl text-xs font-semibold text-[#B91C1C]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#111111]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenForgotPassword();
                  }}
                  className="text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8E8E] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-[1px] bg-[#DFDFD6]" />
            <span className="text-[11px] font-bold text-[#8E8E8E]">OR</span>
            <div className="flex-1 h-[1px] bg-[#DFDFD6]" />
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleGoogleSignIn}
            leftIcon={
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.7 0 3 .6 3.9 1.5l2.9-2.9C17 2 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.8C6.5 7.1 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.4C.7 9.8 0 12 0 14.5s.7 4.7 1.9 7.1l3.7-2.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 17C3.7 20.8 7.5 24 12 24z"
                />
              </svg>
            }
          >
            Continue with Google
          </Button>

          {/* Demo Mode Quick Guest Access */}
          <div className="mt-4 p-3 bg-white rounded-2xl border border-[#EAEAE4] text-center">
            <div className="flex items-center justify-between text-xs font-bold text-[#111111]">
              <span>Quick Demo Mode</span>
              <button
                type="button"
                onClick={() => {
                  toggleDemoMode(true);
                  onClose();
                }}
                className="text-[#7C3AED] hover:underline"
              >
                1-Tap Guest Access
              </button>
            </div>
          </div>

          {/* Footer Link to Sign Up */}
          <div className="text-center mt-5">
            <p className="text-xs text-[#6B6B6B] font-medium">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenSignUp();
                }}
                className="font-bold text-black underline underline-offset-4"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
