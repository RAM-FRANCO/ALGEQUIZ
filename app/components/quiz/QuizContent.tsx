import React from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type QuizContentProps = {
  questions: Question[];
  currentQuestion: number;
  score: number;
  isSubmitting: boolean;
  handleAnswer: (answer: string) => void;
  showCorrectAnswer: boolean;
  selectedAnswer: string;
};

export function QuizContent({
  questions,
  currentQuestion,
  score,
  isSubmitting,
  handleAnswer,
  showCorrectAnswer,
  selectedAnswer,
}: QuizContentProps) {
  return (
    <div className='w-full space-y-4'>
      {isSubmitting ? (
        <div className='flex flex-col items-center justify-center space-y-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
          <p className='text-lg'>Submitting your score...</p>
        </div>
      ) : (
        <>
          <div className='bg-secondary/40 p-8 rounded-lg mb-6'>
            <h2 className='text-xl md:text-2xl text-white text-center'>
              {questions[currentQuestion].question}
            </h2>
          </div>
          <div>
            {questions[currentQuestion].options.map((option, index) => {
              const getBackgroundColor = (index: number) => {
                switch (index) {
                  case 0:
                    return "bg-primary";
                  case 1:
                    return "bg-primary_1";
                  case 2:
                    return "bg-primary_2";
                  case 3:
                    return "bg-primary_3";
                  default:
                    return "bg-primary";
                }
              };

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left border rounded-lg mb-4 hover:brightness-95 transition-all
                        ${
                          showCorrectAnswer &&
                          option === questions[currentQuestion].answer
                            ? "bg-primary_yellow"
                            : getBackgroundColor(index)
                        }
                        ${showCorrectAnswer ? "cursor-not-allowed" : ""}
                        ${
                          selectedAnswer === option
                            ? "border-2 border-secondary"
                            : "border border-transparent"
                        }
                    `}
                  disabled={isSubmitting || showCorrectAnswer}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className='text-sm md:text-base text-center mt-4'>
            Question {currentQuestion + 1}/{questions.length} • Score: {score}
          </div>
        </>
      )}
    </div>
  );
}
