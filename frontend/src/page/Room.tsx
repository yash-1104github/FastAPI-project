import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "../components/features/editors";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(id ?? null);

  useEffect(() => {
    if (!id) {
      navigate("/");
    } else {
      setRoomId(id);
    }
  }, [id]);

  function exitRoom() {
    setRoomId(null);
    navigate("/");
  }

  return (
     <div className="min-h-screen w-full bg-black text-white flex flex-col">

      <div className="fixed top-0 w-full bg-gradient-to-r from-purple-900/40 via-black to-purple-900/40 backdrop-blur-lg border-b border-gray-800 px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-purple-400">CodeBuddy</span>
        </div>

        <div className="text-gray-300 text-lg">Room ID: 
          <span className="ml-2 text-purple-500 font-semibold">{roomId}</span>
        </div>

        <Button
          onClick={exitRoom}
          className="bg-pink-600 px-6 py-2 rounded-xl"
        >
          Exit Room
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center w-full mx-auto mt-6">
          {roomId && <Editor roomId={roomId} />}
      </div>

      <div className="py-6 mt-10 border-t border-gray-800 w-full text-center text-gray-600">
        Coding live with your buddy 
      </div>
    </div>
  );
}