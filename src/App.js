import React, { useEffect, useState } from "react";
import questionsData from "./questions.json";

// Tailwind animation for marquee
const marqueeStyle = `
@keyframes marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.animate-marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 12s linear infinite;
}
`;

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // load questions safely
    if (questionsData && Array.isArray(questionsData)) {
      setQuestions(questionsData);
    }
  }, []);

  // ✅ guard before rendering anything
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-10 text-xl text-red-600">
        ⚠️ No questions found. Please check your questions.json file.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex] || null;

  const handleAnswer = (idx) => {
    if (!currentQuestion || !currentQuestion.options) return;

    setSelectedOption(idx);

    if (idx === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!questions || questions.length === 0) return;

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  const progress = questions.length
    ? ((currentIndex + 1) / questions.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-8">
      {/* Inject marquee animation */}
      <style>{marqueeStyle}</style>

      {/* Marquee header */}
      <div className="w-full overflow-hidden bg-green-600 py-2 mb-6">
        <div className="animate-marquee text-white font-bold text-2xl">
          🥳🎆🎈 HAPPY INDEPENDENCE NIGERIA 🎇🎈🥳
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        {!showResults ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              {currentQuestion?.question || "Question unavailable"}
            </h2>

            <ul className="space-y-3">
              {currentQuestion?.options?.length > 0 ? (
                currentQuestion.options.map((option, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleAnswer(idx)}
                      className={`w-full px-4 py-2 rounded-lg text-left ${
                        selectedOption === idx
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-red-600">⚠️ No options available</p>
              )}
            </ul>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-3 w-full bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-green-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="mt-6 w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
            >
              {currentIndex < questions.length - 1 ? "Next" : "Finish"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Finished 🎉</h2>
            <p className="text-lg">
              You scored <span className="font-bold">{score}</span> out of{" "}
              {questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
