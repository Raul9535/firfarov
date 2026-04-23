import { SectionPlaceholder } from "./SectionPlaceholder";

/**
 * Renders an ordered list of section placeholders.
 * Used by scaffolded pages to represent their approved section list
 * until each section is extracted into its own component.
 */
export function SectionStack({ sections }: { sections: ReadonlyArray<string> }) {
  return (
    <>
      {sections.map((label, index) => (
        <SectionPlaceholder key={label} order={index + 1} label={label} />
      ))}
    </>
  );
}
