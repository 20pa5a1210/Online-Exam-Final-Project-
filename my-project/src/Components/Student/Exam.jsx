import { useParams } from "react-router-dom";
import useExam from "./useExam";
import React, { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
export default function Exam() {
  const { id } = useParams();
  const [
    loading,
    error,
    subjectID,
    subjectName,
    branch,
    totalQuestions,
    marks,
    duration,
    randomQuestions,
  ] = useExam({ id });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [timeTaken, setTimeTaken] = useState(null);

  useEffect(() => {
    setTimeRemaining(duration * 60);
  }, [duration]);

  const intervalIdRef = useRef(null);
  console.log(timeRemaining);
  useEffect(() => {
    if (timeRemaining <= 0 || currentQuestionIndex >= randomQuestions.length) {
      clearInterval(intervalIdRef.current);
    } else {
      intervalIdRef.current = setInterval(() => {
        setTimeRemaining((timeRemaining) => timeRemaining - 1);
      }, 1000);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [timeRemaining, currentQuestionIndex, randomQuestions.length]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answerIndex });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const score = useMemo(() => {
    const score = Object.entries(userAnswers).reduce(
      (totalScore, [questionIndex, answerIndex]) => {
        const correctAnswerIndex =
          randomQuestions[questionIndex].correctAnswerIndex;
        return totalScore + (answerIndex === correctAnswerIndex ? 1 : 0);
      },
      0
    );

    const timeTaken = duration * 60 - timeRemaining;
    setTimeTaken(timeTaken);

    return score;
  }, [duration, timeRemaining, randomQuestions, userAnswers]);

  if (timeRemaining <= 0 || currentQuestionIndex >= randomQuestions.length) {
    return (
      <div
        className={classNames(
          "bg-gradient-to-br",
          "from-purple-500",
          "to-pink-500",
          "h-screen"
        )}
      >
        <div
          className={classNames(
            "flex",
            "justify-center",
            "items-center",
            "h-full"
          )}
        >
          <div
            className={classNames(
              "quiz-container",
              "bg-white",
              "p-4",
              "shadow-md",
              "rounded-lg",
              "w-1/3"
            )}
          >
            <h1
              className={classNames(
                "text-2xl",
                "font-bold",
                "text-center",
                "mb-6",
                "text-gray-800"
              )}
            >
              Exam Result
            </h1>
            <div
              className={classNames(
                "text-gray-800",
                "font-medium",
                "text-lg",
                "mb-2"
              )}
            >
              Subject ID: {subjectID}
            </div>
            <div
              className={classNames(
                "text-gray-800",
                "font-medium",
                "text-lg",
                "mb-2"
              )}
            >
              Subject: {subjectName}
            </div>
            <div
              className={classNames(
                "text-gray-800",
                "font-medium",
                "text-lg",
                "mb-2"
              )}
            >
              Time: {duration}
            </div>
            <div
              className={classNames(
                "text-gray-800",
                "font-medium",
                "text-lg",
                "mb-2"
              )}
            >
              Total Questions: {totalQuestions}
            </div>
            <div
              className={classNames(
                "text-gray-800",
                "font-medium",
                "text-lg",
                "mb-2"
              )}
            >
              Time Taken: {timeTaken}
            </div>
            <div
              className={classNames("text-gray-800", "font-medium", "text-lg")}
            >
              <h2
                className={classNames(
                  "text-3xl",
                  "font-bold",
                  "text-center",
                  "mt-8",
                  "mb-4"
                )}
              >
                Your score is: {score}
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = randomQuestions[currentQuestionIndex];

  return (
    <>
      <div className="flex flex-col mb-4 bg-blue-500 p-4  shadow-md">
        <div className="text-white font-medium text-lg w-1/4">
          Subject ID: {subjectID}
        </div>
        <div className="text-white font-medium text-lg w-1/4">
          Subject: {subjectName}
        </div>
        <div className="text-white font-medium text-lg w-1/4">
          Time: {duration}
        </div>
        <div className="text-white font-medium text-lg w-1/4">
          Total Questions: {totalQuestions}
        </div>
      </div>

      <div className="bg-white p-6  shadow-lg">
        <div className="flex justify-between">
          <h1 className="text-gray-900 font-bold text-2xl mb-4">
            Current Question {currentQuestionIndex + 1} -{" "}
            {randomQuestions.length}
          </h1>
          <h1 className="text-gray-900 font-bold text-2xl mb-4">
            Time remaining: {minutes}:{seconds < 10 ? "0" : ""}
            {seconds} Minutes
          </h1>
        </div>
        <div className="text-gray-900 text-lg font-medium mb-4">
          {currentQuestionIndex + 1} . {currentQuestion.question}
        </div>
        {currentQuestion.answers.map((answer, index) => (
          <div className="mb-2" key={index}>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name={`question${currentQuestionIndex}`}
                value={index}
                onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                checked={userAnswers[currentQuestionIndex] === index}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-900 text-lg font-medium">
                {answer}
              </span>
            </label>
          </div>
        ))}
        <div className="flex justify-between mt-6">
          <button
            className={`bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ${
              currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow ${
              userAnswers[currentQuestionIndex] === undefined
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNextQuestion}
            disabled={userAnswers[currentQuestionIndex] === undefined}
          >
            {currentQuestionIndex === randomQuestions.length - 1
              ? "Submit"
              : "next"}
          </button>
        </div>
      </div>
    </>
  );
}