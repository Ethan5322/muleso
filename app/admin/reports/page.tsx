import DepartmentReports from '@/components/corp/DepartmentReports';

export const metadata = { title: 'Department Reports' };
export const dynamic = 'force-dynamic';

export default function AdminReportsPage() {
  return <DepartmentReports />;
}
