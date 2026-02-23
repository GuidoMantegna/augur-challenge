import React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

function Portal({ children, containerId = "portal-root" }: PortalProps) {
  const elRef = useRef<HTMLElement | null>(null);

  if (!elRef.current && typeof document !== "undefined") {
    elRef.current = document.createElement("div");
  }

  useEffect(() => {
    if (typeof document === "undefined") return;

    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }

    const element = elRef.current!;
    container.appendChild(element);

    return () => {
      container?.removeChild(element);
    };
  }, [containerId]);

  if (typeof document === "undefined" || !elRef.current) return null;

  return createPortal(children, elRef.current);
}

interface ModalProps {
  open: boolean | string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setIsMounted(false), 200); // match duration
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!isMounted) return null;

  return (
    <Portal>
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center
          transition-opacity duration-200
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <div
          className={`
            relative z-10 w-full max-w-lg rounded-2xl bg-[var(--bg-modal)] p-6 shadow-xl
            transform transition-all duration-200
            ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
          `}
        >
          <div className="max-h-[90vh] overflow-scroll p-2">

          {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default Modal