import { CREATE_MESSAGE_MUTATION, GET_ME, GET_USERS } from "@/graphQL/graphql";
import { User } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const ChatUsers = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { loading, error, data } = useQuery(GET_USERS);
  const { data: user } = useQuery(GET_ME);
  const [userData, setUserData] = useState<User | null>(null);

  const messageSchema = yup.object().shape({
    message: yup.string().trim().required("Message is required"),
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(
    CREATE_MESSAGE_MUTATION
  );

  type FormData = yup.InferType<typeof messageSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(messageSchema),
  });

  const sendMessageHandler = async (formData: FormData) => {
    if (!selectedUser) {
      toast.error("Please select a user before sending a message.");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    console.log("Sender ID:", userData?.id);
    console.log("Receiver ID:", selectedUser?.id);
    console.log("Message Content:", formData.message);

    try {
      const { data } = await sendMessage({
        variables: {
          sender: userData?.id,
          receiver: selectedUser?.id,
          content: formData.message,
        },
      });

      if (data) {
        toast.success("Message sent successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message.");
    }
  };

  useEffect(() => {
    if (data?.users?.length > 0) {
      console.log("Fetched Users:", data.users);
    }

    setUserData(user?.me);
  }, [data, user]);

  if (loading) return <div className="p-6 text-gray-500">Loading users...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex h-screen pt-20">
      <div className="w-1/3 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-3xl font-semibold mb-4 pl-5">Users</h2>
        <ul className="mt-9 flex flex-col gap-2">
          {data?.users?.map((user: any) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex gap-5 w-full items-center hover:bg-gray-200 py-3 px-2 rounded-lg cursor-pointer"
            >
              <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
                <h3>{user.name.charAt(0).toUpperCase()}</h3>
              </div>
              <span className="text-gray-700">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 flex flex-col">
        {selectedUser ? (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-white shadow flex gap-2 items-center border-b">
              <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
                <h3>{selectedUser.name.charAt(0).toUpperCase()}</h3>
              </div>
              <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <p className="text-gray-500">
                Start chatting with {selectedUser.name}...
              </p>
            </div>

            <form
              onSubmit={handleSubmit(sendMessageHandler)}
              className="p-4 bg-white border-t flex items-center gap-2"
            >
              <input
                type="text"
                {...register("message")}
                placeholder="Type a message..."
                className={`flex-1 p-2 border rounded-lg outline-none ${
                  errors.message ? "border-red-500" : ""
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 text-white rounded-lg disabled:opacity-50"
                disabled={sendingMessage}
              >
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </form>

            {/* Error message display */}
            {errors.message && (
              <p className="text-red-500 text-sm px-4">
                {errors.message.message}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUsers;
