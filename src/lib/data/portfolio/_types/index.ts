import type { ImgMeta } from '^types';

export type YoutubeVideo = { type: 'youtube-video'; url: string; image: ImgMeta };
export type Image = { type: 'image'; image: ImgMeta };

export type PortfolioData = {
	title: string;
	description: string;
	media: (YoutubeVideo | Image)[];
};
