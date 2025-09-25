import Sidebar from "@/components/Sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="teacher-layout">
      <Sidebar userRole="teacher" />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}