"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import { Button } from "../ui/button";
import Link from "next/link";

export const Navbar = () => {
	const { data: session } = useSession();

	// also worked without desturturing user
	const user = session?.user as User;

	return (
		<nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
			<div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
				<a href="#" className="text-xl font-bold mb-4 md:mb-0">
					anonymous messages
				</a>
				<span>Welcome back, <span className="font-bold text-xl">{user?.username || session?.user?.email || "friend"}</span></span>
				{session ? (
					<Button
						onClick={() => signOut()}
						className="w-full sm:w-auto bg-slate-100 text-black text-md"
						variant="outline"
					>
						LogOut
					</Button>
				) : (
					<Link href={"./login"}>
						<Button
							className="w-full sm:w-auto bg-slate-100 text-black"
							variant={"outline"}
						>
							LogIn
						</Button>
					</Link>
				)}
			</div>
		</nav>
	);
};
