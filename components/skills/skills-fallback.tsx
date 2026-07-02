import { Badge } from "@/components/ui/badge";
import { skillGroups } from "@/components/skills/skills-data";

/**
 * The calm skill grid: the exact chip groups the About section always
 * had. This is the fallback for mobile, reduced motion, and no-WebGL,
 * and it is also the screen-reader mirror rendered underneath the 3D
 * canvas so the labels always exist in the DOM.
 */
export function SkillsFallback({ visuallyHidden = false }: { visuallyHidden?: boolean }) {
  return (
    <div className={visuallyHidden ? "sr-only" : undefined}>
      {skillGroups.map((group) => (
        <div className="chips" key={group.label}>
          <Badge tone="green">{group.label}</Badge>
          {group.items.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      ))}
    </div>
  );
}
