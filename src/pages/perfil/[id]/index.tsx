import supabase from "@/supabase.js";
import { Trophy } from "lucide-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Profile() {
	const [profile, setProfile] = useState(null);
	const router = useRouter();
	const id = router.query.id;

	(async () => {
		if (!id)
			return;
		const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
		setProfile(data);
	})();
	return (
		<>
			{ profile &&
				<div className="w-full flex flex-col -mt-10">
					<div>
						<img src="/banner.png" className="w-full h-80 object-cover select-none pointer-events-none" />
					</div>
					<div className="relative flex items-center sm:flex-col sm:justify-center border-b text-zinc-700 bg-zinc-100 justify-between">
						<div className="px-10 py-4 flex items-center gap-4 sm:flex-col sm:text-center">
							<img className="rounded-full h-20 w-20 select-none pointer-events-none" src={ profile.avatar } />
							<div className="flex-col ml-5">
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
						<div className="xl:mr-10 flex items-center justify-center gap-4 sm:mb-10 sm:mt-5 sm:w-full">
							<button type="button" className="bg-blue-600 text-zinc-50 h-[50px] w-[200px] sm:w-[80%] rounded shadow-md border-2 border-zinc-700 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
								<Trophy size={20} />
								Conquistas
							</button>
						</div>
					</div>

					<div className="p-10">
						<span>Olá, estou usando o WhatsApp!</span>
					</div>
				</div>
			}
		</>
	);
};