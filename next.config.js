/** @type {import("next").NextConfig} */
const nextConfig = {
	i18n: {
		locales: ["pt-PT", "pt-BR"],
		defaultLocale: "pt-BR"
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.imgur.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
