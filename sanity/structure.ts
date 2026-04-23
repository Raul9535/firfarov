import type { StructureResolver } from "sanity/structure";
import { singletonDocumentTypes } from "./schemas";

/**
 * Human titles for singleton documents in the Studio sidebar.
 * Keys mirror `singletonDocumentTypes` from the schemas index.
 */
const singletonTitles: Record<(typeof singletonDocumentTypes)[number], string> = {
  globalSettings: "Global settings",
  homePage: "Home page",
  aboutPage: "About page",
  contactPage: "Contact page",
  workIndexPage: "Work index",
  blogIndexPage: "Blog index",
  thankYouPage: "Thank-you page",
};

const singletonSet = new Set<string>(singletonDocumentTypes);

/**
 * Studio deskStructure:
 *   - Singletons are pinned at the top as fixed items (no "new document" list).
 *   - Collection document types appear below, filtered to exclude anything in the singleton set.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              singletonDocumentTypes.map((id) =>
                S.listItem()
                  .id(id)
                  .title(singletonTitles[id])
                  .schemaType(id)
                  .child(S.document().schemaType(id).documentId(id)),
              ),
            ),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonSet.has(listItem.getId() ?? ""),
      ),
    ]);
