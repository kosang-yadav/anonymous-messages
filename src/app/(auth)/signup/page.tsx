"use client";

import { signUpSchema } from "@/schema/signUpSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { apiResponseSchema } from "@/types/apiResponse";
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
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Signup() {
	const router = useRouter();
	const { toast } = useToast();

	// const [showPassword, setShowPassword] = useState(false);

	const [username, setUsername] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [usernameMessage, setUsernameMessage] = useState("");
	const debounced = useDebounceCallback(setUsername, 1000);

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsername = async () => {
			if (username) {
				// console.log("checking username");
				setIsCheckingUsername(true);
				setUsernameMessage("");
				try {
					const response = await axios.get(
						`/api/uniqueUsername?username=${username}`
					);
					// console.log(response);
					setUsernameMessage(response.data?.message);
					// console.log(usernameMessage);
				} catch (error) {
					const err = error as AxiosError<apiResponseSchema>;
					setUsernameMessage(
						err.response?.data.message ?? "please check your network connection"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};
		checkUsername();
	}, [username]);

	async function onSubmit(data: z.infer<typeof signUpSchema>) {
		setIsSubmitting(true);

		try {
			const response = await axios.post("/api/signup", data);

			// console.log(response);

			toast({
				title: "success",
				description: response.data.message,
			});

			if (response.data.success) router.replace(`/verify/${data.email}`);

			setIsSubmitting(false);
		} catch (error) {
			const axiosError = error as AxiosError<apiResponseSchema>;
			const errorMsg =
				axiosError.response?.data.message ??
				"something went wrong while registration";

			toast({
				title: "sign up failed",
				description: errorMsg,
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
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value);
												// console.log(username);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isCheckingUsername && <Loader2 className="animate-spin" />}
						{usernameMessage && (
							<p
								className={`text-md ${
									usernameMessage === username + " is unique."
										? "text-green-500"
										: "text-red-600"
								}`}
							>
								{usernameMessage}
							</p>
						)}
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} name="email" />
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
										<Input type="password" {...field} name="password" />
										{/* <i><Eye/></i> */}
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
						Already a member?{" "}
						<Link href="/login" className="text-blue-600 hover:text-blue-800">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
