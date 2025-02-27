import { Route, Routes } from "react-router-dom";
import AuthanticatedLayout from "./layouts/Authenticated";
import BasicLayout from "./layouts/Basic";
import Home from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import ChatUsers from "./components/Chat";

function App() {
  return (
    <Routes>
      <Route element={<AuthanticatedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatUsers />} />
      </Route>

      <Route element={<BasicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
