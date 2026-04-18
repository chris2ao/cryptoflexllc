type CVEntry = {
  year: string;
  role: string;
  company: string;
  where: string;
};

const entries: CVEntry[] = [
  {
    year: "Today",
    role: "Cybersecurity Defense Operations",
    company: "Security engineering & SOC — detection, response, resilience.",
    where: "Florida",
  },
  {
    year: "Mid 2020s",
    role: "Security Engineer & Cloud Architect",
    company: "Hardened systems, designed controls, built cloud infrastructure.",
    where: "Remote",
  },
  {
    year: "Early 2020s",
    role: "IT Operations",
    company: "Service desk, project management, developer work across the stack.",
    where: "Various",
  },
  {
    year: "Late 2010s",
    role: "Chem/Bio Defense",
    company: "Mission-critical operations at the Pentagon and US Capitol.",
    where: "Washington, DC",
  },
  {
    year: "Earlier",
    role: "Intelligence & Combat Operations",
    company: "US military — analyst and combat veteran (Iraq, Afghanistan).",
    where: "Deployed",
  },
];

export function CVTimeline() {
  return (
    <section id="cv" className="ed-section reveal">
      <div className="ed-section-label">§ 05 / Career Log</div>
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">CV / Timeline</div>
          <h2>A working history.</h2>
          <p className="lede">
            Unusual path into security engineering. Every stop left a fingerprint
            on how I build now.
          </p>
        </div>

        <div className="ed-cv-list">
          {entries.map((entry) => (
            <div key={entry.role} className="ed-cv-row reveal">
              <div className="yr">{entry.year}</div>
              <div className="role">
                {entry.role}
                <small>{entry.company}</small>
              </div>
              <div className="where">{entry.where}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
