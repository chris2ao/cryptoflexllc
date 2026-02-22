/**
 * PATCH /api/guestbook/:id  - Approve a guestbook entry
 * DELETE /api/guestbook/:id - Delete a guestbook entry
 * -----------------------------------------------
 * Admin-only (requires analytics auth).
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";

interface Props {
  params: Promise<{ id: string }>;
}

function parseId(raw: string): number | null {
  const id = parseInt(raw, 10);
  return isNaN(id) || id < 1 ? null : id;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const entryId = parseId(id);
  if (entryId === null) {
    return NextResponse.json({ error: "Invalid entry ID." }, { status: 400 });
  }

  try {
    const sql = getDb();

    const result = await sql`
      UPDATE guestbook SET approved = true WHERE id = ${entryId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, approved: entryId });
  } catch (error) {
    console.error("Approve guestbook entry error:", error);
    return NextResponse.json(
      { error: "Failed to approve entry." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const entryId = parseId(id);
  if (entryId === null) {
    return NextResponse.json({ error: "Invalid entry ID." }, { status: 400 });
  }

  try {
    const sql = getDb();

    const result = await sql`
      DELETE FROM guestbook WHERE id = ${entryId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Entry not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: entryId });
  } catch (error) {
    console.error("Delete guestbook entry error:", error);
    return NextResponse.json(
      { error: "Failed to delete entry." },
      { status: 500 }
    );
  }
}
