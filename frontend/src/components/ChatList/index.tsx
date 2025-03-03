import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types";

interface ChatListProps {
  users: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User) => void;
  loading: boolean;
  error: any;
}

const ChatList = ({
  users,
  selectedUser,
  setSelectedUser,
  loading,
  error,
}: ChatListProps) => {
  if (loading) {
    return <Skeleton className="bg-neutral-300/40 h-screen" />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="w-1/3 bg-gray-100 p-4 border-r overflow-y-auto">
      <h2 className="text-3xl font-semibold mb-4 pl-5">Users</h2>
      <ul className="mt-9 flex flex-col gap-2">
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`flex gap-5 w-full items-center hover:bg-gray-200  py-3 px-2 rounded-lg cursor-pointer ${
              selectedUser?.id === user.id ? "bg-gray-300" : ""
            }`}
          >
            <div className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center">
              <h3>{user.name.charAt(0).toUpperCase()}</h3>
            </div>
            <span className="text-gray-700">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
