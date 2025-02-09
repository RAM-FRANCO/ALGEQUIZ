/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Container } from "@/app/components/common/Container";
import quizData from "@/public/quiz.json";
import Link from "next/link";
import Image from "next/image";
import backArowIcon from "@/public/arrow-icon.png";
import logo from "@/public/logo-1.png";
import { StartQuiz } from "./../../components/quiz/StartQuiz";
import { QuizContent } from "./../../components/quiz/QuizContent";
import { Leaderboard } from "./../../components/quiz/Leaderboard";
import musicIcon from "@/public/audio-icon.png";
import { signOut, useSession } from "next-auth/react";
import { ResetQuizDialog } from "@/app/components/quiz/ResetQuizDialog";
import { SignoutDialog } from "@/app/components/alert-dialog-signout";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type LeaderboardEntry = {
  username: string;
  score: number;
  timeSpent: number;
};

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [numberOfQuestions, setNumberQuestions] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [error, setError] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const [showSignoutDialog, setShowSignoutDialog] = useState(false);

  // Get unique topics from quiz data
  const topics = [...new Set(quizData.map((item) => item.topic))];

  useEffect(() => {
    if (session?.user?.role === "teacher") {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    audioRef.current = new Audio("/bg-music.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Get difficulties based on selected topic
  const difficulties = selectedTopic
    ? quizData
        .find((item) => item.topic === selectedTopic)
        ?.levels.map((level) => level.level) || []
    : [];

  const handleStartQuiz = () => {
    // Clear any existing error
    setError("");

    // Validate selections
    if (!selectedTopic) {
      setError("Please select a topic");
      return;
    }
    if (!selectedDifficulty) {
      setError("Please select a difficulty level");
      return;
    }
    if (!numberOfQuestions) {
      setError("Please select number of questions");
      return;
    }
    const topicData = quizData.find((item) => item.topic === selectedTopic);
    const levelData = topicData?.levels.find(
      (level) => level.level === selectedDifficulty
    );

    if (levelData) {
      // Randomly select questions based on numberOfQuestions
      const shuffled = [...levelData.questions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, numberOfQuestions));

      // Set timer based on difficulty
      const timerMap = {
        Easy: 15,
        Average: 30,
        Difficult: 60,
      };
      setTimer(timerMap[selectedDifficulty as keyof typeof timerMap]);
      setQuizStarted(true);
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    setSelectedAnswer(selectedAnswer);
    setShowCorrectAnswer(true);
    setIsTimerPaused(true);
    const correct = selectedAnswer === questions[currentQuestion].answer;
    const newScore = correct ? score + 1 : score;
    setScore(newScore);

    setTimeout(async () => {
      setShowCorrectAnswer(false);
      setSelectedAnswer("");
      setIsTimerPaused(false);
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        resetTimer();
      } else {
        setIsSubmitting(true);
        await submitScore(newScore);
        setIsSubmitting(false);
      }
    }, 3000);
  };

  const submitScore = async (currentScore: number) => {
    const totalPossibleTime = timer * numberOfQuestions;
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: currentScore,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          totalTime: totalPossibleTime,
          questionCount: numberOfQuestions,
          timeSpent,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit score");

      // Fetch leaderboard data
      const leaderboardResponse = await fetch(
        `/api/leaderboard?topic=${selectedTopic}&difficulty=${selectedDifficulty}&numberOfQuestions=${numberOfQuestions}`
      );
      const leaderboardData = await leaderboardResponse.json();

      // Sort leaderboard by score (descending) and timeSpent (ascending)
      const sortedLeaderboard = leaderboardData.sort(
        (a: LeaderboardEntry, b: LeaderboardEntry) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return a.timeSpent - b.timeSpent;
        }
      );

      setLeaderboard(sortedLeaderboard);
      setShowLeaderboard(true);

      // Reset quiz state
      setQuizStarted(false);
      setScore(0);
      setCurrentQuestion(0);
      setQuestions([]);
      setTimeSpent(0);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (quizStarted && timer > 0 && !isTimerPaused) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (currentQuestion + 1 < questions.length) {
              setCurrentQuestion(currentQuestion + 1);
              return getTimerByDifficulty();
            } else {
              submitScore(score);
              return 0;
            }
          }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [quizStarted, timer, currentQuestion, isTimerPaused]);

  const getTimerByDifficulty = () => {
    const timerMap = { Easy: 15, Average: 30, Difficult: 60 };
    return timerMap[selectedDifficulty as keyof typeof timerMap] || 0;
  };

  const resetTimer = () => setTimer(getTimerByDifficulty());

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleResetQuiz = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    setSelectedTopic("");
    setSelectedDifficulty("");
    setNumberQuestions(5);
    setQuizStarted(false);
    setQuestions([]);
    setScore(0);
    setTimer(0);
    setTimeSpent(0);

    setShowLeaderboard(false);
    setLeaderboard([]);
    setIsSubmitting(false);
    setShowCorrectAnswer(false);

    setCurrentQuestion(0);
    setSelectedAnswer("");
    setIsMusicPlaying(false);
    setShowResetDialog(false);
  };

  const handleSignOut = () => {
    setShowSignoutDialog(true);
  };

  const confirmSignOut = () => {
    signOut();
  };

  if (session?.user?.role === "teacher") {
    return null;
  }

  return (
    <Container className='relative'>
      <button
        className={`absolute bottom-10 right-5 md:right-10 w-10 h-10 md:w-14 rounded-full p-2 md:h-14 transition-colors ${
          isMusicPlaying ? "bg-primary" : "bg-white"
        }`}
        onClick={toggleMusic}
      >
        <Image
          src={musicIcon}
          alt='bg-music'
          className={`transition-colors  ${
            isMusicPlaying ? "opacity-100" : "opacity-30"
          }`}
        />
      </button>
      {!quizStarted && (
        <button
          onClick={handleSignOut}
          className='absolute top-5 right-5 px-8 py-1 bg-gradient-to-r from-[#CDFFD8] to-[#94B9FF] text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all'
        >
          Logout
        </button>
      )}
      <div className='w-full lg:w-3/4 mx-auto px-5 sm:p-8'>
        {quizStarted ? (
          <button onClick={handleResetQuiz}>
            <Image
              src={backArowIcon}
              alt='back arrow'
              className='w-10 sm:w-16'
            />
          </button>
        ) : (
          <Link href='/'>
            <Image
              src={backArowIcon}
              alt='back arrow'
              className='w-10 sm:w-16'
            />
          </Link>
        )}
        <div className='flex justify-center items-center w-full'>
          <div className='text-center'>
            <Image
              src={logo}
              alt='logo'
              className='w-60 sm:w-72 md:w-80 mx-auto'
            />
          </div>
          {quizStarted && (
            <div
              className={`${
                timer <= 5 ? "bg-red-500 text-white" : "bg-primary"
              } rounded-full p-4 text-sm md:text-base absolute top-10 right-5 md:right-10 w-20 md:h-24 h-20 md:w-24 flex justify-center items-center flex-col`}
            >
              <span className='font-medium'>TIME</span>
              <p>{timer}s</p>
            </div>
          )}
        </div>

        {showLeaderboard ? (
          <Leaderboard
            leaderboard={leaderboard}
            selectedTopic={selectedTopic}
            selectedDifficulty={selectedDifficulty}
            numberOfQuestions={numberOfQuestions}
          />
        ) : !quizStarted ? (
          <StartQuiz
            error={error}
            topics={topics}
            difficulties={difficulties}
            selectedTopic={selectedTopic}
            selectedDifficulty={selectedDifficulty}
            numberOfQuestions={numberOfQuestions}
            setSelectedTopic={setSelectedTopic}
            setSelectedDifficulty={setSelectedDifficulty}
            setNumberQuestions={setNumberQuestions}
            handleStartQuiz={handleStartQuiz}
          />
        ) : (
          <QuizContent
            questions={questions}
            currentQuestion={currentQuestion}
            score={score}
            isSubmitting={isSubmitting}
            handleAnswer={handleAnswer}
            showCorrectAnswer={showCorrectAnswer}
            selectedAnswer={selectedAnswer}
          />
        )}
      </div>
      <ResetQuizDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={confirmReset}
      />
      <SignoutDialog
        open={showSignoutDialog}
        onOpenChange={setShowSignoutDialog}
        onConfirm={confirmSignOut}
      />
    </Container>
  );
}
