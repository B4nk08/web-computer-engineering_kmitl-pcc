import { cn } from "@/lib/utils";
import { splitNewsBody } from "../split-body";

export function NewsBody({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const lines = splitNewsBody(text);

  if (lines.length <= 1) {
    return (
      <p className={cn("whitespace-pre-line break-words text-pretty", className)}>
        {text}
      </p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {lines.map((line, i) => (
        <li key={`${i}-${line.slice(0, 24)}`} className="break-words leading-relaxed">
          {line}
        </li>
      ))}
    </ul>
  );
}
