import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
export function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <div className="app-shell"><Sidebar/><main className="main-area"><Topbar title={title} subtitle={subtitle}/><div className="page-content">{children}</div></main></div>;
}
