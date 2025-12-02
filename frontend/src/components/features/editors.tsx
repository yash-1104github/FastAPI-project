import React, { useEffect, useState } from "react";
import { setCode } from "./editorSlice";
import useDebounce from "../../hooks/useDebounce";
import { fetchAutocomplete } from "../../api/autocomplete";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../utils/store";
import { Download, Play, Copy, Code2, Zap, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function Editor({ roomId }: { roomId: string }) {
  const dispatch = useDispatch();
  const code = useSelector((state: RootState) => state.editor.code);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [suggestion, setSuggestion] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedCode = useDebounce(code, 600);
  const languageId = 71;

  useEffect(() => {
    const socket = new WebSocket(
      `wss://fastapi-project-78pm.onrender.com/ws/${roomId}`
    );

    socket.onopen = () => console.log("ws open");
    socket.onmessage = (evt) => {
      const payload = JSON.parse(evt.data);
      if (payload.type === "init" || payload.type === "code") {
        dispatch(setCode(payload.code));
      }
      if (payload.type === "output") {
        setOutput(payload.output);
      }
    };
    setWs(socket);
    return () => socket.close();
  }, [roomId]);

  useEffect(() => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "code", code: debouncedCode }));
    }
  }, [debouncedCode]);

  useEffect(() => {
    let cancelled = false;
    async function doAuto() {
      const s = await fetchAutocomplete(
        debouncedCode,
        debouncedCode.length,
        "python"
      );
      if (!cancelled) setSuggestion(s);
    }
    doAuto();
    return () => {
      cancelled = true;
    };
  }, [debouncedCode]);

  function toBase64(str: string) {
    return btoa(
      new TextEncoder()
        .encode(str)
        .reduce((a, b) => a + String.fromCharCode(b), "")
    );
  }

  function fromBase64(b64: string) {
    if (!b64) return "";
    return new TextDecoder().decode(
      Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    );
  }

  const API_URL = import.meta.env.VITE_API_URL;


  const runHandler = async () => {
    setLoading(true);
    await fetch(`${API_URL}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language_id: languageId,
        source_code: toBase64(code),
        stdin: toBase64("5 10"),
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(text);
        }
      })
      .then((data) => {
        const realOutput =
          fromBase64(data.stdout) ||
          fromBase64(data.stderr) ||
          fromBase64(data.compile_output) ||
          data.message ||
          data.status?.description ||
          "";

        setOutput(realOutput);
      })
      .catch((e) => setOutput(e.message))
      .finally(() => setLoading(false));
  };

  function download() {
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "main.py";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="flex justify-center w-full ">
      <div
        className="w-full min-h-screen px-4 sm:px-8 md:px-12 mt-24 grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 gap-4">
        <Card className="md:col-span-5 lg:col-span-7 col-span-full p-6 bg-black/30 border border-purple-600/50 rounded-2xl shadow-[0_0_15px_rgba(147,51,234,0.2)] relative" >
          <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
            <Code2 className="w-5 h-5" /> Code Editor
          </h3>

          <Button
            onClick={download}
            disabled={loading}
            className="absolute top-6 right-6 bg-purple-700 flex items-center gap-2"
          >
            <Download className="w-4" /> Download
          </Button>

          <textarea
            value={code}
            onChange={(e) => dispatch(setCode(e.target.value))}
            className="w-full h-[70vh] md:h-[78vh] lg:h-[80vh] p-6 rounded-xl bg-[#0A0A0A] text-[#EDEDED] font-mono text-sm leading-[1.6] border border-gray-700 focus:outline-none focus:ring-2 resize-none"
            placeholder="Write your code..."
          />
        </Card>

        <div className=" md:col-span-3 lg:col-span-3   grid grid-rows-2 gap-4 col-span-full h-full">

          <Card className=" p-6 bg-black/30 border border-pink-600/50  rounded-2xl shadow-[0_0_12px_rgba(236,72,153,0.2)] relative">
            <h3 className="text-lg font-bold mb-3 text-pink-400 flex items-center gap-2">
              <Zap className="w-4" /> Output
            </h3>

            <Button
              onClick={runHandler}
              disabled={loading}
              className="absolute top-6 right-6 bg-pink-700 flex items-center gap-2"
            >
              <Play className="w-4" /> {loading ? "Running..." : "Run"}
            </Button>

            <div
              className="w-full h-[28vh] md:h-[33vh] lg:h-[35vh] bg-black/70 border border-gray-800 rounded-xl p-3 overflow-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap text-gray-300">
                {output || "No output yet..."}
              </pre>
            </div>
          </Card>

          <Card className="p-6 bg-black/30 border border-purple-500/30 rounded-2xl shadow relative">
            <h3 className="text-lg font-bold mb-3 text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4" /> AI Suggestions ✨
            </h3>

            <Button
              onClick={() => navigator.clipboard.writeText(suggestion)}
              className="absolute top-6 right-6 bg-purple-700/70 hover:opacity-80 flex items-center gap-2 text-xs">
              <Copy className="w-3" /> Copy
            </Button>

            <div
              className="w-full h-[30vh] md:h-[34vh] lg:h-[35vh] bg-black/70 border border-gray-800 rounded-xl p-3 overflow-auto cursor-pointer">
              <pre className="text-sm p-2 font-mono whitespace-pre-wrap text-gray-400">
                {suggestion || "Waiting for AI..."}
              </pre>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
