import './globals.css';

export const metadata = {
  title: 'KMCT School of Business Management | KSBM',
  description: 'Welcome to KMCT School of Business Management (KSBM). We build careers that matter with 99% placement rates, top-tier academic programs, accreditation, state-of-the-art facilities, and a vibrant campus life.',
  keywords: 'KMCT, KSBM, MBA, Business School, Management, Placement, Education, Kerala, Business Management',
  openGraph: {
    type: 'website',
    title: 'KMCT School of Business Management | KSBM',
    description: 'Welcome to KMCT School of Business Management (KSBM). Discover top-tier academic programs, outstanding placements, and a vibrant campus life.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KMCT School of Business Management | KSBM',
    description: 'Welcome to KMCT School of Business Management (KSBM). Discover top-tier academic programs, outstanding placements, and a vibrant campus life.',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

