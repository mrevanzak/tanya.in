import { SidebarContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <aside className="hidden w-72 border-r bg-background md:block">
      <SidebarContent />
    </aside>
  );
}
