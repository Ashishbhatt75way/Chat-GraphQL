import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/store";

function Basic() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="navbar p-5 w-full text-slate-300 border-b-[1px] fixed z-[100] border-[#fff]/20">
        <div className="flex items-center justify-between mx-auto px-20">
          <button className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-bold">Chit-Chat</span>
          </button>
          <div className="flex gap-4">
            <button
              className="text-white bg-neutral-800 rounded-full px-8 py-2"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>

            <button
              className="text-white bg-neutral-800 rounded-full px-8 py-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Basic;
