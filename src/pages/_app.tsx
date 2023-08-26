import { AppProps } from "next/app";
import Head from "next/head";
import Header from "@/components/Header";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext.js";
import { inter, poppins } from "@/fonts";

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main className={`relative flex flex-col justify-center items-center ${inter.className}`}>
			<Head>
				<meta name="google" content="notranslate" />

				{/* Open Graph */}
				<meta property="og:title" content="Trophae" />
				<meta property="description" content="O melhor serviço de conquistas feito para projetos criados em PowerPoint." />
				<meta property="og:description" content="O melhor serviço de conquistas feito para projetos criados em PowerPoint." />
				<meta property="og:image" content="/logo.png" />

				{/* Twitter */}
				<meta property="twitter:title" content="Trophae" />
				<meta property="twitter:description" content="O melhor serviço de conquistas feito para projetos criados em PowerPoint." />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:image" content="/logo.png" />

				<link rel="icon" href="/logo.png" />
				<title>Trophae</title>
			</Head>
			<AuthProvider>
				<Header />
				<Component {...pageProps} />
			</AuthProvider>
		</main>
	);
};