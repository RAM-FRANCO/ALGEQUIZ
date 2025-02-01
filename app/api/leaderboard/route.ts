/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Get topic and difficulty from URL parameters
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");

    if (!topic || !difficulty) {
      return NextResponse.json(
        { error: "Topic and difficulty are required" },
        { status: 400 }
      );
    }

    // Fetch scores from database with user information
    const scores = await prisma.score.findMany({
      where: {
        topic: topic,
        difficulty: difficulty,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ score: "desc" }, { timeSpent: "asc" }],
      take: 5, // Limit to top 10 scores
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
