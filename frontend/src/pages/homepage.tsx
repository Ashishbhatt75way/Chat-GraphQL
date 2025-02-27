import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col justify-center items-center text-white">
      <motion.h1
        className="text-7xl font-extrabold drop-shadow-lg mb-4 text-neutral-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to ChatApp
      </motion.h1>

      <motion.p
        className="text-lg mb-8 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Connect, chat, and make new friends instantly.
      </motion.p>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => navigate("/chat")}
          className="px-12 py-5 text-lg font-semibold bg-neutral-800  text-neutral-200 rounded-full shadow-lg hover:bg-neutral-700 transition"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
};

export default Homepage;
