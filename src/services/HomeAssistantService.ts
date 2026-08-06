export type HomeAssistantEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
};

type ServiceData = Record<string, unknown>;

async function getErrorMessage(
  response: Response,
): Promise<string> {
  const responseText = await response.text();

  return (
    responseText ||
    `Home Assistant request failed: ${response.status}`
  );
}

export async function getEntityState(
  entityId: string,
): Promise<HomeAssistantEntity> {
  const response = await fetch(
    `/ha-api/states/${encodeURIComponent(entityId)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as HomeAssistantEntity;
}

export async function callService(
  domain: string,
  service: string,
  data: ServiceData,
): Promise<unknown> {
  const response = await fetch(
    `/ha-api/services/${encodeURIComponent(
      domain,
    )}/${encodeURIComponent(service)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return response.json();
}

export function toggleGarageLights() {
  return callService("switch", "toggle", {
    entity_id: "switch.garage_lights",
  });
}