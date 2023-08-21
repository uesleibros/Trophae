"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth  } from "@/context/AuthContext.js";
import { Search, Menu } from "lucide-react";

export default function Header() {
	const { user } = useAuth();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [sideBarOpen, setSideBarOpen] = useState(false);
	const sideBarRef = useRef<HTMLDivElement | null>(null);

	function toggleSideBar() {
	   setSideBarOpen(!sideBarOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node)) {
			setSideBarOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<header className="bg-zinc-100 text-zinc-800 p-4 w-full mb-10">
				<div className="w-full container mx-auto flex items-center justify-between gap-4">
					<nav className="flex items-center space-x-8 sm:hidden">
						<Link href="/" className="relative transition-colors hover:bg-zinc-600 hover:bg-opacity-10 p-4 hover:rounded-md flex items-center gap-2">
							Início
						</Link>
						<Link href="/projetos" className="relative transition-colors hover:bg-zinc-600 hover:bg-opacity-10 p-4 hover:rounded-md flex items-center gap-2">
							Projetos
						</Link>
					</nav>

					<div className="bg-zinc-50 cursor-pointer relative md:hidden sm:visible md:w-0 md:h-0 border rounded p-3" onClick={toggleSideBar}>
						<Menu size={20} className="text-zinc-400" />
					</div>

					<div className="relative bg-zinc-50 w-[80vh] sm:w-full shadow-sm border rounded-md p-2 px-4 flex items-center gap-3">
						<Search size={20} className="text-zinc-400" />
						<input type="text" placeholder="Buscar projetos..." className="outline-none bg-transparent w-full" />
						<div className=" border rounded-md px-[12px] py-[5px] flex justify-center items-center">
							<span className="select-none text-zinc-400 text-sm italic">/</span>
						</div>
					</div>

					<div className="flex items-center gap-6">
						{user ? (
							<>
								<Link href={`/perfil/${user.id}}`}>
								<img className="rounded-full shadow-md object-cover w-10 h-10" src="https://cdn.dribbble.com/users/287815/screenshots/17534130/media/f77ed9bf62def4b32c4ea30fa5c92426.png?resize=400x0" alt="Foto de Perfil" />
								</Link>
								<p className="text-xs text-zinc-400">{ user.email }</p>
							</>
						) : (
							<div className="flex items-center gap-4 sm:hidden">
								<Link href="/login">
									<button type="button" className="bg-zinc-200 transition-colors hover:bg-zinc-50 px-8 py-2 border rounded border-zinc-300">
										Login
									</button>
								</Link>
								<Link href="/login/registrar">
									<button type="button" className="bg-zinc-200 transition-colors hover:bg-zinc-50 px-8 py-2 border rounded border-zinc-300">
										Registrar
									</button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</header>
			{sideBarOpen && (
				<div ref={sideBarRef} className="fixed sm:block top-0 left-0 bg-zinc-50 shadow-xl h-full w-64 transform transition duration-300 ease-in-out translate-x-0 z-10 md:hidden">
					<nav className="flex flex-col gap-4 p-4">
						<Link href="/" className="relative transition-colors hover:bg-zinc-600 hover:bg-opacity-10 p-4 hover:rounded-md flex items-center gap-2">
							Início
						</Link>
						<Link href="/projetos" className="relative transition-colors hover:bg-zinc-600 hover:bg-opacity-10 p-4 hover:rounded-md flex items-center gap-2">
							Projetos
						</Link>
					</nav>
					<div className="flex flex-col items-center gap-4">
						<Link href="/login" type="button" className="bg-zinc-200 transition-colors hover:bg-zinc-50 w-[90%] text-sm py-2 border rounded border-zinc-300 text-center">
							Login
						</Link>
						<Link href="/login/registrar" type="button" className="bg-zinc-200 transition-colors hover:bg-zinc-50 w-[90%] text-sm py-2 border rounded border-zinc-300 text-center">
							Registrar
						</Link>
					</div>
				</div>
			)}
		</>
  );
};