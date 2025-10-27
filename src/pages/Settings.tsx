import { DashboardLayout } from '@/components/DashboardLayout';

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#a30c34' }}>
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences...
        </p>
      </div>
    </DashboardLayout>
  );
}
