"use client";

import { Content, isPreviewing } from "@builder.io/sdk-react-nextjs";
import DefaultErrorPage from "next/error";
import { BUILDER_API_KEY } from "@/lib/builder";

interface BuilderPageProps {
  content: unknown;
  model?: string;
}

export function BuilderPage({ content, model = "page" }: BuilderPageProps) {
  if (!content && !isPreviewing()) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <Content
      apiKey={BUILDER_API_KEY}
      model={model}
      content={content as Parameters<typeof Content>[0]["content"]}
    />
  );
}
