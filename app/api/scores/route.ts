/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, topic, difficulty, totalTime, timeSpent, questionCount } =
      await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("user id from db", user.id);

    // Check for existing score with same topic, difficulty and questionCount
    const existingScore = await prisma.score.findFirst({
      where: {
        userId: user.id,
        topic,
        difficulty,
        questionCount,
      },
    });

    if (existingScore) {
      // Update existing score if new score is higher
      if (score > existingScore.score) {
        const updatedScore = await prisma.score.update({
          where: { id: existingScore.id },
          data: {
            score,
            totalTime,
            timeSpent,
            updatedAt: new Date(),
          },
        });
        return NextResponse.json(updatedScore);
      }
      return NextResponse.json(existingScore);
    }

    // Create new score
    const newScore = await prisma.score.create({
      data: {
        score,
        topic,
        difficulty,
        questionCount,
        totalTime,
        timeSpent,
        userId: user.id,
      },
    });

    return NextResponse.json(newScore);
  } catch (error) {
    console.error("Error handling score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const difficulty = searchParams.get("difficulty");
    const questionCount = searchParams.get("questionCount");
    const studentName = searchParams.get("studentName");

    const where: any = {};
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;
    if (questionCount) where.questionCount = parseInt(questionCount);
    if (studentName) {
      where.user = {
        name: {
          contains: studentName,
          mode: "insensitive",
        },
      };
    }

    const scores = await prisma.score.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            studentNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedScores = scores.map((score) => ({
      id: score.id,
      studentName: score.user.name,
      studentNumber: score.user.studentNumber,
      topic: score.topic,
      difficulty: score.difficulty,
      questionCount: score.questionCount,
      score: score.score,
      date: score.createdAt,
    }));

    return NextResponse.json(formattedScores);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
