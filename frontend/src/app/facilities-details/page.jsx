import { Suspense } from 'react';
import FacilityPage from "../../features/facilities/FacilityPage";

export const metadata = {
  title: "Facility Details | KSBM",
  description: "Detailed information about KSBM facilities and infrastructure.",
};

export default function FacilityDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FacilityPage />
    </Suspense>
  );
}
