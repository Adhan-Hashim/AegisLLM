import { Sidebar } from "@/components/shared/Sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-background/50 relative">
        {children}
      </div>
    </>
  );
}
