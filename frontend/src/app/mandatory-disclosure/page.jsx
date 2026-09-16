import { redirect } from 'next/navigation';
import { DEFAULT_MANDATORY_DISCLOSURE } from '../../features/admin/cms/constants/defaultCmsData';

export const metadata = {
  title: 'Mandatory Disclosure | KSBM',
  description: 'AICTE and regulatory compliance mandatory disclosure documents for KMCT School of Business Management.',
};

export default function MandatoryDisclosurePage() {
  const pdfUrl = DEFAULT_MANDATORY_DISCLOSURE?.pdfUrl || '/assets/Images/downloads/1789448309165-715843124.pdf';
  redirect(pdfUrl);
}
