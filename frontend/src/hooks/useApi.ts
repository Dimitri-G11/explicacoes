// ============================================================
//  🎓 HOOK CUSTOMIZADO: useApi
//
//  Um hook que encapsula useState + useEffect + customQuery
//  para qualquer chamada GET à API.
//  As páginas importam este hook e ficam limpas!
// ============================================================
"use client";

import { useState, useEffect, useCallback } from "react";
import { customQuery, ApiResponse } from "@/lib/api";

interface UseApiOptions {
  enabled?: boolean; // Se false, não faz a chamada automaticamente
}

export function useApi<T>(endpoint: string, options: UseApiOptions = {}) {
  const { enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // useCallback para poder usar como dependência do useEffect
  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result: ApiResponse<T> = await customQuery<T>(endpoint);

    setData(result.data);
    setError(result.error);
    setStatus(result.status);
    setIsLoading(false);

    return result;
  }, [endpoint]);

  // useEffect dispara quando o componente monta (ou endpoint muda)
  useEffect(() => {
    if (enabled) {
      fetch();
    }
  }, [fetch, enabled]);

  return { data, error, status, isLoading, refetch: fetch };
}
