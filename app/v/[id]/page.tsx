"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

interface CardData {
  id: string;
  recipient_name: string;
  question_text: string;
  yes_message: string;
}

export default function RecipientPage() {
  const params = useParams(); // Get the ID from the URL
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState<{
    top: string;
    left: string;
    position: "static" | "absolute";
  }>({
    top: "auto",
    left: "auto",
    position: "static",
  });

  // Fetch data from Supabase when page loads
  useEffect(() => {
    const fetchCard = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) setCardData(data);
    };
    if (params.id) fetchCard();
  }, [params.id]);

  const moveButton = () => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoPosition({ top: `${y}px`, left: `${x}px`, position: "absolute" });
  };

  if (!cardData)
    return <div className="text-center mt-20">Loading Love...</div>;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {accepted ? (
        <div className="text-center animate-bounce">
          <div className="text-9xl">🥰💖</div>
          <h1 className="text-4xl font-bold text-red-600 mt-4">
            {cardData.yes_message}
          </h1>
        </div>
      ) : (
        <div className="text-center">
          <img
            src="/val.jpeg"
            alt="Cute Bear"
            className="w-48 mx-auto rounded-xl mb-6"
          />
          <h1 className="text-3xl md:text-5xl font-bold text-red-600 mb-8">
            {cardData.recipient_name ? `Hey ${cardData.recipient_name}, ` : ""}
            {cardData.question_text}
          </h1>

          <div className="space-x-4">
            <button
              onClick={() => setAccepted(true)}
              className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:bg-green-600 transform hover:scale-110 transition shadow-lg"
            >
              Yes! 😍
            </button>

            <button
              onMouseEnter={moveButton}
              onClick={moveButton}
              style={noPosition}
              className="bg-red-500 text-white px-8 py-4 rounded-full text-xl font-bold transition shadow-lg"
            >
              No 😢
            </button>
          </div>
        </div>
      )}

      <footer className="absolute bottom-4 text-gray-400 text-xs">
        <a href="/" className="hover:underline">
          Create your own Valentine Link
        </a>
      </footer>
    </div>
  );
}
