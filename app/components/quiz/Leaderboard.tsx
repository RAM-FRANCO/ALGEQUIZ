import React from "react";
import Image from "next/image";
import leaderboardIcon from "@/public/leaderboard-icon.png";
import crownIcon from "@/public/crown.png";

type LeaderboardEntry = {
  username: string;
  score: number;
  timeSpent: number;
};

type LeaderboardProps = {
  leaderboard: LeaderboardEntry[];
  selectedTopic: string;
  selectedDifficulty: string;
  numberOfQuestions: number;
};

export function Leaderboard({
  leaderboard,
  selectedTopic,
  selectedDifficulty,
  numberOfQuestions,
}: LeaderboardProps) {
  return (
    <div className='space-y-4 lg:space-y-6 bg-white lg:w-2/4 mx-auto rounded-3xl p-6'>
      <div className='flex items-center justify-center gap-2 mb-5'>
        <Image src={leaderboardIcon} alt='leaderboard' className='w-10 h-10' />
        <div>
          <h2 className='text-xl lg:text-2xl font-bold'>
            Student&apos;s Ranking
          </h2>
          <p className='text-sm md:text-base text-center'>
            {selectedTopic} ({selectedDifficulty}) - {numberOfQuestions}{" "}
            Questions
          </p>
        </div>
      </div>
      <div className=''>
        <div className='grid grid-cols-3 justify-center text-center  px-6 lg:py-2 font-bold text-black text-sm lg:text-lg '>
          <div className='flex items-center gap-3 font-bold '>
            <span className='ml-9'>Name</span>
          </div>
          <span>Score</span>
          <span>Time</span>
        </div>
        {leaderboard.map((entry, index) => (
          <div
            key={index}
            className='grid grid-cols-3 justify-center text-center px-6 py-2 '
          >
            <div className='flex items-center gap-3  '>
              <Image src={crownIcon} alt='crown' className='w-6 h-6' />
              <span className='text-sm lg:text-lg'>{entry.username}</span>
            </div>
            <span className='text-sm lg:text-lg font-bold'>{entry.score}</span>
            <span className='text-sm lg:text-lg font-bold'>
              {entry.timeSpent}s
            </span>
          </div>
        ))}
      </div>
      {/* <div className='flex justify-center mt-6'>
        <button
          onClick={onPlayAgain}
          className='px-8 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all'
        >
          Play Again
        </button>
      </div> */}
    </div>
  );
}
