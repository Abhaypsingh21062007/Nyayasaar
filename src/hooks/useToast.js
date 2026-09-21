import { useState, useCallback, useRef } from 'react';

let globalId = 0;

/**
 * useToast — lightweight toast notification hook.
 * Returns { toasts, toast } where toast has .success(), .error(), .info() methods.
 */
export default function useToast(maxToasts = 5) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (type, message, durationMs = 4000) => {
      globalId += 1;
      const id = `toast_${globalId}`;

      const newToast = { id, type, message, createdAt: Date.now() };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Trim to maxToasts
        return updated.length > maxToasts ? updated.slice(-maxToasts) : updated;
      });

      // Auto dismiss
      const timer = setTimeout(() => dismiss(id), durationMs);
      timersRef.current.set(id, timer);

      return id;
    },
    [dismiss, maxToasts]
  );

  const toast = {
    success: (msg, duration) => addToast('success', msg, duration),
    error: (msg, duration) => addToast('error', msg, duration ?? 6000),
    info: (msg, duration) => addToast('info', msg, duration),
  };

  return { toasts, toast, dismiss };
}
