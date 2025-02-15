"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function send({ params }: { params: { username: string } }) {
	const username =params.username;
	const [content, setContent] = useState("");
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	async function verificationHandler() {
		setIsSending(true);
		try {
			const response = await axios.post("/api/sendMessage", {
				username,
				content,
			});
			if (response.data.success) {
				setMessage(response.data.message);
				toast({
					title: "messaged successful.",
					description: response.data.message,
				});
			} else {
				setMessage(response.data.message);
			}
		} catch (error: any) {
			console.log(error);
			setMessage(error.response.data.message);
		} finally {
			setIsSending(false);
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Send your message to {username}
					</h1>
					<p className="mb-4 text-3xl">
						Enter the message wants to send anonymously
					</p>
				</div>
				<Input
					placeholder="Anonymous Message"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="mb-4"
				/>

				{message && (
					<p
						className={`${message === "the message is sent successfully" ? "text-green-500" : "text-red-500"} `}
					>
						{message}
					</p>
				)}
				<Button type="submit" onClick={verificationHandler}>
					{isSending ? (
						<>
							<Loader2 className="animate-spin" />
							Sending
						</>
					) : (
						"Send"
					)}
				</Button>
			</div>
		</div>
	);
}
