import { useState, Component, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AlertTriangle, X, ExternalLink } from "lucide-react";

/* Error boundary so a failed query doesn't crash the whole page */
class AlertErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }
}

function AlertBannerInner() {
  const alerts = useQuery(api.features2.getActiveAlerts);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  if (!alerts || alerts.length === 0) return null;

  const visible = alerts.filter((a: any) => !dismissed.has(a._id));
  if (visible.length === 0) return null;

  const alert = visible[0];

  const severityStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    breaking: { bg: "bg-red-600/95", border: "border-red-500", text: "text-white", icon: "animate-pulse" },
    urgent: { bg: "bg-yellow-600/95", border: "border-yellow-500", text: "text-white", icon: "" },
    info: { bg: "bg-blue-600/90", border: "border-blue-500", text: "text-white", icon: "" },
  };
  const style = severityStyles[alert.severity] || severityStyles.info;

  return (
    <div className={`${style.bg} ${style.border} border-b backdrop-blur-sm relative z-50`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
        <AlertTriangle className={`size-4 ${style.text} ${style.icon} flex-shrink-0`} />
        <div className="flex items-center gap-2 text-center">
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${style.text} opacity-80`}>
            {alert.severity === "breaking" ? "🔴 BREAKING" : alert.severity === "urgent" ? "⚡ URGENT" : "ℹ️ INFO"}
          </span>
          <span className={`text-sm font-bold ${style.text}`}>{alert.headline}</span>
          {alert.message && <span className={`text-xs ${style.text} opacity-80 hidden sm:inline`}>— {alert.message}</span>}
          {alert.linkUrl && (
            <a href={alert.linkUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-xs underline ${style.text} opacity-80 hover:opacity-100`}>
              {alert.linkText || "Learn More"} <ExternalLink className="size-3" />
            </a>
          )}
        </div>
        <button
          onClick={() => setDismissed(prev => new Set(prev).add(alert._id))}
          className={`${style.text} opacity-60 hover:opacity-100 transition-opacity flex-shrink-0`}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function BreakingAlertBanner() {
  return (
    <AlertErrorBoundary>
      <AlertBannerInner />
    </AlertErrorBoundary>
  );
}
