import { SectionLabel } from "./section-label";
import { ThirdConflictPromo } from "@/components/third-conflict-promo";
import { CannCannPromo } from "@/components/cann-cann-promo";

type Props = {
  index: number;
};

export function ArcadeSection({ index }: Props) {
  return (
    <section id="arcade" className="ed-section reveal">
      <SectionLabel index={index} name="The Arcade" />
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">Playable Builds</div>
          <h2>Play something I built.</h2>
          <p className="lede">
            Two retro rebuilds, live in the browser. No installs, no
            accounts. Just hit Play.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="reveal">
            <ThirdConflictPromo />
          </div>
          <div className="reveal">
            <CannCannPromo />
          </div>
        </div>
      </div>
    </section>
  );
}
