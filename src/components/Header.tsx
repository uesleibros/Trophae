import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import { useAuth  } from "@/context/AuthContext.js";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, Menu } from "lucide-react";

export default function Header() {
	const { user } = useAuth();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [sideBarOpen, setSideBarOpen] = useState(false);
	const sideBarRef = useRef<HTMLDivElement | null>(null);
	const projectsInput = useRef<HTMLInputElement | null>(null);

	let accountItems: any[] = [];

	if (user) {
		accountItems = [ 
			{label: <span>Entrou como <strong>{ user.user_metadata.username }</strong></span>}, 
			{
				label: "Meu perfil", 
				link: `/perfil/${user.id}`, 
				divide: true
			}, 
			{
				label: "Configurações", 
				link: "/editar/perfil"
			}, 
			{
				label: <span className="text-red-500">Desconectar</span>, 
				link: "/auth/signout",
				divide: true
			} 
		];
	}

	function toggleSideBar() {
	   setSideBarOpen(!sideBarOpen);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (sideBarRef.current && !sideBarRef.current.contains(event.target as Node)) {
			setSideBarOpen(false);
		}
	};

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (projectsInput.current && !projectsInput.current.contains(event.target as Node)) {
		      if (event.ctrlKey && event.key === "/" && projectsInput.current.value.length === 0) {
		        event.preventDefault();
		        projectsInput.current.focus();
		      }
		   }
		};

		document.addEventListener("keydown", handleKeyPress);
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<>
			<header className="bg-zinc-800 text-zinc-50 p-2 w-full mb-10 w-full">
				<div className="w-full container mx-auto flex items-center justify-between gap-4">
					<nav className="flex items-center space-x-8 sm:hidden">
						<Link href="/" className="relative transition-colors hover:bg-zinc-50 hover:bg-opacity-10 hover:rounded-md flex items-center gap-2">
							Início
						</Link>
						<Link href="/projetos" className="relative transition-colors hover:bg-zinc-50 hover:bg-opacity-10 hover:rounded-md flex items-center gap-2">
							Projetos
						</Link>
					</nav>

					<div className="bg-zinc-700 cursor-pointer relative md:hidden sm:visible md:w-0 md:h-0 border border-zinc-500 rounded p-3" onClick={toggleSideBar}>
						<Menu size={20} className="text-zinc-50" />
					</div>

					<div className="relative bg-zinc-700 xl:w-[40%] md:w-[80%] lg:w-[80%] shadow-sm border border-zinc-500 rounded-md p-2 px-4 flex items-center gap-3">
						<Search size={20} className="text-zinc-400" />
						<input ref={projectsInput} type="text" placeholder="Buscar projetos..." className="outline-none bg-transparent w-full" />
						<div className="border border-zinc-500 bg-zinc-700 rounded-md shadow-md px-[12px] py-[5px] flex justify-center items-center">
							<span className="select-none text-zinc-400 text-sm italic">/</span>
						</div>
					</div>

					<div className="flex items-center gap-6">
						{user ? (
							<>
								<Dropdown 
								text={
									<Image className="rounded-full shadow-md object-cover mb-0 pb-0 mt-2 select-none pointer-events-none" src={ user.user_metadata.avatar } height={40} width={40} quality={100} priority alt="Foto de Perfil" />
								}
								items={accountItems}
								/>
							</>
						) : (
							<div className="flex items-center gap-4 sm:hidden">
								<Link href="/login">
									<button type="button" className="bg-zinc-700 transition-colors hover:bg-zinc-600 px-8 py-2 border border-zinc-500 rounded border-zinc-300">
										Login
									</button>
								</Link>
								<Link href="/login/registrar">
									<button type="button" className="bg-zinc-700 transition-colors hover:bg-zinc-600 px-8 py-2 border border-zinc-500 rounded border-zinc-300">
										Registrar
									</button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</header>
		</>
  );
};