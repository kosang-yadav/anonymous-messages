"use client";

import { MessageCard } from "@/components/custom/messgeCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/user.model";
import { acceptMessageSchema } from "@/schema/acceptMessageSchema";
import { apiResponseSchema } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Dashboard() {
	const [settingAcceptingMsgs, setSettingAcceptingMsgs] = useState(false);
	const [fetchingMessages, setFetchingMessages] = useState(false);

	const [messages, setMessages] = useState([]);
	const [baseUrl, setBaseUrl] = useState("");

	const { toast } = useToast();
	const { data: session } = useSession();

	const onDeleteMessage = async (messageId: string) => {
		// console.log(messageId);
		setMessages(messages.filter((msg: Message) => msg._id !== messageId));
		toast({
			title: "success",
			description: "message deleted successfully",
		});
	};
	const form = useForm<z.infer<typeof acceptMessageSchema>>({
		resolver: zodResolver(acceptMessageSchema),
	});

	const { register, watch, setValue } = form;

	const acceptMessages = watch("acceptMessages");

	const getAcceptingMsgs = useCallback(async () => {
		setSettingAcceptingMsgs(true);
		try {
			const response = await axios.get("/api/acceptingMessages");

			if (!response.data.success)
				toast({
					title: "failed",
					description:
						response?.data.message ?? "please check your network connection",
				});

			setValue("acceptMessages", response.data.acceptingMessages);
		} catch (error: any) {
			const err = error as AxiosError<apiResponseSchema>;
			toast({
				title: "failed",
				description:
					(err.response?.data.message || error.message) ??
					"failed to fetch message acceptance status",
				variant: "destructive",
			});
		} finally {
			setSettingAcceptingMsgs(false);
		}
	}, [setValue]);
	const fetchMessages = useCallback(
		async (refresh: boolean = false) => {
			setFetchingMessages(true);
			setSettingAcceptingMsgs(false);
			try {
				const response = await axios.get("/api/getMessages");

				if (!response.data.success)
					toast({
						title: "failed",
						description:
							response?.data.message ??
							"failed to fetch messages, please try again",
					});

				if (refresh) {
					toast({
						title: "refreshed",
						description: "displaying updated messages",
					});
				}

				setMessages(response.data.messages);
			} catch (error: any) {
				const err = error as AxiosError<apiResponseSchema>;
				toast({
					title: "failed",
					description:
						(err.response?.data.message || error.message) == "Network Error"
							? "failed to fetch messages, please check your internet connection"
							: err.response?.data.message || error.message,
					variant: "destructive",
				});
			} finally {
				setFetchingMessages(false);
				setSettingAcceptingMsgs(false);
			}
		},
		[messages, setMessages]
	);

	useEffect(() => {
		if (!session || !session.user) return;

		setBaseUrl(`${window.location.protocol}//${window.location.host}`);

		getAcceptingMsgs();
		fetchMessages();
	}, [session, setValue, getAcceptingMsgs]);

	const switchAcceptingMsgs = async () => {
		setSettingAcceptingMsgs(true);

		try {
			const response = await axios.post("/api/acceptingMessages", {
				acceptsMessage: !acceptMessages,
			});

			setValue("acceptMessages", !acceptMessages);

			if (!response.data.success)
				toast({
					title: "failed",
					description:
						response?.data.message ??
						" failed to update message acceptance status, please check your network connection ",
				});

			toast({
				title: "success",
				description:
					response?.data.message ??
					"message acceptance status updated successfully",
			});
		} catch (error: any) {
			const err = error as AxiosError<apiResponseSchema>;
			toast({
				title: "failed",
				description:
					(err.response?.data.message || error.message) ??
					"failed to fetch messages, please check your network connection",
			});
		} finally {
			setSettingAcceptingMsgs(false);
		}
	};

	// console.log(session);
	// console.log(session?.user);
	// console.log(session?.user.username);
	const URL = `${baseUrl}/kb/${session?.user.username}`;
	// console.log(URL);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(URL);
		toast({
			title: "URL copied!",
			description: "your profile link has been copied to clipboard",
		});
	};

	return (
		<div className="my-8 mx-4 md:mx-auto p-6 bg-white rounded w-full max-w-6xl">
			<h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
			<div className="mb-4">
				<h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
				<div className="flex items-center">
					<input
						type="text"
						disabled
						value={URL}
						className="input input-bordered w-full p-2 mr-2 w-full"
					/>
					<button
						onClick={copyToClipboard}
						className="shadow-md rounded-lg bg-blue-500 hover:bg-blue-700 text-white border p-3 text-wrap"
					>
						Copy
					</button>
				</div>
			</div>
			<div className="mb-4">
				<Switch
					{...register("acceptMessages")}
					id="AcceptMessages"
					checked={acceptMessages}
					onCheckedChange={switchAcceptingMsgs}
					disabled={settingAcceptingMsgs}
				/>
				<span className="ml-2 px-2">
					Accept Messages : {acceptMessages ? "On" : "Off"}
				</span>
			</div>
			<Separator />
			<Button
				className="mt-4"
				variant="outline"
				onClick={(e) => {
					e.preventDefault();
					fetchMessages(true);
				}}
			>
				{fetchingMessages ? (
					<Loader2 className=" h-4 w-4 animate-spin" />
				) : (
					<RefreshCcw className=" h-4 w-4" />
				)}
			</Button>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
				{messages?.length > 0 ? (
					messages.map((message: Message) => (
						// console.log(message),
						<MessageCard
							key={message._id as string}
							message={message}
							onDeleteMessage={onDeleteMessage}
							// className=" w-full md:w-1/2 "
						/>
					))
				) : (
					<h1>No Messages to display...</h1>
				)}
			</div>
		</div>
	);
}
