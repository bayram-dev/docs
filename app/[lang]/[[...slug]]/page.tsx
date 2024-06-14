import { getLanguages, getPage, getPages } from "@/app/source";
import type { Metadata } from "next";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound, permanentRedirect, redirect } from "next/navigation";

export default async function Page({
	params,
}: {
	params: { lang: string; slug?: string[] };
}) {
	const page = getPage(params.slug, params.lang);

	if (page == null) {
		notFound();
	}

	const MDX = page.data.exports.default;

	return (
		<DocsPage toc={page.data.exports.toc}>
			<DocsBody>
				<h1>{page.data.title}</h1>
				<MDX />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return getLanguages().flatMap(({ language, pages }) =>
		pages.map((page) => ({
			lang: language,
			slug: page.slugs,
		})),
	);
}

export function generateMetadata({
	params,
}: {
	params: { lang: string; slug?: string[] };
}) {
	const page = getPage(params.slug, params.lang);

	if (page == null) {
		permanentRedirect("/get-started/introduction");
	}

	return {
		title: page.data.title,
		description: page.data.description,
	} satisfies Metadata;
}
