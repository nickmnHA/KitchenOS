import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import SecurityModal from "./SecurityModal";

type SecurityRequest = {
  title?: string;
  description?: string;
  confirmLabel?: string;
};

type SecurityContextValue = {
  requestPin: (request?: SecurityRequest) => Promise<boolean>;
};

const SecurityContext = createContext<SecurityContextValue | null>(null);

type PendingRequest = SecurityRequest & {
  resolve: (allowed: boolean) => void;
};

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingRequest | null>(null);
  const pendingRef = useRef<PendingRequest | null>(null);

  const close = useCallback((allowed: boolean) => {
    pendingRef.current?.resolve(allowed);
    pendingRef.current = null;
    setPending(null);
  }, []);

  const requestPin = useCallback((request: SecurityRequest = {}) => {
    return new Promise<boolean>((resolve) => {
      const next = { ...request, resolve };
      pendingRef.current = next;
      setPending(next);
    });
  }, []);

  const value = useMemo(() => ({ requestPin }), [requestPin]);

  return (
    <SecurityContext.Provider value={value}>
      {children}
      {pending && (
        <SecurityModal
          title={pending.title ?? "Security PIN"}
          description={pending.description ?? "Enter your PIN to continue."}
          confirmLabel={pending.confirmLabel ?? "Continue"}
          onCancel={() => close(false)}
          onSuccess={() => close(true)}
        />
      )}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used inside SecurityProvider");
  }
  return context;
}
