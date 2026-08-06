export type HomeAssistantEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context?: {
    id: string;
    parent_id: string | null;
    user_id: string | null;
  };
};

export type HomeAssistantServiceData =
  Record<string, unknown>;

async function readError(response: Response) {
  const message = await response.text();

  return (
    message ||
    `Home Assistant request failed: ${response.status}`
  );
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`/ha-api${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const contentType =
    response.headers.get("content-type");

  if (
    !contentType?.includes("application/json")
  ) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getEntity(
  entityId: string,
): Promise<HomeAssistantEntity> {
  return request<HomeAssistantEntity>(
    `/states/${encodeURIComponent(entityId)}`,
  );
}

export function getAllEntities():
  Promise<HomeAssistantEntity[]> {
  return request<HomeAssistantEntity[]>("/states");
}

export function callService(
  domain: string,
  service: string,
  data: HomeAssistantServiceData = {},
): Promise<HomeAssistantEntity[]> {
  return request<HomeAssistantEntity[]>(
    `/services/${encodeURIComponent(
      domain,
    )}/${encodeURIComponent(service)}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export function toggleEntity(entityId: string) {
  const [domain] = entityId.split(".");

  if (!domain) {
    throw new Error(
      `Invalid Home Assistant entity: ${entityId}`,
    );
  }

  return callService(domain, "toggle", {
    entity_id: entityId,
  });
}

export function turnOnEntity(entityId: string) {
  const [domain] = entityId.split(".");

  if (!domain) {
    throw new Error(
      `Invalid Home Assistant entity: ${entityId}`,
    );
  }

  return callService(domain, "turn_on", {
    entity_id: entityId,
  });
}

export function turnOffEntity(entityId: string) {
  const [domain] = entityId.split(".");

  if (!domain) {
    throw new Error(
      `Invalid Home Assistant entity: ${entityId}`,
    );
  }

  return callService(domain, "turn_off", {
    entity_id: entityId,
  });
}
export async function protectedHomeAssistantAction(
  pin: string,
  domain: string,
  service: string,
  data: HomeAssistantServiceData = {},
): Promise<HomeAssistantEntity[]> {
  const response = await fetch("/security/ha-action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin, domain, service, data }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return (await response.json()) as HomeAssistantEntity[];
}
