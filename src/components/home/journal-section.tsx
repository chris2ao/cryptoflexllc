import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

type Props = {
  posts: BlogPost[];
  totalCount: number;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function JournalSection({ posts, totalCount }: Props) {
  const [featured, ...rest] = posts;
  const listPosts = rest.slice(0, 5);

  return (
    <section id="posts" className="ed-section reveal">
      <div className="ed-section-label">§ 01 / The Blog</div>
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">The Blog</div>
          <h2>
            From the workshop<em>.</em>
          </h2>
          <p className="lede">
            Notes, experiments, and postmortems. Writing is a thinking tool
            here, not a marketing funnel.
          </p>
        </div>

        {featured && (
          <div className="ed-posts-grid">
            <article className="ed-post-hero reveal">
              <Link href={`/blog/${featured.slug}`} className="ed-post-image" aria-label={featured.title}>
                <div className="ed-post-tag-bar">
                  <span className="ed-tag hot">● Lead Story</span>
                </div>
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.coverImageAlt ?? featured.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <span className="ed-post-image-label">Cover / {featured.slug}</span>
                )}
              </Link>
              {featured.tags && featured.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="ed-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h3>
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h3>
              <p>{featured.description}</p>
              <div className="ed-post-meta">
                <span>
                  <b>{featured.readingTime}</b>
                </span>
                <span>{formatDate(featured.date)}</span>
                <span>
                  <Link href={`/blog/${featured.slug}`}>Read →</Link>
                </span>
              </div>
            </article>

            <div className="ed-post-list">
              {listPosts.map((post, i) => {
                const kicker = post.tags?.[0] ?? "Notes";
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="ed-post-row reveal"
                  >
                    <div className="idx">{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <div className="kicker">{kicker}</div>
                      <h4>{post.title}</h4>
                      <div className="byline">
                        {post.readingTime} <span>·</span> {formatDate(post.date)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="ed-posts-footer">
          <span className="count">All posts ({totalCount})</span>
          <Link href="/blog" className="btn-editorial btn-editorial--sm">
            Go to the full archive →
          </Link>
        </div>
      </div>
    </section>
  );
}
