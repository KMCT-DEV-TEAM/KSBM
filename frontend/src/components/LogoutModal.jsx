import React from 'react';
import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-[340px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <LogOut className="w-8 h-8 text-red-500 ml-1" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                        Logout
                    </h3>

                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        Are you sure you want to log out of your account?
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors duration-200 shadow-sm shadow-red-200"
                        >
                            Logout
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors duration-200 border border-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
