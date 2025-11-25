import type { Models } from "@/types";

export type Ticket = {
id: number;
title: string;
description: string;
status: Models.Meta;
priority: Models.Meta;
categories: Models.Meta[];
labels: Models.Meta[];
assigned_to?: Models.AuthUser | null;
attachments?: Models.Attachment[]| null;
created_at: string;
updated_at?: string;
};
