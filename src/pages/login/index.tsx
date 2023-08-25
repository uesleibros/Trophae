import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, ReactNode } from "react";

export default function LoginPage() {
	let presetFailedLogin = false;
	const [failedLogin, setFailedLogin] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [isPasswordValid, setIsPasswordValid] = useState(true);

	const supabase = createClientComponentClient();

	async function handleSignIn() {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

		presetFailedLogin = error !== null;
		setFailedLogin(error !== null);
		setLoginError(String(error).replace("AuthApiError:", "").trim());
		setIsLoading(false);

		if (!validateEmail(email) && !validatePassword(password)) {
			setIsEmailValid(validateEmail(email));
			setIsPasswordValid(validatePassword(password));
			setIsLoading(false);
			setFailedLogin(true);
			presetFailedLogin = true;
			setLoginError("Fields needs current format.");
			return;
		}

		if (!presetFailedLogin)
			router.push("/");
		
		setIsLoading(false);
	}

	async function handleDiscordSignIn() {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signInWithOAuth({
		   provider: "discord"
		});

		console.log(data);

		setFailedLogin(error !== null);
		setLoginError(String(error).replace("AuthApiError:", "").trim());
		setIsLoading(false);
	}

	function validateEmail(input: string) {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(input);
	}

	function validatePassword(input: string) {
		const uppercasePattern = /[A-Z]/;
		const lowercasePattern = /[a-z]/;
		const numberPattern = /[0-9]/;

		return (
			uppercasePattern.test(input) &&
			lowercasePattern.test(input) &&
			numberPattern.test(input) &&
			input.length >= 8
		);
	}

	function changeField(typeField: string, field: any) {
		if (typeField === "email") {
			setEmail(field.target.value);
			setIsEmailValid(validateEmail(field.target.value));
		} else if (typeField === "password") {
			setPassword(field.target.value);
			setIsPasswordValid(validatePassword(field.target.value));
		}
	}

	return (
		<div className="w-full h-full flex flex-1 -mt-10">
			<div className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 shadow-md bg-zinc-50 text-white xl:h-[100%] 2xl:h-[100vh] sm:h-[100vh]">
				<div className="flex-1 flex flex-col justify-center w-[330px] sm:w-full">
					<h2 className="text-2xl font-bold mb-4 text-zinc-700">Bem-vindo de volta!</h2>
					<p className="text-zinc-500 -mt-3">Entrar em sua conta.</p>

					{/*
						<div onClick={handleDiscordSignIn} className="bg-zinc-200 flex items-center justify-center text-center gap-4 text-zinc-700 mt-5 py-2 rounded border border-zinc-400 transition-colors hover:bg-zinc-100 cursor-pointer select-none font-semibold text-sm">
							<Image src="/logos/discord.png" height={20} width={20} alt="Discord Logo" />
							<span>Conectar com o Discord</span>
						</div>
					*/}

					<hr className="mt-5 border-zinc-300" />

					<div className="mt-5">
						{ failedLogin &&
							<div className="w-full p-2 bg-pink-500 border rounded border-pink-800 mb-5 text-black text-center">
								{ loginError }
							</div>
						}
						<form>
							<label htmlFor="email" className="text-zinc-500">E-Mail</label>
							<input type="email" id="email" placeholder="seuemail@gmail.com" className={`w-full transition-all duration-300 bg-zinc-100 rounded border shadow-sm p-2 mt-2 mb-5 focus:shadow-md outline-none  ${ !isEmailValid ? "border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500" : "focus:zinc-current focus:zinc-2 focus:border-zinc-300 focus:ring-zinc-400 border-zinc-500 text-zinc-700"} `} value={email} onChange={(e) => changeField("email", e)} autoComplete="off" required={true} />
      					{ !isEmailValid && 
      						<p className="text-xs text-pink-500 -mt-3 mb-5">
      							Seu e-mail está mal formatado. Exemplo: seunome@serviço.com
      						</p>
      					}

							<label htmlFor="password" className="text-zinc-500">Senha</label>
							<input type="password" id="password" placeholder="******" className={`w-full transition-all duration-300 bg-zinc-100 rounded border shadow-sm p-2 mt-2 mb-5 focus:shadow-md outline-none  ${ !isPasswordValid ? "border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500" : "focus:zinc-current focus:zinc-2 focus:border-zinc-300 focus:ring-zinc-400 border-zinc-500 text-zinc-700"} `} value={password} onChange={(e) => changeField("password", e)} autoComplete="current-password" required={true} minLength={8} />
							{ !isPasswordValid && 
								<p className="text-xs text-pink-500 -mt-3">
									A senha não condiz com os requisitos. Mínimo de 8 caracteres, letras maiúsculas e minúsculas (A-Za-z) e números (0-9).
								</p>
							}

							<button className="w-full font-semibold mt-10 bg-blue-700 py-2 border rounded border-blue-900 transition-all hover:bg-blue-600 duration-500 disabled:opacity-50 disabled:pointer-events-none" type="button" onClick={handleSignIn} disabled={isLoading}>Conectar</button>

							<p className="mt-5 text-zinc-500">
								Não possui uma conta?  <Link href="/login/registrar" className="text-zinc-700 underline">Crie uma conta</Link>
							</p>

							<p className="mt-5 text-zinc-500 text-xs">
								Continuando você vai concordar com os termos de serviço e política de privacidade. Um dia eu crio todas essas baboseiras mas por enquanto desfrute do que tem ao seu alcance, tu tem o pão, faca e o queijo na mão mano.
							</p>
						</form>
					</div>
				</div>
			</div>
			<aside className="flex-col items-center justify-center flex-1 flex-shrink hidden basis-1/4 md:flex">
				<div className="relative flex flex-col w-full h-full">
					<img className="w-full h-full select-none pointer-events-none" src="/arts/wallpaper.gif" />
				</div>
			</aside>
		</div>
	)
}