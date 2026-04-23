import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { schemaTypes, singletonDocumentTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const singletonSet = new Set<string>(singletonDocumentTypes);

export default defineConfig({
  name: "firfarov",
  title: "FIRFAROV",
  projectId,
  dataset,
  basePath: studioBasePath,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    // Remove singleton document types from the global "+ Create" menu.
    // Editors interact with them through the pinned sidebar entries from `structure.ts`.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonSet.has(schemaType)),
  },
  document: {
    // Strip duplicate/delete from singletons — there should always be exactly one.
    actions: (input, context) =>
      singletonSet.has(context.schemaType)
        ? input.filter(({ action }) => action !== "duplicate" && action !== "delete")
        : input,
  },
});
