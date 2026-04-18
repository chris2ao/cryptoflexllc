type TickerItem = { label: string; value: string; accent?: boolean };

type Props = {
  items: TickerItem[];
};

function TrackItems({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <div key={`${item.label}-${i}`} className="ed-ticker-item">
          <span>{item.label}</span>
          <b className={item.accent ? "ac" : undefined}>{item.value}</b>
          <span className="ed-ticker-sep" aria-hidden="true">
            ◆
          </span>
        </div>
      ))}
    </>
  );
}

export function TickerStrip({ items }: Props) {
  return (
    <div className="ed-ticker" aria-label="Site statistics">
      <div className="ed-ticker-track" aria-hidden="true">
        <TrackItems items={items} />
        <TrackItems items={items} />
      </div>
      <span className="sr-only">
        {items.map((item) => `${item.label} ${item.value}`).join(". ")}
      </span>
    </div>
  );
}
