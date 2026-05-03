import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  BarChart3, Users, Play, Radio, Eye, MessageSquare,
  Trash2, Plus, ArrowLeft, Activity, Globe, TrendingUp,
  Star, Clock, Mail, Calendar, Handshake, DollarSign,
  FileText, Link2, Mic, ShoppingBag, FolderOpen,
  CheckSquare, Podcast, Palette, Bell, Send, Crown,
  ClipboardList, UserCog, CalendarDays, Image, Heart,
  Scissors, Zap, BookOpen, Package, Tag, ChevronDown,
  ChevronRight, Menu, X, Home, Video, Newspaper,
  Megaphone, Briefcase, Settings, PanelLeftClose, PanelLeft,
} from "lucide-react";
import {
  OpsOverviewTab, CalendarTab, GuestCRMTab, BookingsTab,
  SponsorsTab, RevenueTab, NewslettersTab, ShowNotesTab,
  LinksTab, CommunityTab, MetricsTab,
} from "./AdminOpsPage";
import {
  FinancialTab, MerchTab, EmailCampaignTab, DocumentsTab,
  TasksTab, PodcastRSSTab, AnalyticsTab, BrandKitTab,
  NotificationsTab,
} from "./CommandCenterTabs";
import {
  InvoiceTab, WaiversTab, ContentScheduleTab, TeamTab,
  MembershipTab,
} from "./BusinessOpsTabs";
import {
  MediaLibraryTab, DonationsTab, LiveStreamTab, ClipQueueTab,
  AudienceAnalyticsTab, WorkflowsTab, ContactsTab,
  StoryTrackerTab, MerchFulfillmentTab, PromoCodesTab,
} from "./PowerUpTabs";

/* ═══════════════════════════════════════════════════════════
   SIDEBAR NAVIGATION CONFIG — organized by workflow
   ═══════════════════════════════════════════════════════════ */
type TabId =
  | "overview"
  | "content" | "live" | "live-streams" | "clip-queue" | "media-library" | "podcast-rss" | "shownotes" | "content-schedule"
  | "story-tracker" | "ticker" | "contacts"
  | "subscribers" | "community" | "newsletters" | "email-campaigns" | "metrics" | "audience-analytics" | "membership"
  | "revenue" | "financial" | "invoices" | "sponsors" | "bookings" | "donations" | "promo-codes"
  | "merch" | "merch-fulfillment"
  | "calendar" | "tasks" | "guests" | "guest-crm" | "team" | "waivers" | "documents" | "workflows"
  | "brand-kit" | "links" | "analytics"
  | "notifications"
  | "ops-overview";

interface NavItem {
  id: TabId;
  label: string;
  icon: any;
}

interface NavGroup {
  label: string;
  icon: any;
  color: string;
  items: NavItem[];
}

const sidebarGroups: NavGroup[] = [
  {
    label: "HOME",
    icon: Home,
    color: "#D4A843",
    items: [
      { id: "overview", label: "Dashboard", icon: BarChart3 },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "CONTENT",
    icon: Video,
    color: "#ef4444",
    items: [
      { id: "content", label: "Content Library", icon: Play },
      { id: "live", label: "Live Sessions", icon: Radio },
      { id: "live-streams", label: "Stream Command", icon: Radio },
      { id: "clip-queue", label: "Clip Queue", icon: Scissors },
      { id: "media-library", label: "Media Library", icon: Image },
      { id: "podcast-rss", label: "Podcast RSS", icon: Podcast },
      { id: "shownotes", label: "Show Notes", icon: FileText },
      { id: "content-schedule", label: "Content Calendar", icon: CalendarDays },
    ],
  },
  {
    label: "NEWSROOM",
    icon: Newspaper,
    color: "#3b82f6",
    items: [
      { id: "story-tracker", label: "Story Tracker", icon: BookOpen },
      { id: "ticker", label: "News Ticker", icon: MessageSquare },
      { id: "contacts", label: "Contacts / Sources", icon: Users },
    ],
  },
  {
    label: "AUDIENCE",
    icon: Megaphone,
    color: "#a855f7",
    items: [
      { id: "subscribers", label: "Subscribers", icon: Users },
      { id: "community", label: "Community Wall", icon: MessageSquare },
      { id: "newsletters", label: "Newsletters", icon: Mail },
      { id: "email-campaigns", label: "Email Campaigns", icon: Send },
      { id: "metrics", label: "Social Metrics", icon: TrendingUp },
      { id: "audience-analytics", label: "Audience Stats", icon: Eye },
      { id: "membership", label: "Memberships", icon: Crown },
    ],
  },
  {
    label: "MONEY",
    icon: DollarSign,
    color: "#22c55e",
    items: [
      { id: "revenue", label: "Revenue", icon: DollarSign },
      { id: "financial", label: "Finances", icon: TrendingUp },
      { id: "invoices", label: "Invoices", icon: FileText },
      { id: "sponsors", label: "Sponsors", icon: Handshake },
      { id: "bookings", label: "Bookings", icon: Mic },
      { id: "donations", label: "Tip Jar", icon: Heart },
      { id: "promo-codes", label: "Promo Codes", icon: Tag },
    ],
  },
  {
    label: "MERCH",
    icon: ShoppingBag,
    color: "#f97316",
    items: [
      { id: "merch", label: "Products", icon: ShoppingBag },
      { id: "merch-fulfillment", label: "Order Fulfillment", icon: Package },
    ],
  },
  {
    label: "OPERATIONS",
    icon: Briefcase,
    color: "#06b6d4",
    items: [
      { id: "calendar", label: "Calendar", icon: Calendar },
      { id: "tasks", label: "Tasks", icon: CheckSquare },
      { id: "guests", label: "Guests", icon: Star },
      { id: "guest-crm", label: "Guest CRM", icon: UserCog },
      { id: "team", label: "Crew", icon: Users },
      { id: "waivers", label: "Waivers", icon: ClipboardList },
      { id: "documents", label: "Contracts", icon: FolderOpen },
      { id: "workflows", label: "Workflows", icon: Zap },
    ],
  },
  {
    label: "BRAND",
    icon: Palette,
    color: "#ec4899",
    items: [
      { id: "brand-kit", label: "Brand Kit", icon: Palette },
      { id: "links", label: "Link-in-Bio", icon: Link2 },
      { id: "analytics", label: "Site Analytics", icon: BarChart3 },
    ],
  },
];

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, color = "gold", trend }: {
  icon: any; label: string; value: string | number; color?: string; trend?: string;
}) {
  const colors: Record<string, string> = {
    gold: "from-[#D4A843]/20 to-[#D4A843]/5 border-[#D4A843]/20 text-[#D4A843]",
    red: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
  };
  const c = colors[color] || colors.gold;
  return (
    <div className={`bg-gradient-to-br ${c} border rounded-lg p-5`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="size-5 opacity-70" />
        {trend && <span className="text-xs font-medium text-green-400 flex items-center gap-0.5"><TrendingUp className="size-3" />{trend}</span>}
      </div>
      <p className="font-display text-3xl tracking-wider text-[#f0ece4]">{value}</p>
      <p className="text-xs text-[#888078] tracking-wider uppercase mt-1">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════════════════════════ */
function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, mobileOpen, setMobileOpen, unreadCount }: {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  unreadCount: number;
}) {
  // Which group is the active tab in? Auto-expand it.
  const activeGroup = sidebarGroups.find((g) => g.items.some((i) => i.id === activeTab));
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(activeGroup ? [activeGroup.label] : ["HOME"])
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    // Auto-expand the group when clicking
    const group = sidebarGroups.find((g) => g.items.some((i) => i.id === tabId));
    if (group) {
      setExpandedGroups((prev) => new Set([...prev, group.label]));
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="p-4 border-b border-[#D4A843]/10 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center">
              <span className="font-display text-sm text-[#0a0a0a] font-bold">3G</span>
            </div>
            <div>
              <h1 className="font-display text-sm tracking-wider text-[#D4A843]">3GMG ADMIN</h1>
              <p className="text-[9px] text-[#555] tracking-widest">COMMAND CENTER</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center mx-auto">
            <span className="font-display text-sm text-[#0a0a0a] font-bold">3G</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex text-[#555] hover:text-[#D4A843] transition-colors"
        >
          {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
      </div>

      {/* Navigation groups */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {sidebarGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.label);
          const hasActiveChild = group.items.some((i) => i.id === activeTab);
          const GroupIcon = group.icon;

          return (
            <div key={group.label} className="mb-0.5">
              {/* Group header */}
              <button
                onClick={() => collapsed ? null : toggleGroup(group.label)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all ${
                  hasActiveChild
                    ? "text-[#f0ece4]"
                    : "text-[#777] hover:text-[#ccc]"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? group.label : undefined}
              >
                <GroupIcon className="size-4 shrink-0" style={{ color: hasActiveChild ? group.color : undefined }} />
                {!collapsed && (
                  <>
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase flex-1">{group.label}</span>
                    <ChevronDown className={`size-3 transition-transform ${isExpanded ? "" : "-rotate-90"}`} style={{ opacity: 0.4 }} />
                  </>
                )}
              </button>

              {/* Group items */}
              {(isExpanded || collapsed) && (
                <div className={collapsed ? "space-y-0.5 px-1" : "space-y-0.5 pl-3 pr-2 pb-1"}>
                  {group.items.map((item) => {
                    const isActive = activeTab === item.id;
                    const ItemIcon = item.icon;
                    const showBadge = item.id === "notifications" && unreadCount > 0;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-2.5 rounded-md transition-all relative ${
                          collapsed
                            ? "justify-center p-2"
                            : "px-3 py-1.5"
                        } ${
                          isActive
                            ? "bg-[#D4A843]/15 text-[#D4A843]"
                            : "text-[#888] hover:text-[#ccc] hover:bg-[#ffffff]/5"
                        }`}
                      >
                        {isActive && !collapsed && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r" style={{ backgroundColor: group.color }} />
                        )}
                        <ItemIcon className="size-3.5 shrink-0" />
                        {!collapsed && <span className="text-xs truncate">{item.label}</span>}
                        {showBadge && (
                          <span className={`${collapsed ? "absolute -top-0.5 -right-0.5" : "ml-auto"} w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center`}>
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom area */}
      <div className="p-3 border-t border-[#D4A843]/10">
        <a href="/" className={`flex items-center gap-2 text-[#555] hover:text-[#D4A843] transition-colors text-xs ${collapsed ? "justify-center" : ""}`}>
          <ArrowLeft className="size-3.5" />
          {!collapsed && <span>Back to Site</span>}
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0d0d0d] border-r border-[#D4A843]/10 z-50 transform transition-transform lg:hidden ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-[#D4A843]/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center">
              <span className="font-display text-xs text-[#0a0a0a] font-bold">3G</span>
            </div>
            <span className="font-display text-sm tracking-wider text-[#D4A843]">3GMG ADMIN</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-[#888] hover:text-[#ccc]">
            <X className="size-5" />
          </button>
        </div>
        <div className="h-[calc(100%-60px)] overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-[#0d0d0d] border-r border-[#D4A843]/10 z-30 transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════ */
export function AdminPage() {
  const stats = useQuery(api.admin.getDashboardStats);
  const unreadCount = useQuery(api.commandCenter.getUnreadCount);
  const subscribers = useQuery(api.admin.listSubscribers);
  const tickerItems = useQuery(api.admin.listTickerItems);
  const guests = useQuery(api.admin.listGuests);
  const pageViewStats = useQuery(api.admin.getPageViewStats);
  const contentItems = useQuery(api.contentLib.listContent, {});
  const liveSessions = useQuery(api.contentLib.getAllLiveSessions);

  const addTickerItem = useMutation(api.admin.addTickerItem);
  const deleteTickerItem = useMutation(api.admin.deleteTickerItem);
  const updateTickerItem = useMutation(api.admin.updateTickerItem);
  const addGuest = useMutation(api.admin.addGuest);
  const deleteGuest = useMutation(api.admin.deleteGuest);
  const deleteSubscriber = useMutation(api.admin.deleteSubscriber);
  const addContent = useMutation(api.contentLib.addContent);
  const deleteContent = useMutation(api.contentLib.deleteContent);
  const addLiveSession = useMutation(api.contentLib.addLiveSession);
  const deleteLiveSession = useMutation(api.contentLib.deleteLiveSession);

  const [newTicker, setNewTicker] = useState("");
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestTitle, setNewGuestTitle] = useState("");
  const [newGuestQuote, setNewGuestQuote] = useState("");
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentCategory, setNewContentCategory] = useState("interview");
  const [newContentYoutubeId, setNewContentYoutubeId] = useState("");
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionDate, setNewSessionDate] = useState("");
  const [newSessionPlatform, setNewSessionPlatform] = useState("youtube");

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Find current tab info for the header
  const currentItem = sidebarGroups.flatMap((g) => g.items).find((i) => i.id === activeTab);
  const currentGroup = sidebarGroups.find((g) => g.items.some((i) => i.id === activeTab));
  const CurrentIcon = currentItem?.icon || BarChart3;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        unreadCount={unreadCount ?? 0}
      />

      {/* Main content area */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-56"}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#D4A843]/10">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#888] hover:text-[#D4A843]">
                <Menu className="size-5" />
              </button>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                {currentGroup && (
                  <>
                    <span className="text-[#555] text-xs tracking-widest uppercase">{currentGroup.label}</span>
                    <ChevronRight className="size-3 text-[#333]" />
                  </>
                )}
                <div className="flex items-center gap-1.5">
                  <CurrentIcon className="size-4" style={{ color: currentGroup?.color || "#D4A843" }} />
                  <span className="font-display tracking-wider text-[#f0ece4]">{currentItem?.label || "Dashboard"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveTab("notifications")} className="relative text-[#888078] hover:text-[#D4A843] transition-colors">
                <Bell className="size-5" />
                {(unreadCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-[#555]">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">

          {/* ─── Overview Tab ─── */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Play} label="Total Content" value={stats?.totalContent ?? 0} color="gold" />
                <StatCard icon={Radio} label="Live Sessions" value={stats?.totalSessions ?? 0} color="red" />
                <StatCard icon={Users} label="Subscribers" value={stats?.totalSubscribers ?? 0} color="blue" />
                <StatCard icon={Eye} label="Page Views" value={stats?.totalPageViews ?? 0} color="green" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Activity} label="Views Today" value={stats?.todayPageViews ?? 0} color="purple" />
                <StatCard icon={Star} label="Featured Guests" value={stats?.totalGuests ?? 0} color="gold" />
                <StatCard icon={MessageSquare} label="Ticker Items" value={stats?.activeTickerItems ?? 0} color="blue" />
                <StatCard icon={Clock} label="Upcoming Lives" value={stats?.upcomingSessions ?? 0} color="red" />
              </div>

              {/* Quick actions */}
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-sm text-[#888] tracking-widest uppercase mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Add Content", icon: Plus, tab: "content" as TabId, color: "#ef4444" },
                    { label: "New Story", icon: BookOpen, tab: "story-tracker" as TabId, color: "#3b82f6" },
                    { label: "Schedule Stream", icon: Radio, tab: "live-streams" as TabId, color: "#a855f7" },
                    { label: "View Tasks", icon: CheckSquare, tab: "tasks" as TabId, color: "#22c55e" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => setActiveTab(action.tab)}
                      className="flex items-center gap-2.5 p-3 rounded-lg bg-[#0a0a0a]/60 border border-[#333]/50 hover:border-[#D4A843]/30 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: action.color + "20" }}>
                        <action.icon className="size-4" style={{ color: action.color }} />
                      </div>
                      <span className="text-xs text-[#888] group-hover:text-[#ccc]">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Views Chart */}
              {pageViewStats && pageViewStats.last7Days && (
                <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-6 flex items-center gap-2">
                    <Globe className="size-5 text-[#D4A843]" /> Page Views — Last 7 Days
                  </h3>
                  <div className="flex items-end gap-3 h-40">
                    {pageViewStats.last7Days.map((day: { date: string; views: number }) => {
                      const maxViews = Math.max(...pageViewStats.last7Days.map((d: { views: number }) => d.views), 1);
                      const height = Math.max((day.views / maxViews) * 100, 4);
                      return (
                        <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-xs text-[#888078]">{day.views}</span>
                          <div className="w-full bg-gradient-to-t from-[#D4A843] to-[#E8C767] rounded-t transition-all duration-500" style={{ height: `${height}%` }} />
                          <span className="text-[10px] text-[#888078]">{day.date.slice(5)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {pageViewStats && pageViewStats.byPage && (
                <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 className="size-5 text-[#D4A843]" /> Views by Page
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(pageViewStats.byPage).map(([page, count]) => (
                      <div key={page} className="flex items-center gap-4">
                        <span className="text-sm text-[#c8c0b0] w-24 truncate">{page}</span>
                        <div className="flex-1 h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8C767] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(((count as number) / (pageViewStats.total || 1)) * 100, 100)}%` }} />
                        </div>
                        <span className="text-sm font-medium text-[#D4A843] w-12 text-right">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Content Tab ─── */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                  <Plus className="size-5 text-[#D4A843]" /> Add Content
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" placeholder="Title" value={newContentTitle} onChange={(e) => setNewContentTitle(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <select value={newContentCategory} onChange={(e) => setNewContentCategory(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none">
                    <option value="interview">Interview</option>
                    <option value="street-reporting">Street Reporting</option>
                    <option value="podcast">Podcast</option>
                    <option value="music">Music</option>
                  </select>
                  <input type="text" placeholder="YouTube Video ID" value={newContentYoutubeId} onChange={(e) => setNewContentYoutubeId(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <button onClick={async () => {
                    if (!newContentTitle) return;
                    await addContent({ title: newContentTitle, description: "", category: newContentCategory, youtubeId: newContentYoutubeId || undefined });
                    setNewContentTitle(""); setNewContentYoutubeId("");
                  }} className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all">Add Content</button>
                </div>
              </div>
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D4A843]/10">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">All Content <span className="text-[#888078] text-sm">({contentItems?.length ?? 0})</span></h3>
                </div>
                <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                  {contentItems && contentItems.length > 0 ? contentItems.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex items-center gap-4">
                        {item.youtubeId && <img src={`https://img.youtube.com/vi/${item.youtubeId}/default.jpg`} alt="" className="w-16 h-12 object-cover rounded" />}
                        <div>
                          <p className="text-sm text-[#f0ece4] font-medium">{item.title}</p>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A843]">{item.category}</span>
                        </div>
                      </div>
                      <button onClick={() => deleteContent({ id: item._id })} className="text-[#888078] hover:text-red-400 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  )) : <div className="px-6 py-8 text-center text-[#888078] text-sm">No content yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ─── Live Sessions Tab ─── */}
          {activeTab === "live" && (
            <div className="space-y-6">
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                  <Plus className="size-5 text-[#D4A843]" /> Schedule Live Session
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" placeholder="Session Title" value={newSessionTitle} onChange={(e) => setNewSessionTitle(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <input type="datetime-local" value={newSessionDate} onChange={(e) => setNewSessionDate(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none" />
                  <select value={newSessionPlatform} onChange={(e) => setNewSessionPlatform(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none">
                    <option value="youtube">YouTube</option><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option>
                  </select>
                  <button onClick={async () => {
                    if (!newSessionTitle || !newSessionDate) return;
                    await addLiveSession({ title: newSessionTitle, description: "", scheduledAt: new Date(newSessionDate).toISOString(), platform: newSessionPlatform });
                    setNewSessionTitle(""); setNewSessionDate("");
                  }} className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all">Schedule</button>
                </div>
              </div>
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D4A843]/10">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">All Sessions <span className="text-[#888078] text-sm">({liveSessions?.length ?? 0})</span></h3>
                </div>
                <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                  {liveSessions && liveSessions.length > 0 ? liveSessions.map((session: any) => (
                    <div key={session._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${session.isLive ? "bg-red-500 animate-pulse" : session.isCompleted ? "bg-[#888078]" : "bg-green-400"}`} />
                        <div>
                          <p className="text-sm text-[#f0ece4] font-medium">{session.title}</p>
                          <p className="text-[10px] text-[#888078]">{new Date(session.scheduledAt).toLocaleString()} — {session.platform}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteLiveSession({ id: session._id })} className="text-[#888078] hover:text-red-400 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  )) : <div className="px-6 py-8 text-center text-[#888078] text-sm">No live sessions scheduled.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ─── Ticker Tab ─── */}
          {activeTab === "ticker" && (
            <div className="space-y-6">
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Plus className="size-5 text-[#D4A843]" /> Add Ticker Item</h3>
                <div className="flex gap-4">
                  <input type="text" placeholder='e.g. 🔥 NEW EPISODE DROPPING FRIDAY' value={newTicker} onChange={(e) => setNewTicker(e.target.value)}
                    className="flex-1 bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <button onClick={async () => { if (!newTicker) return; await addTickerItem({ text: newTicker, isActive: true }); setNewTicker(""); }}
                    className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all whitespace-nowrap">Add</button>
                </div>
              </div>
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D4A843]/10">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Ticker Items <span className="text-[#888078] text-sm">({tickerItems?.length ?? 0})</span></h3>
                </div>
                <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                  {tickerItems && tickerItems.length > 0 ? tickerItems.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateTickerItem({ id: item._id, isActive: !item.isActive })}
                          className={`w-3 h-3 rounded-full border-2 transition-all ${item.isActive ? "bg-green-400 border-green-400" : "bg-transparent border-[#888078]"}`} />
                        <p className={`text-sm ${item.isActive ? "text-[#f0ece4]" : "text-[#888078] line-through"}`}>{item.text}</p>
                      </div>
                      <button onClick={() => deleteTickerItem({ id: item._id })} className="text-[#888078] hover:text-red-400 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  )) : <div className="px-6 py-8 text-center text-[#888078] text-sm">No ticker items.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ─── Guests Tab ─── */}
          {activeTab === "guests" && (
            <div className="space-y-6">
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Plus className="size-5 text-[#D4A843]" /> Add Guest</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input type="text" placeholder="Guest Name" value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <input type="text" placeholder="Title (e.g. Rapper)" value={newGuestTitle} onChange={(e) => setNewGuestTitle(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <input type="text" placeholder="Quote" value={newGuestQuote} onChange={(e) => setNewGuestQuote(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <button onClick={async () => {
                    if (!newGuestName) return;
                    await addGuest({ name: newGuestName, title: newGuestTitle || undefined, quote: newGuestQuote || undefined, featured: true });
                    setNewGuestName(""); setNewGuestTitle(""); setNewGuestQuote("");
                  }} className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all">Add Guest</button>
                </div>
              </div>
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D4A843]/10">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Guests <span className="text-[#888078] text-sm">({guests?.length ?? 0})</span></h3>
                </div>
                <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                  {guests && guests.length > 0 ? guests.map((g: any) => (
                    <div key={g._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center text-[#0a0a0a] font-display text-sm">{g.name.charAt(0)}</div>
                        <div><p className="text-sm text-[#f0ece4] font-medium">{g.name}</p><p className="text-[10px] text-[#888078]">{g.title || "Guest"}</p></div>
                      </div>
                      <button onClick={() => deleteGuest({ id: g._id })} className="text-[#888078] hover:text-red-400 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  )) : <div className="px-6 py-8 text-center text-[#888078] text-sm">No guests added.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ─── Subscribers Tab ─── */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Total Subscribers" value={subscribers?.length ?? 0} color="blue" />
                <StatCard icon={Mail} label="Email Subscribers" value={subscribers?.filter((s: any) => s.email).length ?? 0} color="gold" />
                <StatCard icon={Activity} label="This Month" value={subscribers?.filter((s: any) => s.subscribedAt?.startsWith(new Date().toISOString().slice(0, 7))).length ?? 0} color="green" />
              </div>
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D4A843]/10">
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">All Subscribers <span className="text-[#888078] text-sm">({subscribers?.length ?? 0})</span></h3>
                </div>
                <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                  {subscribers && subscribers.length > 0 ? subscribers.map((sub: any) => (
                    <div key={sub._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                      <div><p className="text-sm text-[#f0ece4]">{sub.email || sub.phone || "No contact"}</p>
                        <p className="text-[10px] text-[#888078]">{new Date(sub.subscribedAt).toLocaleDateString()} — via {sub.source || "unknown"}</p></div>
                      <button onClick={() => deleteSubscriber({ id: sub._id })} className="text-[#888078] hover:text-red-400 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  )) : <div className="px-6 py-8 text-center text-[#888078] text-sm">No subscribers yet.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ─── Ops Tabs ─── */}
          {activeTab === "ops-overview" && <OpsOverviewTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "guest-crm" && <GuestCRMTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "sponsors" && <SponsorsTab />}
          {activeTab === "revenue" && <RevenueTab />}
          {activeTab === "newsletters" && <NewslettersTab />}
          {activeTab === "shownotes" && <ShowNotesTab />}
          {activeTab === "links" && <LinksTab />}
          {activeTab === "community" && <CommunityTab />}
          {activeTab === "metrics" && <MetricsTab />}

          {/* ─── Business Ops Tabs ─── */}
          {activeTab === "invoices" && <InvoiceTab />}
          {activeTab === "waivers" && <WaiversTab />}
          {activeTab === "content-schedule" && <ContentScheduleTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "membership" && <MembershipTab />}

          {/* ─── Command Center Tabs ─── */}
          {activeTab === "financial" && <FinancialTab />}
          {activeTab === "merch" && <MerchTab />}
          {activeTab === "email-campaigns" && <EmailCampaignTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "tasks" && <TasksTab />}
          {activeTab === "podcast-rss" && <PodcastRSSTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "brand-kit" && <BrandKitTab />}
          {activeTab === "notifications" && <NotificationsTab />}

          {/* ─── Power-Up Tabs ─── */}
          {activeTab === "media-library" && <MediaLibraryTab />}
          {activeTab === "donations" && <DonationsTab />}
          {activeTab === "live-streams" && <LiveStreamTab />}
          {activeTab === "clip-queue" && <ClipQueueTab />}
          {activeTab === "audience-analytics" && <AudienceAnalyticsTab />}
          {activeTab === "workflows" && <WorkflowsTab />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "story-tracker" && <StoryTrackerTab />}
          {activeTab === "merch-fulfillment" && <MerchFulfillmentTab />}
          {activeTab === "promo-codes" && <PromoCodesTab />}
        </div>
      </div>
    </div>
  );
}
