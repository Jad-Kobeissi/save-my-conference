import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { SidebarShell } from "@/components/sidebar-shell";
import { ensureAdminSeed } from "@/lib/bootstrap";

export const metadata = {
  title: "Save My Conference V8",
  description: "Next.js rebuild of the Flask V10 / Same V9 design"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await ensureAdminSeed();
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <SidebarShell user={user}>{children}</SidebarShell>
      </body>
    </html>
  );
}
