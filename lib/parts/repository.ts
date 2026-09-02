import "server-only";

import { ObjectId, type WithId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { partInputSchema, type Part, type PartInput } from "./schema";

type PartDocument = PartInput & { createdAt: Date; updatedAt: Date };

function serializePart(document: WithId<PartDocument>): Part {
  const { _id, createdAt, updatedAt, ...fields } = document;
  return {
    ...fields,
    id: _id.toHexString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}

async function collection() {
  return (await getDatabase()).collection<PartDocument>("parts");
}

export async function createPart(input: unknown): Promise<Part> {
  const fields = partInputSchema.parse(input);
  const now = new Date();
  const document = { ...fields, createdAt: now, updatedAt: now };
  const { insertedId } = await (await collection()).insertOne(document);
  return serializePart({ ...document, _id: insertedId });
}

export async function getPart(id: string): Promise<Part | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  const document = await (await collection()).findOne({ _id: new ObjectId(id) });
  return document ? serializePart(document) : null;
}

/** Newest first; cursor pagination uses MongoDB's existing _id index. */
export async function listParts(
  options: { limit?: number; before?: string } = {},
): Promise<Part[]> {
  const { limit = 50, before } = options;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("limit must be an integer between 1 and 100.");
  }
  if (before !== undefined && !/^[a-f\d]{24}$/i.test(before)) {
    throw new Error("before must be a valid part ID.");
  }
  const documents = await (await collection())
    .find(before ? { _id: { $lt: new ObjectId(before) } } : {})
    .sort({ _id: -1 })
    .limit(limit)
    .toArray();
  return documents.map(serializePart);
}
