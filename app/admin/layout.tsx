import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Admin — Taslima Mehendi",
    template: "%s | Admin — Taslima Mehendi",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Content area — offset for sidebar on desktop, top bar + bottom nav on mobile */}
      <main className="md:pl-56 pt-14 pb-20 md:pt-0 md:pb-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
