import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModal = ({ isOpen, onClose, title, onSave, isSaving = false, isSaveDisabled = false, children }) => {
  const [mounted, setMounted] = useState(false);
  const [internalSaving, setInternalSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInternalSave = async (e) => {
    e.preventDefault();
    if (isSaving || internalSaving || isSaveDisabled) return;
    
    setInternalSaving(true);
    try {
      // Brief visual delay to show the loading spinner as requested for UX
      await new Promise(resolve => setTimeout(resolve, 400));
      await onSave();
    } finally {
      setInternalSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1e2869]">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {children}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={onClose}
                disabled={isSaving || internalSaving}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInternalSave}
                disabled={isSaving || internalSaving || isSaveDisabled}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-[#151c48] shadow-md rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {(isSaving || internalSaving) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {(isSaving || internalSaving) ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminModal;
