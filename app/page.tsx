"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid"; // generates unique IDs

export default function CreatorPage() {
  const [formData, setFormData] = useState({
    recipient_name: "",
    question_text: "Will you be my Valentine?",
    yes_message: "Yay! See you soon! ❤️",
  });
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Generate a short unique ID (e.g., 6 characters)
    const uniqueId = nanoid(6);

    const { error } = await supabase
      .from("cards")
      .insert([{ id: uniqueId, ...formData }]);

    if (error) {
      alert("Error creating card!");
    } else {
      // Create the full URL
      const url = `${window.location.origin}/v/${uniqueId}`;
      setGeneratedLink(url);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 p-4 font-sans">
      <h1 className="text-4xl font-bold text-red-600 mb-8">
        💖 Valentine Link Generator
      </h1>

      {!generatedLink ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <label className="block mb-2 font-bold text-gray-700">
            Recipient Name
          </label>
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="e.g. Sarah"
            required
            onChange={(e) =>
              setFormData({ ...formData, recipient_name: e.target.value })
            }
          />

          <label className="block mb-2 font-bold text-gray-700">
            Custom Question
          </label>
          <input
            className="w-full border p-2 rounded mb-4"
            defaultValue="Will you be my Valentine?"
            onChange={(e) =>
              setFormData({ ...formData, question_text: e.target.value })
            }
          />

          <label className="block mb-2 font-bold text-gray-700">
            Success Message
          </label>
          <input
            className="w-full border p-2 rounded mb-6"
            defaultValue="Yay! See you soon! ❤️"
            onChange={(e) =>
              setFormData({ ...formData, yes_message: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition"
          >
            {loading ? "Generating..." : "Create Link 💘"}
          </button>
        </form>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Link Created! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Send this to your special someone:
          </p>
          <input
            readOnly
            value={generatedLink}
            className="w-full bg-gray-100 p-3 rounded border text-center mb-4 select-all"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(generatedLink);
              alert("Copied!");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Copy Link
          </button>
          <button
            onClick={() => setGeneratedLink("")}
            className="block w-full mt-4 text-gray-500 hover:underline"
          >
            Create Another
          </button>
        </div>
      )}
    </div>
  );
}
