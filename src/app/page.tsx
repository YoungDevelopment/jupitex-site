import HeroSection from "@/components/HeroSection";
import ProblemsSection from "@/components/ProblemsSection";
import AuditSection from "@/components/AuditSection";
import AuditRockSection from "@/components/AuditRockSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white">
      <HeroSection />
      <ProblemsSection />
      <AuditSection />
      {/* <AuditRockSection /> */}
    </main>
  );
}
