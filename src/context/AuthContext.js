import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/supabase.js";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

async function RemoveAccountItems() {
	await supabase.auth.signOut();
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	(async () => {
		const session = await supabase.auth.getUser();
		if (!user) {
			console.log("Oi");
			if (session.data.user === null)
				await RemoveAccountItems();

			setUser(session.data.user);
		}
	})();

	const signOut = () => {
		(async () => {
			await supabase.auth.signOut();
		})();
	}

	const userAsync = async () => {
		return await supabase.auth.getUser();
	}

	const signOutAsync = async () => {
		return await supabase.auth.signOut();
	}

	const value = { user, userAsync, signOut, signOutAsync };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}