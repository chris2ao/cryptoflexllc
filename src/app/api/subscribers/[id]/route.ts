/**
 * DELETE /api/subscribers/:id
 * -----------------------------------------------
 * Removes a subscriber by ID. Protected by analytics auth
 * (admin-only — used from the analytics dashboard).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const subscriberId = parseInt(id, 10);

  if (isNaN(subscriberId) || subscriberId < 1) {
    return NextResponse.json(
      { error: "Invalid subscriber ID." },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();

    const result = await sql`
      DELETE FROM subscribers WHERE id = ${subscriberId}
      RETURNING id, email
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Subscriber not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, deleted: result[0] });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber." },
      { status: 500 }
    );
  }
}
