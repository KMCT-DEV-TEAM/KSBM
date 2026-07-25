import BlogDetailPage from '../../../features/blogs/BlogDetailPage';

export const metadata = {
  title: 'Blog Article | KSBM',
  description: 'Read the latest insights, research, and thought leadership from KSBM.',
};

export default function Page({ params }) {
  // Pass the ID to the client component to fetch/render
  return <BlogDetailPage id={params.id} />;
}
