import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

/**
 * Consumed by the `sanity` CLI (schema extract, typegen, deploy).
 * Reads the same NEXT_PUBLIC_SANITY_* env vars as the Studio config, so schema extraction
 * and Studio always target the same project/dataset.
 */
export default defineCliConfig({
  api: { projectId, dataset },
});
