import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { meetsDb } from "@/lib/meets-db";
import { safeMeetFileBase } from "@/lib/meets-format";
import { parseMeetRoomRouteParam } from "@/lib/meets-room-param";

type RouteCtx = { params: Promise<{ room: string }> };

export async function GET(req: Request, ctx: RouteCtx) {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = meetsDb();
    if (!db) {
        return NextResponse.json({ error: "Server storage not configured" }, { status: 503 });
    }
    const { room: raw } = await ctx.params;
    const room = parseMeetRoomRouteParam(raw);
    if (!room) {
        return NextResponse.json({ error: "Invalid room" }, { status: 400 });
    }

    const { data: rows, error } = await db
        .from("meets_chat_messages")
        .select("sender_display, body, created_at")
        .eq("room_name", room)
        .order("created_at", { ascending: true })
        .limit(5000);

    if (error) {
        console.error("meets chat export", error);
        return NextResponse.json({ error: "Failed to load chat" }, { status: 500 });
    }

    const lines = (rows ?? []).map((r) => {
        const t = r.created_at ? new Date(r.created_at).toISOString() : "";
        const who = (r.sender_display || "unknown").replace(/\r?\n/g, " ");
        const body = (r.body || "").replace(/\r?\n/g, "\n");
        return `[${t}] ${who}: ${body}`;
    });
    const text = `Room: ${room}\nExported: ${new Date().toISOString()}\n\n${lines.join("\n\n")}\n`;

    const filename = `meet-${safeMeetFileBase(room)}-chat.txt`;
    return new NextResponse(text, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}
