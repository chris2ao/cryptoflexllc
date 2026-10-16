import Image from "next/image";
import Link from "next/link";
import { formatPostDateShort } from "@/lib/post-date";

type Props = {
  postCount: number;
  latestDate?: string;
};

export function HeroIdentity({ postCount, latestDate }: Props) {
  return (
    <section className="ed-hero">
      <div className="ed-wrap ed-hero-inner">
        <div className="ed-hero-meta-row">
          <span>
            NO. <b>{postCount}</b>
          </span>
          <span className="ed-hero-meta-mid">CRYPTOFLEX / ENGINEERING LAB</span>
          {latestDate && (
            <span>
              UPDATED <b>{formatPostDateShort(latestDate).toUpperCase()}</b>
            </span>
          )}
        </div>

        <div className="ed-hero-grid">
          <div>
            <div className="ed-overline reveal">
              Personal blog · Field notes
            </div>
            <h1 className="ed-hero-title">
              Build in public.
              <br />
              <span className="it">Break things</span>
              <br />
              <span className="accent">on purpose.</span>
            </h1>
            <p className="ed-hero-sub reveal">
              I work in cybersecurity defense and build with AI agents on my
              own time. This is where I write it all down: the security
              reviews, the home-lab SOC, the agent workflows, and the bugs
              that got past all of them.
            </p>
            <div className="ed-hero-cta-row reveal">
              <Link href="/blog" className="btn-editorial btn-editorial--primary">
                Read the blog →
              </Link>
              <Link href="/about" className="btn-editorial">
                About Chris
              </Link>
            </div>
          </div>

          <div>
            <div className="ed-hero-portrait">
              <div className="ed-hero-portrait-frame">
                <Image
                  src="/hero-portrait.webp"
                  alt="Chris Johnson"
                  width={300}
                  height={400}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <p className="ed-hero-portrait-caption">
              <b>Chris Johnson</b>
              <br />
              Security Engineer · Builder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
