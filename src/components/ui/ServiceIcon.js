import {
  Clapperboard,
  Instagram,
  Layout,
  Package,
  PenTool,
  Presentation,
  Printer,
} from "lucide-react";

/**
 * Maps the `icon` key stored in services.json to a lucide component, so the
 * data file stays free of imports and the bundle only pulls the icons in use.
 */
const ICONS = {
  PenTool,
  Instagram,
  Printer,
  Layout,
  Package,
  Presentation,
  Clapperboard,
};

export default function ServiceIcon({ name, className = "h-5 w-5" }) {
  const Icon = ICONS[name] || PenTool;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
