/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get topic, difficulty, and number of questions from URL parameters
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");
    const numberOfQuestions = searchParams.get("numberOfQuestions");

    if (!topic || !difficulty || !numberOfQuestions) {
      return NextResponse.json(
        { error: "Topic, difficulty, and number of questions are required" },
        { status: 400 }
      );
    }

    // Fetch scores from database with user information
    const scores = await prisma.score.findMany({
      where: {
        topic: topic,
        difficulty: difficulty,
        questionCount: parseInt(numberOfQuestions, 10),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ score: "desc" }, { timeSpent: "asc" }],
      take: 5, // Limit to top 5 scores
    });

    // Transform the data to match the LeaderboardEntry type
    const leaderboardData = scores.map((score: any) => ({
      username: score.user.name || "Anonymous",
      score: score.score,
      timeSpent: score.timeSpent,
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
