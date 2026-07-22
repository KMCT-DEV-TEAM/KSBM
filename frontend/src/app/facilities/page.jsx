import Facilities from "../../features/facilities/Facilities";
import MainLayout from "../../layouts/MainLayout";

export const metadata = {
  title: "Facilities | KSBM",
  description: "Explore the state-of-the-art facilities and infrastructure at KMCT School of Business Management.",
};

export default function FacilitiesPage() {
  return (
    <MainLayout>
      <Facilities />
    </MainLayout>
  );
}
