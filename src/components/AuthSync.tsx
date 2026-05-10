"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthSync() {
  const syncAuth = useAuth((state) => state.syncAuth);

  useEffect(() => {
    syncAuth();
  }, [syncAuth]);

  return null;
}
