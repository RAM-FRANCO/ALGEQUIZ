"use client";

import React, { useEffect, useState } from "react";

interface Student {
  name: string;
  email: string;
  studentNumber: string;
  createdAt: string;
}

export default function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const rowsPerPage = 10;

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentStudents = students.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(students.length / rowsPerPage);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (searchName) queryParams.append("name", searchName);

        const response = await fetch(`/api/students?${queryParams.toString()}`);
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchName]);

  return (
    <div className='p-10 space-y-5'>
      <h1 className='text-2xl font-bold mb-6'>Students List</h1>

      {/* Add search input */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search by student name'
          className='border rounded p-2 w-full md:w-1/3'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <div className='bg-white shadow-md rounded-lg'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Student Number
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Joined Date
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className='flex flex-col gap-5 justify-center items-center min-h-[200px]'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
                    <p>Loading...</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentStudents.map((student) => (
                <tr key={student.studentNumber}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {student.studentNumber}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {student.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {student.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {new Date(student.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Add pagination controls */}
        {!loading && (
          <div className='px-6 py-4 flex items-center justify-between border-t border-gray-200'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-3 py-1 bg-gray-100 text-gray-700 rounded-md disabled:opacity-50'
            >
              Previous
            </button>
            <span className='text-sm text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1  text-gray-700 rounded-md disabled:opacity-50 ${
                currentPage === totalPages ? "" : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
