"use client";

import { WorkflowEditor } from "@/components/workflow-editor";
import { useApp } from "../app-provider";

export function WorkflowsView() {
  const { environment, pendingIntegration, setPendingIntegration } = useApp();

  return (
    <div className="h-full min-h-0">
      <WorkflowEditor
        environment={environment}
        pendingIntegration={pendingIntegration}
        onPendingHandled={() => setPendingIntegration(null)}
      />
    </div>
  );
}