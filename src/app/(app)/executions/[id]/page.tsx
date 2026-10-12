import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { ExecutionDetailView } from "@/components/executions/execution-detail";
import { executions, getExecution } from "@/lib/data/executions";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return executions.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} · FlowMesh` };
}

export default async function ExecutionPage({ params }: Props) {
  const { id } = await params;
  const execution = getExecution(id);
  if (!execution) notFound();

  return (
    <PageContainer
      title="Execution details"
      subtitle="Inspect every step, input, and output for a single run."
    >
      <ExecutionDetailView execution={execution} />
    </PageContainer>
  );
}