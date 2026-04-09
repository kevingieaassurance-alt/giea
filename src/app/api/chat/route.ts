import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  const { messages, system } = await req.json();
  const r = await client.messages.create({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages });
  return NextResponse.json({ text: r.content.find(b => b.type === "text")?.text ?? "" });
}
