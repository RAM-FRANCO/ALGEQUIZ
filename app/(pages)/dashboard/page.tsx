"use client";

import React, { useState } from "react";
import StudentsList from "@/app/components/dashboard/StudentsList";
import ScoresOverview from "@/app/components/dashboard/ScoresOverview";
import { signOut } from "next-auth/react";
import { SignoutDialog } from "@/app/components/alert-dialog-signout";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("students");
  const [showSignoutDialog, setShowSignoutDialog] = useState(false);

  const handleSignOut = () => {
    setShowSignoutDialog(true);
  };

  const confirmSignOut = () => {
    signOut();
  };

  return (
    <div className='h-screen flex flex-col md:flex-row bg-white w-full'>
      {/* Sidebar */}
      <div className='w-full md:w-64 bg-gray-100 p-4 flex flex-col gap-5'>
        <div className='flex justify-between items-center md:block'>
          <h2 className='text-xl font-bold mb-2 md:mb-6'>Dashboard</h2>
          {/* Mobile logout button */}
          <button
            className='md:hidden p-2 rounded bg-blue-500 text-white'
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
        <div className='flex md:flex-col space-x-2 md:space-x-0 md:space-y-2'>
          <button
            className={`flex-1 md:w-full text-center md:text-left p-2 rounded ${
              activeTab === "students"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={`flex-1 md:w-full text-center md:text-left p-2 rounded ${
              activeTab === "scores"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("scores")}
          >
            Scores
          </button>
        </div>
        {/* Desktop logout button */}
        <button
          className='hidden md:block w-full text-left p-2 rounded mt-auto bg-blue-500 text-white'
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-4 md:p-6 h-[calc(100vh-80px)] md:h-screen overflow-y-auto mt-5 md:mt-0'>
        {activeTab === "students" ? <StudentsList /> : <ScoresOverview />}
      </div>

      <SignoutDialog
        open={showSignoutDialog}
        onOpenChange={setShowSignoutDialog}
        onConfirm={confirmSignOut}
      />
    </div>
  );
}
