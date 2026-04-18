const services = [
  {
    title: "Security Consulting",
    description:
      "Security assessments, vulnerability analysis, and architecture review. Practical risk posture work without the vendor push.",
    items: [
      "Posture assessments",
      "Vulnerability analysis",
      "Architecture review",
      "IR planning",
    ],
  },
  {
    title: "IT Infrastructure",
    description:
      "Network design, server infrastructure, and cloud architecture for small office to hybrid environments.",
    items: [
      "Network design",
      "Server infrastructure",
      "Cloud migration",
      "Performance tuning",
    ],
  },
  {
    title: "IT Strategy",
    description:
      "Technology strategy for small businesses. Make smart decisions without vendor sales pressure.",
    items: [
      "Roadmapping",
      "Vendor-neutral advice",
      "Budget planning",
      "Project management",
    ],
  },
  {
    title: "Web Development",
    description:
      "Modern, fast, secure websites for businesses. Build, host, maintain — one operator, no agency overhead.",
    items: [
      "Custom design & build",
      "Hosting & maintenance",
      "Performance & SEO",
      "Ongoing updates",
    ],
  },
];

export function ConsultingSection() {
  return (
    <section id="services" className="ed-section reveal">
      <div className="ed-section-label">§ 04 / Consulting</div>
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">Services</div>
          <h2>Selective engagements.</h2>
          <p className="lede">
            I take on a small number of projects through CryptoFlex LLC each
            year. Cybersecurity, infrastructure, strategy, web.
          </p>
        </div>
      </div>
      <div className="ed-services">
        {services.map((service, i) => (
          <div key={service.title} className="ed-svc reveal">
            <div className="num">0{i + 1}</div>
            <h4>{service.title}</h4>
            <p>{service.description}</p>
            <ul>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
