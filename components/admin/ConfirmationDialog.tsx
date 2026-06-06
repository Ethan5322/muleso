'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="bg-[#0A0F1E] border border-[#00C8FF]/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className={`p-3 rounded-full ${
                    isDangerous
                      ? 'bg-red-500/20 border border-red-500'
                      : 'bg-[#00C8FF]/20 border border-[#00C8FF]'
                  }`}
                >
                  {isDangerous ? (
                    <AlertCircle
                      size={32}
                      className={isDangerous ? 'text-red-400' : 'text-[#00C8FF]'}
                    />
                  ) : (
                    <CheckCircle
                      size={32}
                      className={isDangerous ? 'text-red-400' : 'text-[#00C8FF]'}
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white text-center mb-3">{title}</h3>

              {/* Message */}
              <p className="text-[#00C8FF]/80 text-center text-sm mb-6">{message}</p>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-[#00C8FF]/10 hover:bg-[#00C8FF]/20 text-[#00C8FF] font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {cancelText}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all disabled:opacity-50 ${
                    isDangerous
                      ? 'bg-red-500/30 hover:bg-red-500/50 text-red-400 border border-red-500'
                      : 'bg-gradient-to-r from-[#00C8FF] to-[#7B2FFF] text-white'
                  }`}
                >
                  {isLoading ? 'Saving...' : confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
