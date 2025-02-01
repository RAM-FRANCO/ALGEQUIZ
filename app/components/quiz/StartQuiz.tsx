import React from "react";

type StartQuizProps = {
  error: string;
  topics: string[];
  difficulties: string[];
  selectedTopic: string;
  selectedDifficulty: string;
  numberOfQuestions: number;
  setSelectedTopic: (topic: string) => void;
  setSelectedDifficulty: (difficulty: string) => void;
  setNumberQuestions: (num: number) => void;
  handleStartQuiz: () => void;
};

export function StartQuiz({
  error,
  topics,
  difficulties,
  selectedTopic,
  selectedDifficulty,
  numberOfQuestions,
  setSelectedTopic,
  setSelectedDifficulty,
  setNumberQuestions,
  handleStartQuiz,
}: StartQuizProps) {
  return (
    <div className='space-y-6 lg:w-2/4 mx-auto'>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div className='relative'>
          <select
            className='w-full px-4 py-3 rounded-lg bg-primary border-none focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-gray-700 pr-10'
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value=''>Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg
              className='fill-current h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
            </svg>
          </div>
        </div>

        <div className='relative'>
          <select
            className='w-full px-4 py-3 rounded-lg bg-primary border-none focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-gray-700'
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value=''>Level of Difficulty</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg
              className='fill-current h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
            </svg>
          </div>
        </div>

        <div className='relative'>
          <select
            className='w-full px-4 py-3 rounded-lg bg-primary border-none focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-gray-700'
            value={numberOfQuestions}
            onChange={(e) => setNumberQuestions(Number(e.target.value))}
          >
            <option value=''>Numbers of Questions</option>
            {[5, 10, 15, 20, 30].map((num) => (
              <option key={num} value={num}>
                {num} Questions
              </option>
            ))}
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg
              className='fill-current h-4 w-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
            </svg>
          </div>
        </div>

        <div className='flex flex-col items-center space-y-4 mt-8'>
          <button
            onClick={handleStartQuiz}
            className='px-8 py-2 bg-gradient-to-r from-[#CDFFD8] to-[#94B9FF] text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all'
          >
            GAME ON!
          </button>
        </div>
      </div>
    </div>
  );
}
