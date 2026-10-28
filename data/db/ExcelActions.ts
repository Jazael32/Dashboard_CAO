"use server";
import { db } from "@/src/prisma/db";
import type { ColumnProfile, DatasetMapping } from '@/lib/dataset/types';
import { profileColumns } from '@/lib/dataset/profile';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type JsonRow = Record<string, JsonValue>;

const Dataset = db.orm.public.Dataset;

const toJson = (value: unknown): JsonValue =>
  JSON.parse(JSON.stringify(value)) as JsonValue;

export async function saveDataset(
  name: string,
  columns: string[],
  rows: JsonRow[],
  profile: ColumnProfile[],
) {
  const created = await Dataset.create({ name, columns, rows, profile, mapping: null });
  return { id: created.id };
}

export async function getDataset(id: string) {
  const dataset = await Dataset.where({ id }).first();
  if (!dataset) return null;

  const columns = dataset.columns as unknown as string[];
  const rows = dataset.rows as unknown as Record<string, unknown>[];

  return {
    id: dataset.id,
    name: dataset.name,
    columns,
    rows,
    profile: (dataset.profile as unknown as ColumnProfile[] | null) ?? profileColumns(columns, rows),
    mapping: dataset.mapping as DatasetMapping | null,
    createdAt: dataset.createdAt.epochMilliseconds,
    updatedAt: dataset.updatedAt.epochMilliseconds,
  };
}


export async function updateRows(id: string, rows: JsonRow[]) {
  await Dataset.where({ id }).update({ rows });
}

export async function deleteDataset(id: string) {
  await Dataset.where({ id }).delete();
}

export async function listDatasets() {
  const list = await Dataset
    .select("id", "name", "updatedAt")
    .orderBy((d) => d.updatedAt.desc())
    .all();

  // Temporal.Instant no se puede enviar a un Client Component, lo paso a número
  return list.map((d) => ({
    id: d.id,
    name: d.name,
    updatedAt: d.updatedAt.epochMilliseconds,
  }));
}