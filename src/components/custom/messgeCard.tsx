import dayjs from "dayjs";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { X, Clipboard } from "lucide-react";
import { apiResponseSchema } from "@/types/apiResponse";

type MessageCardProps = {
  message: Message;
  onDeleteMessage: (messageId: string) => void;
  className?: string;
};

export const MessageCard = ({ message, onDeleteMessage }: MessageCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "URL copied!",
      description: "your profile link has been copied to clipboard",
    });
  };

  const deleteMessage = async () => {
    try {
      // const response = await axios.delete(`/api/deleteMessage/${message._id}`);
      const response = await axios.delete("/api/deleteMessage", {
        data: { messageId: message._id },
      });

      if (response.data.success) {
        toast({
          title: "success",
          description: response.data.message,
        });
        onDeleteMessage(message._id as string);
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponseSchema>;
      toast({
        title: "deletion failed",
        description:
          axiosError.response?.data.message ??
          "something went wrong while deleting message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-bordered ">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
          <CardTitle>
            <pre className=" text-wrap text-sm md:text-lg lg:text-xl">
              {message.content}
            </pre>
          </CardTitle>
          <div className="flex float-end gap-2">
            <Button
              variant="ghost"
              className="bg-green-600"
              onClick={() => copyToClipboard(message.content)}
            >
              <Clipboard />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600">
                  <X />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message and remove the message from our servers.
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
          </div>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
    </Card>
  );
};
