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

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className='p-10 space-y-5'>
      <h1 className='text-2xl font-bold mb-6'>Students List</h1>
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
              students.map((student) => (
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
      </div>
    </div>
  );
}
