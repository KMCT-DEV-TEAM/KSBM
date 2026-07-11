"use client";
import AdminLayout from "../../../layouts/AdminLayout";
import ProtectedRoute from "../../../routes/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

