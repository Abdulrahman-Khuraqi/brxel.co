import Hero from "@/components/home/Hero";
import ServicesList from "@/components/home/ServicesList";
import FeaturedWork from "@/components/home/FeaturedWork";
import Process from "@/components/home/Process";
import ClientStrip from "@/components/home/ClientStrip";
import ContactSection from "@/components/contact/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesList />
      <FeaturedWork />
      <Process />
      <ClientStrip />
      <ContactSection location="home" />
    </>
  );
}
