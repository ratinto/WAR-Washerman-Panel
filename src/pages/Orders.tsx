import { DashboardLayout } from '@/components/DashboardLayout';

export default function Orders() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#a30c34' }}>
          Orders
        </h1>
        <p className="text-muted-foreground">
          Order management features coming soon...
        </p>
      </div>
    </DashboardLayout>
  );
}
