import Sidebar from "@/components/Sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="student-layout">
      <Sidebar userRole="student" />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}