import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { projects } from "@/data/projects";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return {
    title: project ? `${project.title} — Aditya Choudhary` : "Project — Aditya Choudhary",
    description: project?.description || "Selected work by Aditya Choudhary.",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
