import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { meetsDb } from "@/lib/meets-db";
import { parseMeetRoomRouteParam } from "@/lib/meets-room-param";

type RouteCtx = { params: Promise<{ room: string }> };

export async function GET(req: Request, ctx: RouteCtx) {
    const user = await getAuthUser(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { room: raw } = await ctx.params;
    const room = parseMeetRoomRouteParam(raw);
    if (!room) {
        return NextResponse.json({ error: "Invalid room" }, { status: 400 });
    }

    const db = meetsDb();
    let chatCount = 0;
    if (db) {
        const { count } = await db
            .from("meets_chat_messages")
            .select("id", { count: "exact", head: true })
            .eq("room_name", room);
        chatCount = count ?? 0;
    }

    return NextResponse.json({
        room,
        chatMessageCount: chatCount,
        chatTxtPath: `/api/meets/session/${encodeURIComponent(room)}/chat.txt`,
    });
}
