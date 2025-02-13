"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function verify() {
	const [code, setCode] = useState("");
	const [message, setMessage] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();

	const email = searchParams.get("email");

	const verificationHandler = async () => {
		setIsVerifying(true);
		try {
			const response = await axios.post("/api/verifyCode", { email, code });
			if (response.data.success) {
				setMessage(response.data.message);
				toast({
					title: "verification successful.",
					description: response.data.message,
				});
				router.replace("/signin");
			} else {
				setMessage(response.data.message);
			}
		} catch (error: any) {
			// console.log(error);
			setMessage(error.response.data.message);
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				<div className="text-center">
					<p className="mb-4 text-3xl">enter the verification code</p>
				</div>
				<Input
					type="text"
					placeholder="Verification Code"
					onChange={(e) => setCode(e.target.value)}
				/>
				{message && (
					<p
						className={`${message === "user verified successfully" ? "text-green-500" : "text-red-500"} `}
					>
						{message}
					</p>
				)}
				<Button type="submit" onClick={verificationHandler}>
					{isVerifying ? (
						<>
							<Loader2 className="animate-spin" />
							<p>Verifying</p>
						</>
					) : (
						"Verify"
					)}
				</Button>
			</div>
		</div>
	);
}
