import { Footer } from "@/components/layout/Footer";
import { IndexRail } from "@/components/nav/IndexRail";
import { Nav } from "@/components/nav/Nav";
import { Arrival } from "@/components/sections/Arrival";
import { StageStub } from "@/components/sections/StageStub";
import {
  beyond,
  conversation,
  distinction,
  engagement,
  idea,
  people,
  room,
  stages,
} from "@/content/site";

// Stages 02–08 are Phase 2. Stubs carry only their real headlines.
const stubs = [
  { headline: idea.headline, ground: "black" },
  { headline: distinction.headline, ground: "green" },
  { headline: room.headline, ground: "black" },
  { headline: conversation.headline, ground: "green" },
  { headline: beyond.headline, ground: "black" },
  { headline: people.headline, ground: "green" },
  { headline: engagement.headline, ground: "black" },
] as const;

export default function Home() {
  return (
    <>
      <Nav />
      <IndexRail />
      <main id="main">
        <Arrival />
        {stubs.map((s, i) => (
          <StageStub key={stages[i + 1].id} stage={stages[i + 1]} ground={s.ground} headline={s.headline} />
        ))}
      </main>
      <Footer />
    </>
  );
}
