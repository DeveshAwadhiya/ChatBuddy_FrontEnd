import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
          {authUser?.isAdmin && (
            <div className="p-4 border-t border-base-300 bg-base-100 text-center">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="btn btn-sm btn-primary"
              >
                View Admin Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;
