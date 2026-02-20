import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { meetsDb } from "@/lib/meets-db";
import { MEETS_ROOM_NAME_RE } from "@/lib/meets-recent-rooms";

const MAX_LEN = 8000;

export async function POST(req: Request) {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = meetsDb();
    if (!db) {
        return NextResponse.json(
            { error: "Server storage not configured (SUPABASE_SERVICE_ROLE_KEY)" },
            { status: 503 },
        );
    }
    let body: unknown;
    try {
        body = await req.json();
    }
    catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const room =
        typeof (body as { room?: unknown }).room === "string"
            ? (body as { room: string }).room.trim()
            : "";
    const message =
        typeof (body as { message?: unknown }).message === "string"
            ? (body as { message: string }).message
            : "";
    if (!room || !MEETS_ROOM_NAME_RE.test(room)) {
        return NextResponse.json({ error: "Invalid room" }, { status: 400 });
    }
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > MAX_LEN) {
        return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    const senderDisplay = user.username.slice(0, 200);
    const { data, error } = await db
        .from("meets_chat_messages")
        .insert({
            room_name: room,
            user_id: user.id,
            sender_display: senderDisplay,
            body: trimmed,
        })
        .select("id, created_at")
        .single();
    if (error) {
        console.error("meets chat insert", error);
        return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }
    return NextResponse.json({ id: data.id, createdAt: data.created_at });
}
