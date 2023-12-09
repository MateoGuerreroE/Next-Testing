import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { NextRequest, NextResponse } from "next/server";
// GET

export const GET = async (req: NextRequest, { params }: any) => {
  //!
  try {
    await connectToDB();
    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt)
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    return NextResponse.json(prompt, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
};

// PATCH

export const PATCH = async (req: NextRequest, { params }: any) => {
  const { prompt, tag } = await req.json();
  try {
    await connectToDB();
    const existingPrompt = await Prompt.findById(params.id);
    if (!existingPrompt)
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();
    return NextResponse.json(existingPrompt, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
};

// DELETE

export const DELETE = async (req: NextRequest, { params }: any) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndDelete(params.id);
    return NextResponse.json("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
};
