import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/model/user.model";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

type MessageCardProps = {
	message: Message;
	onDeleteMessage: (messageId: string) => void;
};

export const messageCard = ({ message, onDeleteMessage }: MessageCardProps) => {
	const { toast } = useToast();
	const deleteMessage = async () => {
		try {
			const response = await axios.delete(`/api/deleteMessage/${message._id}`);

			if (response.data.success) {
				toast({
					title: "success",
					description: response.data.message,
				});
				onDeleteMessage(message._id as string);
			}
		} catch (error) {
			toast({
				title: "deletion failed",
				description: "something went wrong while deleting message",
				variant: "destructive",
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button variant="destructive">Show Dialog</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete this
							message and remove the message from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => deleteMessage()}>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
	);
};
