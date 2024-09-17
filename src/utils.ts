/* eslint @typescript-eslint/no-explicit-any: off */
import { z } from "zod";

export const zodEnumFromObjKeys = <K extends string>(
  obj: Record<K, any>
): z.ZodEnum<[K, ...K[]]> => {
  const [firstKey, ...otherKeys] = Object.keys(obj) as K[];
  return z.enum([firstKey, ...otherKeys]);
};
