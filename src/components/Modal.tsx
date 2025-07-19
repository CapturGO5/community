"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

function FallbackComponent() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">Please try again later.</p>
      </div>
    </div>
  );
}

export default function Modal({ isOpen, onClose, onConfirm, title, message, children, className = 'max-w-sm' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg p-4 ${className} w-full mx-4 shadow-xl`}
        >
          <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
          {message && <p className="text-gray-300 mb-6">{message}</p>}
          {children ? (
            children
          ) : onConfirm ? (
            <div className="flex gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Proceed
              </button>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </ErrorBoundary>
  );
}
