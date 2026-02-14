/**
 * DELETE /api/comments/:id
 * -----------------------------------------------
 * Removes a comment by ID. Admin-only (requires analytics auth).
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
  const commentId = parseInt(id, 10);

  if (isNaN(commentId) || commentId < 1) {
    return NextResponse.json(
      { error: "Invalid comment ID." },
      { status: 400 }
    );
  }

  try {
    const sql = getDb();

    const result = await sql`
      DELETE FROM blog_comments WHERE id = ${commentId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, deleted: commentId });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment." },
      { status: 500 }
    );
  }
}
