import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Skeleton } from "@/components/ui/skeleton";
import { addMessage } from "@/store/reducers/chatReducer";
import { User } from "@/types";
import {
  GET_USERS,
  GET_ME,
  GET_MESSAGES_QUERY,
  CREATE_MESSAGE_MUTATION,
} from "@/graphQL/graphql";

const ChatList = lazy(() => import("../ChatList"));
const ChatWindow = lazy(() => import("../ChatWindow"));

const messageSchema = yup.object().shape({
  message: yup.string().trim().required("Message is required"),
});

const ChatUsers = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const dispatch = useDispatch();

  const { loading: usersLoading, error, data: usersData } = useQuery(GET_USERS);
  const { data: userData } = useQuery(GET_ME);
  const { data: messagesData, loading: messagesLoading } = useQuery(
    GET_MESSAGES_QUERY,
    {
      variables: { receiverId: selectedUser?.id },
      skip: !selectedUser,
    }
  );

  const [sendMessage, { loading: sendingMessage }] = useMutation(
    CREATE_MESSAGE_MUTATION
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ message: string }>({
    resolver: yupResolver(messageSchema),
  });

  const sendMessageHandler = async ({ message }: { message: string }) => {
    if (!selectedUser) {
      toast.error("Please select a user before sending a message.");
      return;
    }

    try {
      const { data } = await sendMessage({
        variables: { receiverId: selectedUser.id, content: message },
      });

      if (data) {
        toast.success("Message sent successfully!");
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.createMessage.id,
            content: data.createMessage.content,
            sender: data.createMessage.sender,
            receiver: data.createMessage.receiver,
          },
        ]);
        reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message.");
    }
  };

  useEffect(() => {
    if (messagesData?.getMessages) {
      setMessages(messagesData.getMessages);
    }
    dispatch(addMessage(messagesData?.getMessages));
  }, [messagesData]);

  const filteredUsers = useMemo(
    () =>
      usersData?.users?.filter((user: User) => user.id !== userData?.me?.id) ||
      [],
    [usersData, userData]
  );

  return (
    <div className="flex h-screen pt-20">
      <Suspense
        fallback={<Skeleton className="w-1/3 h-screen bg-neutral-400/50 p-4" />}
      >
        <ChatList
          users={filteredUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          loading={usersLoading}
          error={error}
        />
      </Suspense>

      <Suspense
        fallback={<Skeleton className="w-2/3 h-screen bg-neutral-200" />}
      >
        <ChatWindow
          selectedUser={selectedUser}
          messages={messages || []}
          messagesLoading={messagesLoading}
          userData={userData?.me}
          handleSubmit={handleSubmit}
          register={register}
          sendMessageHandler={sendMessageHandler}
          sendingMessage={sendingMessage}
          errors={errors}
        />
      </Suspense>
    </div>
  );
};

export default ChatUsers;
