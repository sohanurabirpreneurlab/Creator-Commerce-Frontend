import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  Link2,
  Settings,
  ShieldCheck,
  UserCircle2,
  Users,
  UsersRound,
} from "lucide-react";
import type { UserRole } from "@/types/auth";

export type SidebarItem = {
  label: string;
  path: string;
  icon?: LucideIcon;
  roles: UserRole[];
  description?: string;
};

const creatorOnly: UserRole[] = ["CREATOR"];
const creatorAndAbove: UserRole[] = ["CREATOR", "BRAND_MANAGER", "SUPER_ADMIN"];
const brandManagerAndAbove: UserRole[] = ["BRAND_MANAGER", "SUPER_ADMIN"];
const superAdminOnly: UserRole[] = ["SUPER_ADMIN"];

export const sidebarItems: SidebarItem[] = [
  {
    label: "Overview",
    path: "/dashboard/overview",
    icon: LayoutDashboard,
    roles: creatorAndAbove,
    description: "Role-specific summary and quick actions.",
  },
  {
    label: "Profile",
    path: "/dashboard/profile",
    icon: UserCircle2,
    roles: creatorAndAbove,
    description: "Profile, identity, and account details.",
  },
  {
    label: "Available Campaigns",
    path: "/dashboard/available-campaigns",
    icon: BriefcaseBusiness,
    roles: creatorOnly,
    description: "Campaign discovery for creators.",
  },
  {
    label: "My Applications",
    path: "/dashboard/my-applications",
    icon: ClipboardList,
    roles: creatorOnly,
    description: "Campaign applications and status tracking.",
  },
  {
    label: "Content Submissions",
    path: "/dashboard/content-submissions",
    icon: FileText,
    roles: creatorOnly,
    description: "Submitted content and review feedback.",
  },
  {
    label: "Tracking Links",
    path: "/dashboard/tracking-links",
    icon: Link2,
    roles: creatorOnly,
    description: "Unique promotional links and attribution.",
  },
  {
    label: "My Performance",
    path: "/dashboard/my-performance",
    icon: BarChart3,
    roles: creatorOnly,
    description: "Clicks, conversions, and revenue visibility.",
  },
  {
    label: "Earnings",
    path: "/dashboard/earnings",
    icon: HandCoins,
    roles: creatorOnly,
    description: "Estimated earnings and payout status.",
  },
  {
    label: "Notifications",
    path: "/dashboard/notifications",
    icon: Bell,
    roles: creatorAndAbove,
    description: "Important workflow and account updates.",
  },
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    roles: creatorAndAbove,
    description: "Account preferences and security settings.",
  },
  {
    label: "Campaigns",
    path: "/dashboard/campaigns",
    icon: FolderKanban,
    roles: brandManagerAndAbove,
    description: "Brand manager campaign planning and execution.",
  },
  {
    label: "Brand Ambassadors",
    path: "/dashboard/brand-ambassadors",
    icon: UsersRound,
    roles: brandManagerAndAbove,
    description: "Relationship management for creator rosters.",
  },
  {
    label: "Creator Applications",
    path: "/dashboard/creator-applications",
    icon: ClipboardList,
    roles: brandManagerAndAbove,
    description: "Review creator applications to live campaigns.",
  },
  {
    label: "Content Approvals",
    path: "/dashboard/content-approvals",
    icon: ShieldCheck,
    roles: brandManagerAndAbove,
    description: "Approval workflow for creator content.",
  },
  {
    label: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
    roles: brandManagerAndAbove,
    description: "Brand-side analytics and campaign reporting.",
  },
  {
    label: "Payouts",
    path: "/dashboard/payouts",
    icon: CreditCard,
    roles: brandManagerAndAbove,
    description: "Financial review and payout operations.",
  },
  {
    label: "Brands",
    path: "/dashboard/brands",
    icon: BriefcaseBusiness,
    roles: superAdminOnly,
    description: "Super admin brand management.",
  },
  {
    label: "Creators",
    path: "/dashboard/creators",
    icon: Users,
    roles: superAdminOnly,
    description: "Super admin creator oversight.",
  },
  {
    label: "Users & Roles",
    path: "/dashboard/user-roles",
    icon: ShieldCheck,
    roles: superAdminOnly,
    description: "Role assignment and access control.",
  },
  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: FileText,
    roles: superAdminOnly,
    description: "Cross-platform reporting views.",
  },
  {
    label: "System Settings",
    path: "/dashboard/system-settings",
    icon: Settings,
    roles: superAdminOnly,
    description: "Global platform configuration.",
  },
];
