"use client";

import React, { useEffect, useState } from "react";

interface ScoreFilters {
  topic: string;
  difficulty: string;
  questionCount: string;
}

interface Score {
  id: string;
  studentName: string;
  studentNumber: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  score: number;
  date: string;
}

export default function ScoresOverview() {
  const [scores, setScores] = useState<Score[]>([]);
  const [filters, setFilters] = useState<ScoreFilters>({
    topic: "",
    difficulty: "",
    questionCount: "",
  });
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Score | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.topic) queryParams.append("topic", filters.topic);
        if (filters.difficulty)
          queryParams.append("difficulty", filters.difficulty);
        if (filters.questionCount)
          queryParams.append("questionCount", filters.questionCount);

        const response = await fetch(`/api/scores?${queryParams.toString()}`);
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [filters]);

  const sortData = (key: keyof Score) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedScores = [...scores].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setScores(sortedScores);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Score) => {
    if (sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className='p-10 space-y-5'>
      {" "}
      <h1 className='text-2xl font-bold mb-6'>Scores Overview</h1>
      {/* Filters */}
      <div className='grid grid-cols-3 gap-4 mb-6'>
        <select
          className='border rounded p-2'
          value={filters.topic}
          onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
        >
          <option value=''>All Topics</option>
          <option value='Addition of Integers'>Addition of Integers</option>
          <option value='Subtraction of Integers'>
            Subtraction of Integers
          </option>
          <option value='Multiplication of Integers'>
            Multiplication of Integers
          </option>
          <option value='Division of Integers'>Division of Integers</option>
        </select>

        <select
          className='border rounded p-2'
          value={filters.difficulty}
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
        >
          <option value=''>All Difficulties</option>
          <option value='Easy'>Easy</option>
          <option value='Average'>Average</option>
          <option value='Difficult'>Difficult</option>
        </select>

        <select
          className='border rounded p-2'
          value={filters.questionCount}
          onChange={(e) =>
            setFilters({ ...filters, questionCount: e.target.value })
          }
        >
          <option value=''>All Question Counts</option>
          <option value='30'>30 Questions</option>
          <option value='20'>20 Questions</option>
          <option value='15'>15 Questions</option>
          <option value='10'>10 Questions</option>
          <option value='5'>5 Questions</option>
        </select>
      </div>
      {/* Scores Table */}
      {loading ? (
        <div className='flex flex-col gap-5 justify-center items-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
          <p>Loading...</p>
        </div>
      ) : scores.length === 0 ? (
        <div className='text-center py-10 text-gray-500'>No records found</div>
      ) : (
        <div className='bg-white shadow-md rounded-lg'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-gray-50'>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("studentNumber")}
                >
                  Student Number {getSortIcon("studentNumber")}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("studentName")}
                >
                  Student {getSortIcon("studentName")}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("topic")}
                >
                  Topic {getSortIcon("topic")}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("difficulty")}
                >
                  Difficulty {getSortIcon("difficulty")}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("questionCount")}
                >
                  Questions {getSortIcon("questionCount")}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("score")}
                >
                  Score {getSortIcon("score")}
                </th>
                <th
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => sortData("date")}
                >
                  Date {getSortIcon("date")}
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {score.studentNumber}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {score.studentName}
                  </td>

                  <td className='px-6 py-4 whitespace-nowrap'>{score.topic}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {score.difficulty}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {score.questionCount}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{score.score}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {new Date(score.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
