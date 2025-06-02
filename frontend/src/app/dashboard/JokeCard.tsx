"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

const FlipJokeCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [joke, setJoke] = useState({ question: "", answer: "" });
  const [isLoadingJoke, setIsLoadingJoke] = useState(false);

  const fetchJoke = useCallback(async () => {
    setIsLoadingJoke(true);
    setIsFlipped(false);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Static mock joke
    const mockJokes = [
        { question: "Why don't programmers like nature?", answer: "It has too many bugs." },
        { question: "Why did the private classes break up?", answer: "Because they never saw each other." },
        { question: "What's a programmer's favorite hangout place?", answer: "Foo Bar." },
        { question: "Why was the JavaScript developer sad?", answer: "Because he didn't Node how to Express himself." }
    ];
    const randomJoke = mockJokes[Math.floor(Math.random() * mockJokes.length)];
    setJoke(randomJoke);

    setIsLoadingJoke(false);
  }, []);

  useEffect(() => {
    fetchJoke();
  }, [fetchJoke]);

  return (
    <div
      className="cursor-pointer h-[200px] md:h-[300px]" 
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500 bg-card text-card-foreground rounded-lg shadow-md p-6 flex flex-col justify-center items-center" // Added card styling
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full flex flex-col justify-center items-center p-4 box-border"
          style={{
            backfaceVisibility: "hidden",
            visibility: isFlipped ? "hidden" : "visible",
          }}
        >
          <div className="w-full text-center">
            <div className="flex flex-col justify-center items-center mb-4">
              <h2 className="text-sm text-muted-foreground">Daily Programming Joke</h2>
            </div>
            <div className="text-xl font-semibold min-h-[60px]"> {/* Min height for question */}
              {isLoadingJoke ? "Loading..." : joke.question}
            </div>
            <span className="text-xs text-muted-foreground mt-4 block">
              Click to reveal answer
            </span>
            <button
              className="absolute top-2 right-2 bg-none border-none cursor-pointer p-1 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                if (!isLoadingJoke) fetchJoke();
              }}
              disabled={isLoadingJoke}
              aria-label="New joke"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoadingJoke ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
        {/* Back Side */}
        <div
          className="absolute w-full h-full flex flex-col justify-center items-center p-4 box-border"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            visibility: isFlipped ? "visible" : "hidden",
          }}
        >
          <div className="w-full text-center">
            <div className="text-xl font-semibold min-h-[60px]">{joke.answer}</div> {/* Min height for answer */}
            <span className="text-xs text-muted-foreground mt-4 block">
              Click to see question
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipJokeCard;