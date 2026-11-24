import { Footer } from "@/components/layout/Footer";
import { IndexRail } from "@/components/nav/IndexRail";
import { Nav } from "@/components/nav/Nav";
import { Arrival } from "@/components/sections/Arrival";
import { Beyond } from "@/components/sections/Beyond";
import { Conversation } from "@/components/sections/Conversation";
import { Distinction } from "@/components/sections/Distinction";
import { Engagement } from "@/components/sections/Engagement";
import { Idea } from "@/components/sections/Idea";
import { People } from "@/components/sections/People";
import { Room } from "@/components/sections/Room";

export default function Home() {
  return (
    <>
      <Nav />
      <IndexRail />
      <main id="main">
        <Arrival />
        <Idea />
        <Distinction />
        <Room />
        <Conversation />
        <Beyond />
        <People />
        <Engagement />
      </main>
      <Footer />
    </>
  );
}
