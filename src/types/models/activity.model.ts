export type ActivityProperties = {
  attributes?: Record<string, unknown>;
  old?: Record<string, unknown>;
}

export type Activity = {
  id: number;
  log_name: string;
  description: string;
  event: string;
  properties: ActivityProperties;
  causer_name: string;
  createdAt: string;
};
