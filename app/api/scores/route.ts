import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, topic, difficulty, totalTime, timeSpent } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("user id from db", user.id);

    // Check for existing score with same topic and difficulty

    const existingScore = await prisma.score.findFirst({
      where: {
        userId: user.id,
        topic,
        difficulty,
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
