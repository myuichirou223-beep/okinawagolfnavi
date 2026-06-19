import type { ReactNode } from "react";
import { PortalSidebar } from "./PortalSidebar";

type DesktopSidebarLayoutProps = {
  children: ReactNode;
  mainClassName?: string;
};

export function DesktopSidebarLayout({ children, mainClassName = "" }: DesktopSidebarLayoutProps) {
  return (
    <main id="main" className={`portal-page-shell ${mainClassName}`.trim()}>
      <div className="portal-page-layout">
        <div className="portal-page-content">{children}</div>
        <PortalSidebar />
      </div>
    </main>
  );
}
