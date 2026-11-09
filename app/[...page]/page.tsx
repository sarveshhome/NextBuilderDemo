import {
  fetchOneEntry,
  getBuilderSearchParams,
  type GetContentOptions,
} from "@builder.io/sdk-react-nextjs";
import type { Metadata } from "next";
import { BuilderPage } from "@/components/BuilderPage";
import { BUILDER_API_KEY } from "@/lib/builder";

interface PageProps {
  params: Promise<{ page?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function urlPathFromParams(page: string[] = []) {
  return "/" + page.join("/");
}

function toSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
      continue;
    }
    if (value !== undefined) params.set(key, value);
  }

  return params;
}

export async function generateMetadata({
  params,
}: Pick<PageProps, "params">): Promise<Metadata> {
  const { page = [] } = await params;
  const content = await fetchOneEntry({
    model: "page",
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath: urlPathFromParams(page) },
  });

  return {
    title: (content?.data?.title as string | undefined) || "NextBuilderDemo",
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ page = [] }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const urlPath = urlPathFromParams(page);
  const options = getBuilderSearchParams(
    toSearchParams(resolvedSearchParams),
  ) as GetContentOptions["options"];
  const content = await fetchOneEntry({
    model: "page",
    apiKey: BUILDER_API_KEY,
    options,
    userAttributes: { urlPath },
  });

  return <BuilderPage content={content} />;
}
