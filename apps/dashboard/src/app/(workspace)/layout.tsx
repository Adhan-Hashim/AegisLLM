import { Sidebar } from "@/components/shared/Sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-auto bg-background/50 relative">
        {children}
      </div>
    </div>
  );
}
