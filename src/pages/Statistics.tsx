import { DashboardLayout } from '@/components/DashboardLayout';

export default function Statistics() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#a30c34' }}>
          Statistics
        </h1>
        <p className="text-muted-foreground">
          View order statistics and analytics...
        </p>
      </div>
    </DashboardLayout>
  );
}
