import DepartmentManager from '@/components/corp/DepartmentManager';

export const metadata = { title: 'Departments' };
export const dynamic = 'force-dynamic';

export default function AdminDepartmentsPage() {
  return <DepartmentManager />;
}
