import { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Authanticated() {
  const isAuthenticated = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <>
      <nav className="py-5 w-full bg-neutral-50 text-black border-b-[1px] fixed z-[100] border-[#fff]/20">
        <div className="flex items-center justify-between mx-auto max-w-[1100px] w-full px-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center font-bold gap-2  cursor-pointer"
          >
            Chit-Chat
          </button>

          <div className="flex gap-10 items-center font-medium tracking-wide leading-6 justify-center">
            <NavLink to={"/"} className="relative font-bold">
              Home
            </NavLink>
            <NavLink to={"/chat"} className="relative  font-bold">
              Chats
            </NavLink>
          </div>

          <div className="flex gap-4">
            <button
              className="text-white bg-neutral-800 rounded-lg px-6 py-2"
              onClick={async () => {
                logoutHandler(), navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
