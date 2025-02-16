"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { messageSchema } from "@/schema/messageSchema";
import { apiResponseSchema } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function sendMessage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const param = use(params);
	const [suggestions, setSuggestions] = useState([
		"What experiences in your life have shaped your understanding of trust?",
		"How do you believe your past choices define your present self?",
		"In what ways do you think vulnerability can strengthen interpersonal relationships?",
	]);
	const [message, setMessage] = useState("");
	const [suggestMessage, setSuggestMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [isSuggesting, setIsSuggesting] = useState(false);

	// console.log(param.username);
	// console.log(suggestMessage);
	// console.log(suggestions);

	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: "",
			createdAt: new Date(),
		},
	});
	async function messageSender(data: z.infer<typeof messageSchema>) {
		setMessage("");
		setIsSending(true);
		try {
			// console.log(param.username, data.content);
			const response = await axios.post("../../api/sendMessage", {
				username: param.username,
				content: data.content,
			});
			// console.log(response);
			if (response.data.success) {
				setMessage(response.data.message + ` to ${param.username}.`);
				toast({
					title: `messaged successfully to ${param.username}.`,
					description: response.data.message + ` to ${param.username}`,
				});
			} else {
				setMessage(response.data.message);
			}
		} catch (error: any) {
			console.log(error);
			const err = error as AxiosError<apiResponseSchema>;
			toast({
				title: "failed",
				description:
					(err.response?.data.message || error.message) === "Network Error"
						? "failed to send message, please check your internet connection"
						: err.response?.data.message || error.message,
				variant: "destructive",
			});
			setMessage(
				(err.response?.data.message || error.message) === "Network Error"
					? "failed to send messages, please check your internet connection"
					: err.response?.data.message || error.message
			);
		} finally {
			setIsSending(false);
		}
	}

	async function messageSuggester() {
		setSuggestMessage("");
		setIsSuggesting(true);
		try {
			const response = await axios.get("../../api/suggestMessages");

			// console.log(response.data.questions);
			// console.log(response.data.questions.split(" || "));

			setSuggestMessage(response.data.message);

			if (response.data.success && response.data.questions) {
				setSuggestions(response.data.questions.split(" || "));
				toast({
					title: "success",
					description: response.data.message,
				});
			} else if (response.data.success) {
				toast({
					title: "pending",
					description: response.data.message ?? "something went wrong",
				});
				setSuggestMessage(response.data.message);
			} else {
				toast({
					title: "failed",
					description: response.data.message ?? "something went wrong",
					variant: "destructive",
				});
				setSuggestMessage(response.data.message);
			}
		} catch (error: any) {
			console.log(error);
			const err = error as AxiosError<apiResponseSchema>;
			toast({
				title: "failed",
				description:
					(err.response?.data?.message || error.message) ??
					"failed to suggest messages, please check your network connection",
				variant: "destructive",
			});
			setSuggestMessage(err?.response?.data.message || error.message);
		} finally {
			setIsSuggesting(false);
		}
	}

	return (
		<>
			<main className="  mt-10 mx-10 md:mx-32 lg:mx-40 ">
				<section className="flex flex-col items-center ">
					<h1 className="text-4xl font-extrabold text-center tracking-tight lg:text-6xl my-10">
						Public Profile Link
					</h1>
					<h2 className="self-start">
						Send your anonymous message to
						<span className="font-extrabold"> @{param.username}</span>
					</h2>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(messageSender)}
							className="space-y-8 w-full"
						>
							<FormField
								name="content"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												placeholder="Anonymous Message"
												value={form.getValues("content")}
												className="mb-4 mt-2 h-16"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{message && (
								<p
									className={`${message === `the message is sent successfully to ${param.username}.` ? "text-green-500" : "text-red-500"} `}
								>
									{message}
								</p>
							)}
							<div className="flex flex-col">
								<Button type="submit" className="self-center">
									{isSending ? (
										<>
											<Loader2 className="animate-spin" />
											Sending
										</>
									) : (
										"Send it"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</section>
				<section className="flex flex-col">
					<Button
						className="my-8 sm:my-3 self-center sm:self-start"
						onClick={messageSuggester}
					>
						{isSuggesting ? (
							<>
								<Loader2 className="animate-spin" />
								Suggesting Messages
							</>
						) : (
							"Suggest Messages"
						)}
					</Button>
					{suggestMessage && (
						<p
							className={`${suggestMessage === `messages suggested successfully.` ? "text-green-500" : "text-red-500"}`}
						>
							{suggestMessage}
						</p>
					)}
					<h2 className="my-3">Click on any message below to select it.</h2>
					<div className="flex flex-col gap-6 shadow-md rounded-lg border	 pt-4 p-8">
						<h1 className=" text-2xl font-bold">Messages</h1>
						<div className="flex  flex-col items-center gap-6">
							{suggestions.map((suggestion, index) => {
								return (
									<Button
										type="button"
										key={index}
										onClick={() => form.setValue("content", suggestion)}
										className="shadow-md rounded-lg bg-white hover:bg-gray-100 text-black border h-fit w-full text-wrap"
									>
										{suggestion}
									</Button>
								);
							})}
						</div>
						{/* <Button className="shadow-md rounded-lg bg-white hover:bg-gray-100 text-black border">
							{suggestions[0]}
						</Button>
						<Button className="shadow-md rounded-lg border	 hover:bg-gray-100 bg-white text-black">
							{suggestions[1]}
						</Button>
						<Button className="shadow-md rounded-lg border	 hover:bg-gray-100 bg-white text-black">
							{suggestions[2]}
						</Button> */}
					</div>
				</section>
			</main>
			<footer className=" mx-30 sm:mx-40 my-16 flex flex-col items-center">
				<div className=" flex flex-col gap-5">
					<h2 className="text-center">Get Your Message Board</h2>
					<Link href={"../signup"} className="self-center">
						<Button>Create Your Account</Button>
					</Link>
				</div>
			</footer>
		</>
	);
}
