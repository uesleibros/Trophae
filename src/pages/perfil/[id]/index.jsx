import supabase from "@/supabase.js";
import Dropdown from "@/components/Dropdown";
import { useAuth  } from "@/context/AuthContext.js";
import { Trophy, MoreVertical } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function Profile() {
	const { user } = useAuth();
	const [profile, setProfile] = useState(null);
	const router = useRouter();
	const id = router.query.id;

	(async () => {
		const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
		setProfile(data);
	})();

	return (
		<>
			{ (profile) && (
				<>
					<Head>
						<title>Trophae – { profile.username }</title>
					</Head>
					<div className="w-full flex flex-col -mt-10">
						<div className="relative flex items-center sm:flex-col sm:justify-center border-b text-zinc-700 bg-zinc-100 justify-between">
							<div className="px-10 py-4 flex items-center gap-4 sm:flex-col sm:text-center">
								<Image className="rounded-full select-none pointer-events-none shadow-sm" src={  profile.avatar } height={100} width={100} quality={100} priority  alt="Foto de Perfil" />
								<div className="flex-col xl:ml-5 md:ml-5">
									<h2 className="font-bold text-xl mb-1">{ profile.username }</h2>
									<hr className="mb-2" />
									<p className="text-zinc-400 text-xs mb-1">
										Moedas: { profile.coins }
									</p>
									<p className="text-zinc-400 text-xs">
										{ profile.achievements !== null ? profile.achievements.length : 0 } Conquista(s) adquirida(s)
									</p>
								</div>
							</div>
							<div className="xl:mr-10 flex items-center justify-center gap-4 sm:mb-10 sm:flex-col sm:mt-5 sm:w-full">
								{ (user && (profile.id === user.id)) && (
									<Dropdown 
									text={
										<div className="bg-zinc-50 mt-[5px] cursor-pointer relative border-2 border-zinc-300 shadow-sm rounded h-[50px] text-zinc-700 p-3 text-center transition-colors hover:bg-zinc-100">
											<MoreVertical size={20} />
										</div>
									}
									items={[ {label: "Configurações", link: "/editar/perfil"} ]}
									/>
								)}
								
								<button type="button" className="bg-blue-600 text-zinc-50 h-[50px] w-[200px] sm:w-[80%] rounded shadow-md border-2 border-zinc-700 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
									<Trophy size={20} />
									Conquistas
								</button>
							</div>
						</div>

						<div className="p-10">
							<span>
							{ 
								profile.biography == "" 
								?
								"Olá, estou usando o Trophae e você também, que legal!"
								:
								profile.biography
							}
							</span>
						</div>
					</div>
				</>
			)}
		</>
	);
};