'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

interface OverlayContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  showConfirm: (data: ConfirmModalData) => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalData | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showConfirm = useCallback((data: ConfirmModalData) => {
    setConfirmModal(data);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmModal(null);
  }, []);

  const handleConfirmAction = useCallback(() => {
    if (confirmModal) {
      confirmModal.onConfirm();
      closeConfirm();
    }
  }, [confirmModal, closeConfirm]);

  const handleCancelAction = useCallback(() => {
    if (confirmModal) {
      if (confirmModal.onCancel) confirmModal.onCancel();
      closeConfirm();
    }
  }, [confirmModal, closeConfirm]);

  return (
    <OverlayContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-32px)] sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-fade-in-up border ${
              toast.type === 'success' ? 'bg-white border-green-100' :
              toast.type === 'error' ? 'bg-white border-red-100' :
              'bg-white border-blue-100'
            }`}
          >
            {/* Icon */}
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />}
            
            <p className={`text-sm font-medium pr-4 ${
              toast.type === 'success' ? 'text-green-800' :
              toast.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {toast.message}
            </p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {confirmModal.title}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {confirmModal.message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelAction}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {confirmModal.cancelText || 'Cancel'}
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white transition-colors ${
                  confirmModal.isDestructive 
                    ? 'bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20' 
                    : 'bg-[#7CB342] hover:bg-[#689f38] shadow-md shadow-[#7CB342]/20'
                }`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </OverlayContext.Provider>
  );
}
