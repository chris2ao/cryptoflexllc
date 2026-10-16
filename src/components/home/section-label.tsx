type Props = {
  index: number;
  name: string;
};

/** "§ 03 / Selected Work". The index comes from page.tsx so numbering lives in one place. */
export function SectionLabel({ index, name }: Props) {
  return (
    <div className="ed-section-label">
      § {String(index).padStart(2, "0")} / {name}
    </div>
  );
}
