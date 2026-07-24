import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const toneMap = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type = 'info' } = event.detail || {};
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 2600);
    };

    window.addEventListener('propertyhub:toast', handleToast);
    return () => window.removeEventListener('propertyhub:toast', handleToast);
  }, []);

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div key={toast.id} className={`toast ${toneMap[toast.type] || toneMap.info}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.24 }}>
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
