import TaskBoard from '@/components/corp/TaskBoard';

export const metadata = { title: 'Tasks' };
export const dynamic = 'force-dynamic';

export default function AdminTasksPage() {
  return <TaskBoard title="Work & Assignments" />;
}
