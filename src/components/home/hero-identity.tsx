import Image from "next/image";
import Link from "next/link";

export function HeroIdentity() {
  const today = new Date();
  const issueNum = String(
    Math.floor((today.getTime() - new Date("2024-01-01").getTime()) / (7 * 24 * 60 * 60 * 1000))
  ).padStart(3, "0");
  const dateStr = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="ed-hero">
      <div className="ed-wrap ed-hero-inner">
        <div className="ed-hero-meta-row">
          <span>
            ISSUE <b>#{issueNum}</b>
          </span>
          <span>CRYPTOFLEX / ENGINEERING LAB</span>
          <span>{dateStr.toUpperCase()}</span>
        </div>

        <div className="ed-hero-grid">
          <div>
            <div className="ed-overline reveal">
              Personal journal · Field notes
            </div>
            <h1 className="ed-hero-title">
              Build in public.
              <br />
              <span className="it">Break things</span>
              <br />
              <span className="accent">on purpose.</span>
            </h1>
            <p className="ed-hero-sub reveal">
              Long-form writing on security engineering, AI-assisted
              development, and the craft of shipping things that actually work.
              Stream-of-consciousness notes from a working lab, not a brochure.
            </p>
            <div className="ed-hero-cta-row reveal">
              <Link href="/blog" className="btn-editorial btn-editorial--primary">
                Read the journal →
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
                  src="/hero-portrait.png"
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
              Engineer · Builder · Researcher
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
