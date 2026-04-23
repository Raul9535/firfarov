type ClassValue = string | number | null | undefined | false | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const value of inputs) {
    if (!value) continue;
    if (Array.isArray(value)) out.push(cn(...value));
    else out.push(String(value));
  }
  return out.join(" ");
}
