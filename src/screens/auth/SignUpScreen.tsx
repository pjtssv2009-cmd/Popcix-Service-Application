/**
 * POPCIX Sign Up Screen
 * Supabase Auth Registration with Name, Email, Password.
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Mascot } from '../../components/common/Mascot';
import { Mail, Lock, User, AlertCircle, ArrowLeft, Gift } from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';
import logoLightHoriz from '../../assets/branding/logo-light-horizontal.png';

interface SignUpScreenProps {
  onClose: () => void;
  onOpenSignIn: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onClose, onOpenSignIn }) => {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    const res = await signUpWithEmail(email, password, name);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
      triggerHaptic('error');
    } else {
      triggerHaptic('success');
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
          <span className="font-extrabold text-sm text-[#6B6B6B] tracking-wider">CREATE ACCOUNT</span>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          <div className="flex flex-col items-center text-center mb-5">
            <img
              src={logoLightHoriz}
              alt="POPCIX"
              className="h-9 object-contain mb-3"
            />
            <Mascot mood="superhero" size={75} className="mb-2" />
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              Join POPCIX
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFBEB] border border-[#FDE68A] rounded-full text-xs font-bold text-[#B45309] mt-2">
              <Gift className="w-3.5 h-3.5 text-[#FFAA00]" />
              <span>Get 200 Welcome POPCIX Points!</span>
            </div>
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
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E8E8E] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full bg-white border border-[#DFDFD6] rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-[#111111] placeholder:text-[#9E9E9E] focus:outline-none focus:border-black transition-colors shadow-2xs"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Password (min 6 characters)
              </label>
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
              Create Account
            </Button>
          </form>

          {/* Footer Link to Sign In */}
          <div className="text-center mt-5">
            <p className="text-xs text-[#6B6B6B] font-medium">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenSignIn();
                }}
                className="font-bold text-black underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
