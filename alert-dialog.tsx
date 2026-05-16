import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";

export function CategoryIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = ((name && (Icons as unknown as Record<string, LucideIcon>)[name]) ||
    Icons.Pill) as LucideIcon;
  return <Icon className={className} />;
}
