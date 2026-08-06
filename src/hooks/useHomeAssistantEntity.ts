import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getEntity,
  type HomeAssistantEntity,
} from "../services/HomeAssistantClient";

type UseHomeAssistantEntityOptions = {
  refreshInterval?: number;
  enabled?: boolean;
};

type UseHomeAssistantEntityResult = {
  entity: HomeAssistantEntity | null;
  state: string;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
};

export function useHomeAssistantEntity(
  entityId: string,
  options: UseHomeAssistantEntityOptions = {},
): UseHomeAssistantEntityResult {
  const {
    refreshInterval = 10_000,
    enabled = true,
  } = options;

  const [entity, setEntity] =
    useState<HomeAssistantEntity | null>(null);

  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      const nextEntity = await getEntity(entityId);

      setEntity(nextEntity);
      setError("");
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Home Assistant unavailable",
      );
    } finally {
      setLoading(false);
    }
  }, [enabled, entityId]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    void refresh();

    if (refreshInterval <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      void refresh();
    }, refreshInterval);

    return () => {
      window.clearInterval(timer);
    };
  }, [enabled, refresh, refreshInterval]);

  return {
    entity,
    state: entity?.state ?? "unknown",
    loading,
    error,
    refresh,
  };
}