export function AboutSection() {
  return (
    <section id="about" className="ed-section reveal">
      <div className="ed-section-label">§ 02 / About the Author</div>
      <div className="ed-wrap">
        <div className="ed-about">
          <div>
            <p className="ed-about-quote">
              If you like engineering that&apos;s pragmatic, iterative, and a
              little experimental, you&apos;ll feel at home here.
            </p>
            <div className="ed-about-attr">
              <b>Chris Johnson</b> — Engineer &amp; Operator
            </div>
          </div>

          <div className="ed-about-prose">
            <p>
              I&apos;m an engineer who uses this blog as a playground. Ship
              things, learn fast, write it down. My career bounced through
              military intelligence, chem/bio defense at the Pentagon, IT
              operations, security engineering, and cloud architecture before
              landing in cybersecurity defense operations, where I spend most
              of my days now.
            </p>
            <p>
              The work here skews toward security engineering, AI-assisted
              development, and the long-tail craft of making things that
              actually run in production. I write because the fastest way to
              learn is to build in public — most posts are postmortems of
              projects I&apos;m actively wrestling with, not tidy retrospectives
              from the other side.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
