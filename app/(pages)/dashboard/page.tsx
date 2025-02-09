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
    <div className='flex h-screen bg-white w-full'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-100 h-full p-4 flex flex-col'>
        <h2 className='text-xl font-bold mb-6'>Dashboard</h2>
        <div className='space-y-2'>
          <button
            className={`w-full text-left p-2 rounded ${
              activeTab === "students"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
          <button
            className={`w-full text-left p-2 rounded ${
              activeTab === "scores"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("scores")}
          >
            Scores
          </button>
        </div>
        {/* Logout button */}
        <button
          className='w-full text-left p-2 rounded mt-auto bg-blue-500 text-white'
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6'>
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
