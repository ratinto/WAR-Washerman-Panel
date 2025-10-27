import { DashboardLayout } from '@/components/DashboardLayout';

export default function Students() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#a30c34' }}>
          Student Lookup
        </h1>
        <p className="text-muted-foreground">
          Search for students and view their order history...
        </p>
      </div>
    </DashboardLayout>
  );
}
