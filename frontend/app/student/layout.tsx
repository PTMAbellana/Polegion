import Sidebar from "@/components/Sidebar";
import styles from '@/styles/navbar.module.css';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles['page-layout']}>
      <Sidebar userRole="student" />
      <main className={styles['main-content']}>
        <div className={styles['content-area']}>
          {children}
        </div>
      </main>
    </div>
  );
}