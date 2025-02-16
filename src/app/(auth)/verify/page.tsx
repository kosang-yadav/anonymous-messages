"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { codeVerificationSchema } from "@/schema/codeVerificationSchema";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { apiResponseSchema } from "@/types/apiResponse";

export default function verify() {
	const [message, setMessage] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);

	const router = useRouter();

	const searchParams = useSearchParams();
	const email = searchParams.get("email");

	const form = useForm<z.infer<typeof codeVerificationSchema>>({
		resolver: zodResolver(codeVerificationSchema),
		defaultValues: {
			code: "",
		},
	});

	async function verificationHandler(
		data: z.infer<typeof codeVerificationSchema>
	) {
		setIsVerifying(true);
		try {
			const response = await axios.post("/api/verifyCode", {
				email,
				code: data.code,
			});
			if (response.data.success) {
				setMessage(response.data.message);
				toast({
					title: "verification successful.",
					description: response.data.message,
				});
				router.replace("/login");
			} else {
				setMessage(response.data.message);
			}
		} catch (error: any) {
			console.log(error);
			const err = error as AxiosError<apiResponseSchema>;
			toast({
				title: "failed",
				description:
					(err.response?.data.message || error.message) ??
					"failed to fetch messages, please check your network connection",
				variant: "destructive",
			});
			setMessage(err?.message);
		} finally {
			setIsVerifying(false);
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Verify your email
					</h1>
					<p className="mb-4 text-3xl">
						Enter the verification code sent to your email
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(verificationHandler)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Code</FormLabel>
									<FormControl>
										<Input placeholder="Verification Code" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{message && (
							<p
								className={`${message === "user verified successfully" ? "text-green-500" : "text-red-500"} `}
							>
								{message}
							</p>
						)}
						<Button type="submit">
							{isVerifying ? (
								<>
									<Loader2 className="animate-spin" />
									Verifying
								</>
							) : (
								"Verify"
							)}
						</Button>
					</form>
				</Form>
				<div className="text-center mt-4">
					<p>
						code is expired?{" "}
						<Link href="/signup" className="text-blue-600 hover:text-blue-800">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
