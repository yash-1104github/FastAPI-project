import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Users, Zap, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function Landing() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  async function createRoom() {
    const res = await fetch(`${API_URL}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log("data", data);
    navigate(`/room/${data.roomId}`);
  }

  function joinRoom() {
    if (!input) return;
    navigate(`/room/${input}`);
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col">

        <div className="fixed top-0 w-full bg-black/60 backdrop-blur-lg border-b border-gray-800 z-50">
          <div className="px-6 md:px-12 py-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <a href="/" className="text-xl font-bold text-purple-400">
                CodeBuddy
              </a>
            </div>

            <nav className="hidden md:flex gap-6 text-gray-400 text-sm">
              <a className="hover:text-purple-400 cursor-pointer">Features</a>
              <a className="hover:text-purple-400 cursor-pointer">
                How it Works
              </a>
            </nav>
          </div>
        </div>

        <div className="w-full text-center mt-40 space-y-6 px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold">
            Code Together, <span className="text-purple-500">Build Faster</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            CodeBuddy is a platform where you can code live with your buddy in
            real time with no delay.
          </p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-8 max-w-4xl mx-auto w-full">
            <Card className="p-6 bg-black/40 border border-gray-800 rounded-2xl">
              <h3 className="text-2xl font-bold mb-3 text-purple-400">
                Create Room
              </h3>
              <Button
                onClick={createRoom}
                className="w-full bg-purple-600 rounded-xl py-6"
              >
                Create Room <ArrowRight className="ml-2 w-5" />
              </Button>
            </Card>

            <Card className="p-6 bg-black/40 border border-gray-800 rounded-2xl">
              <h3 className="text-2xl font-bold mb-3 text-pink-400">
                Join Room (c789d364)
              </h3>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                  placeholder="Room ID"
                  className="h-12 bg-black border-gray-700 text-white rounded-xl flex-1"
                />

                <Button
                  onClick={joinRoom}
                  className="bg-pink-600 px-8 py-6 rounded-xl w-full sm:w-auto"
                >
                  Join Room
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="w-full mt-24 px-6 md:px-12 lg:px-0 max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">Made for Teams</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Zap,
                title: "Live Sync",
                text: "Team edits show instantly",
              },
              {
                Icon: Users,
                title: "Multi Cursors",
                text: "See who is typing",
              },
              {
                Icon: Code2,
                title: "Share Code",
                text: "Build together smooth",
              },
            ].map((f, i) => (
              <Card
                key={i}
                className="p-6 bg-black/40 border-gray-800 rounded-2xl text-gray-300"
              >
                <f.Icon className="w-8 h-8 mx-auto text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
                <p className="text-gray-500">{f.text}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full mt-24 px-6 md:px-12 lg:px-0 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8">
            Start in 3 steps
          </h2>

          {[
            "Create or join room",
            "Share ID with team",
            "Code live together",
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-black/40 border border-gray-800 p-4 rounded-xl mb-3 text-center text-gray-400"
            >
              {value}
            </div>
          ))}
        </div>

        <div className="mt-24 py-6 border-t border-gray-800 w-full text-center text-gray-600">
          Developed by Yash Gupta with lots of coffee ☕️
        </div>
      </div>
    </>
  );
}
