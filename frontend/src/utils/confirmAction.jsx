"use client";
import React from 'react';
import { createRoot } from 'react-dom/client';
import ConfirmationModal from '../components/ConfirmationModal';

let currentRoot = null;
let currentDiv = null;

export const confirmAction = (options) => {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve(false);
      return;
    }

    if (currentRoot) {
      currentRoot.unmount();
      if (currentDiv && currentDiv.parentNode) {
        currentDiv.parentNode.removeChild(currentDiv);
      }
    }

    const div = document.createElement('div');
    document.body.appendChild(div);
    const root = createRoot(div);
    currentRoot = root;
    currentDiv = div;

    let isSubmitting = false;

    const cleanup = () => {
      setTimeout(() => {
        if (currentRoot === root) {
          root.unmount();
          if (div.parentNode) div.parentNode.removeChild(div);
          currentRoot = null;
          currentDiv = null;
        }
      }, 300); // Allow exit animation time
    };

    const renderClosed = () => {
      root.render(
        <ConfirmationModal
          isOpen={false}
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          variant={options.variant}
        />
      );
    };

    const render = () => {
      root.render(
        <ConfirmationModal
          isOpen={true}
          title={options.title || 'Are you sure?'}
          message={options.message || 'This action cannot be undone.'}
          confirmText={options.confirmText || 'Confirm'}
          cancelText={options.cancelText || 'Cancel'}
          variant={options.variant || 'primary'}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (isSubmitting) return;
            renderClosed();
            resolve(false);
            cleanup();
          }}
          onConfirm={async () => {
            if (isSubmitting) return;
            isSubmitting = true;
            render();
            
            if (options.action) {
              try {
                await options.action();
              } finally {
                isSubmitting = false;
                renderClosed();
                resolve(true);
                cleanup();
              }
            } else {
              resolve(true);
              renderClosed();
              cleanup();
            }
          }}
        />
      );
    };

    render();
  });
};

export default confirmAction;
