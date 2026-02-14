/**
 * DELETE /api/comments/:id
 * -----------------------------------------------
 * Removes a comment by ID. Supports two authorization paths:
 * 1. Admin auth (verifyApiAuth) — can delete any comment
 * 2. Subscriber ownership — can delete own comment (email must match)
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Props) {
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

    // Check if admin authenticated
    const isAdmin = verifyApiAuth(request);

    if (isAdmin) {
      // Admin path: can delete any comment
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
    }

    // Subscriber path: verify ownership
    const body = await request.json().catch(() => ({}));
    const email = (body.email ?? "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { error: "Unauthorized. Email required for subscriber deletion." },
        { status: 403 }
      );
    }

    // Fetch the comment to verify ownership
    const comments = await sql`
      SELECT id, email FROM blog_comments WHERE id = ${commentId}
    `;

    if (comments.length === 0) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    const comment = comments[0];

    // Verify email matches comment owner
    if (comment.email.toLowerCase() !== email) {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own comments." },
        { status: 403 }
      );
    }

    // Delete the comment
    await sql`
      DELETE FROM blog_comments WHERE id = ${commentId}
    `;

    return NextResponse.json({ ok: true, deleted: commentId });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment." },
      { status: 500 }
    );
  }
}
