import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth  } from "@/context/AuthContext.js";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function EditAccount() {
	const { user, updateUser } = useAuth();

	const profile = user?.user_metadata;
	const [profileImage, setProfileImage] = useState(null);

	let presetFailedLogin = false;
	const [failedLogin, setFailedLogin] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [waitingRegs, setWaitingRegs] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [username, setUsername] = useState("");
	const [biography, setBiography] = useState("");
	const [isUsernameValid, setIsUsernameValid] = useState(true);

	const supabase = createClientComponentClient();

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const img = e.target.files[0];
			setProfileImage(img);
		}
	};

	async function uploadProfileImage(e) {
		e.preventDefault();
		if (!profileImage) return;
		let base64Img = await getBase64(profileImage);

		if (typeof base64Img == "string") {
		  base64Img = base64Img.replace(/^data:.+base64,/, "")
		}

		const result = await fetch("/api/image/upload", {
		  method: "POST",
		  headers: {
		      "Content-Type": "application/json",
		  },
		  body: JSON.stringify({ image: base64Img }),
		});

		const response = await result.json();
		const { data, error } = await supabase.auth.updateUser({
			data: {
				avatar: response.link
			}
		});

		await supabase.from("profiles").update({
			avatar: response.link
		}).eq("id", user.id);

		setWaitingRegs(true);
	}

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	async function handleSaveChanges() {
		setIsLoading(true);

		const { data, error } = await supabase.auth.updateUser({
			data: {
				username: ((username.trim().length > 0 && username.trim() !== profile.username)) ? username : profile.username,
				biography: biography
			}
		});

		await supabase.from("profiles").update({
			username: ((username.trim().length > 0 && username.trim() !== profile.username)) ? username : profile.username,
			biography: biography
		}).eq("id", user.id);

		presetFailedLogin = error !== null;
		setFailedLogin(error !== null);
		setLoginError(String(error).replace("AuthApiError:", "").trim());

		if (!validateUsername(username)) {
			setIsUsernameValid(validateUsername(username));
			presetFailedLogin = true;
		}

		if (!presetFailedLogin) {
			setWaitingRegs(true);
		}

		setIsLoading(false);
		updateUser();
	}

	function validateUsername(input) {
		const usernameRegex = /^[a-zA-Z0-9_\s]+$/;
		const MIN_LENGTH = 3;
		const MAX_LENGTH = 40;

		return (
			input.length >= MIN_LENGTH &&
			input.length <= MAX_LENGTH &&
			input.match(usernameRegex)
		);
	};

	function changeField(typeField, field) {
		if (typeField === "username") {
			setUsername(field.target.value);
			setIsUsernameValid(validateUsername(field.target.value));
		} else if (typeField === "biography") {
			setBiography(field.target.value);
		}
		setWaitingRegs(false);
		setIsLoading(false);
	};

	return (
		<>
			{ user && (
				<>
					<div className="w-full flex flex-col -mt-10">
						<div className="relative flex items-center sm:flex-col sm:justify-center border-b text-zinc-700 bg-zinc-100 justify-between">
							<div className="px-10 py-4 flex items-center gap-4 sm:flex-col sm:text-center">
								<Image className="rounded-full xl:ml-5 md:ml-5 select-none pointer-events-none shadow-sm" src={  profile.avatar } height={100} width={100} quality={100} priority alt="Foto de perfil" />
								<div className="flex-col xl:ml-5 md:ml-5">
									<h2 className="font-bold text-xl mb-1">{ profile.username }</h2>
									<hr className="mb-2" />
									<p className="text-zinc-400 text-xs mb-1">
										{ user.email }
									</p>
								</div>
							</div>
							<div className="xl:mr-10 flex items-center justify-center gap-4 sm:mb-10 sm:flex-col sm:mt-5 sm:w-full">
								<Link href={`/perfil/${user.id}`} className="bg-zinc-200 text-zinc-700 h-[30px] w-[230px] sm:w-[80%] rounded shadow-md border-2 border-zinc-400 flex items-center justify-center gap-2 text-sm hover:bg-zinc-100 transition-colors">
									Ir para sua página de perfil
								</Link>
							</div>
						</div>
					</div>
					<div className="mt-10 self-start px-10">
						<h1 className="text-3xl font-bold">Editando perfil</h1>
						<div className="mt-5 w-[70%]">
							{ failedLogin &&
								<div className="w-full p-2 bg-pink-500 border rounded border-pink-800 text-black text-center ">
									{ loginError }
								</div>
							}
							{ waitingRegs &&
								<div className="w-full p-2 bg-blue-400 border rounded border-blue-800 text-black text-xs text-center">
									Dados alterados com êxito.
								</div>
							}
						</div>
						<div className="flex flex-col gap-4 mb-10">
							<div className="w-[70%] sm:w-[100%] mt-10">
								<form className="mb-10" type="post">
									<Image className="rounded-full xl:ml-5 md:ml-5 select-none pointer-events-none shadow-sm" src={  profile.avatar } height={230} width={230} quality={100} priority alt="Foto de perfil" />

									<input className="mt-5 bg-zinc-100 py-2 px-2 rounded shadow-md border outline-none" type="file" id="profile" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />

									<button type="submit" className="px-10 text-zinc-50 font-semibold mt-10 bg-blue-600 py-2 border rounded border-blue-900 transition-all hover:bg-blue-500 duration-500 disabled:opacity-50 disabled:pointer-events-none" onClick={uploadProfileImage}>Atualizar foto de perfil</button>
								</form>
								<form className="w-[100%]">
									<label htmlFor="username" className="text-zinc-700">Nome de Usuário</label>
									<input 
									type="text" 
									id="username" 
									placeholder={ profile.username }
									className={`w-full transition-all duration-300 bg-zinc-100 rounded border shadow-sm p-2 mt-2 mb-5 focus:shadow-md outline-none  ${ 
										!isUsernameValid 
										? "border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500" 
										: "focus:zinc-current focus:zinc-2 focus:border-zinc-300 focus:ring-zinc-400 border-zinc-500 text-zinc-700"
									} `} 
									value={username} 
									onChange={(e) => changeField("username", e)} 
									autoComplete="off" 
									minLength={3} 
									maxLength={40}  
									/>
									{ !isUsernameValid && 
										<p className="text-xs text-pink-500 -mt-3 mb-5">
											Seu nome de usuário não condiz com os requisitos. Mínimo de 3 caracteres com o máximo de 40, não pode conter símbolos com excessão de números (0-9) e underlines (_).
										</p>
									}
									<label htmlFor="biography" className="text-zinc-700">Biografia</label>
									<textarea
									  id="biography"
									  placeholder="As rosas são vermelhas!"
									  className="w-full transition-colors transition-borders duration-300 h-[150px] bg-zinc-100 rounded border shadow-sm p-2 mt-2 mb-5 focus:shadow-md outline-none focus:zinc-current focus:zinc-2 focus:border-zinc-300 focus:ring-zinc-400 border-zinc-500 text-zinc-700"
									  value={biography}
									  onChange={(e) => changeField("biography", e)}
									  autoComplete="off"
									  rows={1}
									/>

									<button className="w-full text-zinc-50 font-semibold mt-10 bg-blue-600 py-2 border rounded border-blue-900 transition-all hover:bg-blue-500 duration-500 disabled:opacity-50 disabled:pointer-events-none" type="button" onClick={handleSaveChanges} disabled={isLoading}>Registrar</button>


								</form>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}