import { Container } from "@/components/ui/Container";

type SectionPlaceholderProps = {
  order: number;
  label: string;
  note?: string;
};

/**
 * Dev-only scaffold component. Each page currently composes its approved section list
 * as a stack of <SectionPlaceholder /> calls. Replace one at a time as real sections are built.
 */
export function SectionPlaceholder({ order, label, note }: SectionPlaceholderProps) {
  return (
    <section aria-label={label} className="border-b border-rule py-24">
      <Container>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          Section {order.toString().padStart(2, "0")}
        </p>
        <h2 className="mt-4 font-serif text-3xl text-ink md:text-4xl">{label}</h2>
        {note ? <p className="mt-3 max-w-prose text-sm text-ink-muted">{note}</p> : null}
      </Container>
    </section>
  );
}
