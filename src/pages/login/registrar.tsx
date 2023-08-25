import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, ReactNode } from "react";

export default function LoginPage() {
	let presetFailedLogin = false;
	const [failedLogin, setFailedLogin] = useState(false);
	const [loginError, setLoginError] = useState("");
	const [waitingRegs, setWaitingRegs] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [isPasswordValid, setIsPasswordValid] = useState(true);
	const [isUsernameValid, setIsUsernameValid] = useState(true);

	const supabase = createClientComponentClient();

	function clearFields() {
		setEmail("");
		setPassword("");
		setUsername("");
	}

	async function handleSignUp() {
		setIsLoading(true);
		const { data, error } = await supabase.auth.signUp({ email: email, password: password, 
			options: {
				data: { 
					username: username, 
					achievements: [], 
					biography: "", 
					coins: 0,
					avatar: "/profile_default.png"
				},
				emailRedirectTo: `${location.origin}/login/auth/callback`
			} 
		});

		presetFailedLogin = error !== null;
		setFailedLogin(error !== null);
		setLoginError(String(error).replace("AuthApiError:", "").trim());

		if (!validateEmail(email) && !validatePassword(password) && !validateUsername(username)) {
			setIsEmailValid(validateEmail(email));
			setIsPasswordValid(validatePassword(password));
			setIsUsernameValid(validateUsername(username));
			presetFailedLogin = true;
			setFailedLogin(true);
			setLoginError("Fields needs current format.");
		}

		if (!presetFailedLogin) {
			setWaitingRegs(true);
			clearFields();
		}
		setIsLoading(false);
	}

	function validateEmail(input: any) {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(input);
	};

	function validatePassword(input: any) {
		const MIN_LENGTH = 8;
		const uppercasePattern = /[A-Z]/;
		const lowercasePattern = /[a-z]/;
		const numberPattern = /[0-9]/;

		return (
			uppercasePattern.test(input) &&
			lowercasePattern.test(input) &&
			numberPattern.test(input) &&
			input.length >= MIN_LENGTH
		);
	};

	function validateUsername(input: any) {
		const usernameRegex = /^[a-zA-Z0-9_\s]+$/;
		const MIN_LENGTH = 3;
		const MAX_LENGTH = 40;

		return (
			input.length >= MIN_LENGTH &&
			input.length <= MAX_LENGTH &&
			input.match(usernameRegex)
		);
	};

	function changeField(typeField: string, field: any) {
		if (typeField === "email") {
			setEmail(field.target.value);
			setIsEmailValid(validateEmail(field.target.value));
		} else if (typeField === "password") {
			setPassword(field.target.value);
			setIsPasswordValid(validatePassword(field.target.value));
		} else if (typeField === "username") {
			setUsername(field.target.value);
			setIsUsernameValid(validateUsername(field.target.value));
		}
	};

	return (
		<div className="w-full h-full flex flex-1 -mt-10">
			<div className="flex flex-col items-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 shadow-md bg-zinc-50 text-white xl:h-[100%] 2xl:h-[100vh] sm:h-[100vh]">
				<div className="flex-1 flex flex-col justify-center w-[330px] sm:w-full">
					<h2 className="text-2xl font-bold mb-4 text-zinc-700">Vamos começar!</h2>
					<p className="text-zinc-500 -mt-3">Comece a criar sua conta.</p>

					<hr className="mt-5 border-zinc-300" />

					<div className="mt-5">
						{ failedLogin &&
							<div className="w-full p-2 bg-pink-500 border rounded border-pink-800 mb-5 text-black text-center ">
								{ loginError }
							</div>
						}
						{ waitingRegs &&
							<div className="w-full p-2 bg-blue-400 border rounded border-blue-800 mb-5 text-black text-xs text-center">
								Sua conta foi criada com êxito. Cheque seu e-mail para confirmar o cadastro.
							</div>
						}
						<form>
							<label htmlFor="username" className="text-zinc-500">Nome de Usuário</label>
							<input type="text" id="username" placeholder="Usuário" className={`w-full transition-all duration-300 bg-zinc-100 rounded border shadow-sm p-2 mt-2 mb-5 focus:shadow-md outline-none  ${ !isUsernameValid ? "border-pink-500 text-pink-600 focus:border-pink-500 focus:ring-pink-500" : "focus:zinc-current focus:zinc-2 focus:border-zinc-300 focus:ring-zinc-400 border-zinc-500 text-zinc-700"} `} value={username} onChange={(e) => changeField("username", e)} autoComplete="off" minLength={3} maxLength={40} required={true} />
							{ !isUsernameValid && 
								<p className="text-xs text-pink-500 -mt-3 mb-5">
									Seu nome de usuário não condiz com os requisitos. Mínimo de 3 caracteres com o máximo de 40, não pode conter símbolos com excessão de números (0-9) e underlines (_).
								</p>
							}

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

							<button className="w-full font-semibold mt-10 bg-blue-700 py-2 border rounded border-blue-900 transition-all hover:bg-blue-500 duration-500 disabled:opacity-50 disabled:pointer-events-none" type="button" onClick={handleSignUp} disabled={isLoading}>Registrar</button>

							<p className="mt-5 text-zinc-500">
								Já possui uma conta?  <Link href="/login" className="text-zinc-700 underline">Conectar</Link>
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