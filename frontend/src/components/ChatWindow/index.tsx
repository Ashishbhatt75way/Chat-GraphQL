import { Skeleton } from "@/components/ui/skeleton";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";

interface ChatWindowProps {
  selectedUser: any;
  messages: any[];
  messagesLoading: boolean;
  userData: any;
  handleSubmit: UseFormHandleSubmit<{ message: string }>;
  register: UseFormRegister<{ message: string }>;
  sendMessageHandler: (data: { message: string }) => void;
  sendingMessage: boolean;
  errors: FieldErrors<{ message: string }>;
}

const ChatWindow = ({
  selectedUser,
  messages,
  messagesLoading,
  userData,
  handleSubmit,
  register,
  sendMessageHandler,
  sendingMessage,
  errors,
}: ChatWindowProps) => {
  if (!selectedUser) {
    return (
      <div className="w-2/3 flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col">
      <div className="p-4 bg-white shadow flex gap-2 items-center border-b">
        <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
          <h3>{selectedUser.name.charAt(0).toUpperCase()}</h3>
        </div>
        <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messagesLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 flex gap-2 py-3 px-5 bg-neutral-300/80 w-fit rounded-xl items-center ${
                message.sender.id === userData?.id ? "ml-auto" : "mr-auto"
              }`}
            >
              {message.sender.id !== userData?.id && (
                <span className="font-semibold h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="flex flex-col">{message.content}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            Start chatting with {selectedUser.name}...
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(sendMessageHandler)}
        className="p-4 bg-white border-t flex items-center gap-2"
      >
        <input
          type="text"
          {...register("message")}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50"
          disabled={sendingMessage}
        >
          {sendingMessage ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
