"use client";

import { signInSchema } from "@/schema/signInSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Signin() {
	const router = useRouter();
	const { toast } = useToast();

	const [showPassword, setShowPassword] = useState(false);

	const [passwordMsg, setpasswordMsg] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	useEffect(() => {
		console.log(window.location.href);
		console.log(window.location.pathname);
	},[isSubmitting])

	async function onSubmit(data: z.infer<typeof signInSchema>) {
		setIsSubmitting(true);
		setpasswordMsg("");

		try {
			const response = await signIn("credentials", {
				...data,
				redirect: false,
			});

			// console.log(response);

			if (response?.error) {
				setpasswordMsg(response.error.replace("Error: ", ""));
				toast({
					title: "sign in failed",
					description: response.error,
					variant: "destructive",
				});
			}

			if (response?.url) {
				toast({
					title: "success",
					description: "sign in succesfully",
				});
				router.push(`/dashboard`);
			}

			setIsSubmitting(false);
		} catch (error) {
			console.log(error);
			toast({
				title: "sign in failed",
				description: "something went wrong while signing in",
				variant: "destructive",
			});

			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join to message anonymously
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							name="identifier"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username / Email</FormLabel>
									<FormControl>
										<Input {...field} name="identifier" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<div>
											<Input
												type={showPassword ? "text" : "password"}
												{...field}
												name="password"
											/>
											<Eye onClick={() => setShowPassword(!showPassword)} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{passwordMsg && <p className="text-red-600">{passwordMsg}</p>}
						<Button type="submit">
							{isSubmitting ? (
								<>
									<Loader2 className="animate-spin" />
									<p>Submitting</p>
								</>
							) : (
								"Submit"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						Not a member?{" "}
						<Link href="/signup" className="text-blue-600 hover:text-blue-800">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
