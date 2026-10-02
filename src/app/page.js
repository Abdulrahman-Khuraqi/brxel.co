import Hero from "@/components/home/Hero";
import HomeMarquee from "@/components/home/HomeMarquee";
import ServicesList from "@/components/home/ServicesList";
import Stats from "@/components/home/Stats";
import WorkGrid from "@/components/home/WorkGrid";
import ClientStrip from "@/components/home/ClientStrip";
import HomeContact from "@/components/home/HomeContact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeMarquee />
      <ServicesList />
      <WorkGrid />
      <Stats />
      <ClientStrip />
      <HomeContact />
    </>
  );
}
