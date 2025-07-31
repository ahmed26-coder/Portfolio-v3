import ProjectDetailPage from "@/components/layout/portfolio/portfolio-details";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ProjectDetailPage projectId={id} />;
}