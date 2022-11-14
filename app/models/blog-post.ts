export interface Post {
	id: string;
	slug: string;
	contentMarkdown: string;
	contentHtml: string;
	createdAt: Date;
	updatedAt: Date | null;
	postTypeId: string;
	title: string;
	image: string | null;
	imageAlt: string | null;
	description: string | null;
	excerpt: string | null;
	twitterCard: string | null;
}

export interface BlogPost extends Post {
	postTypeId: "BLOG";
}
