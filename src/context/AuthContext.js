import { createContext, useContext, useEffect, useState } from "react";
import supabase from "@/supabase.js";

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		(async () => {
			const session = await supabase.auth.getUser();
			setUser(session.data.user);
		})();
	}, []);

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