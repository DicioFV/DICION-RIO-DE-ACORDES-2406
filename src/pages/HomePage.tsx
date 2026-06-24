import { HeroSearch } from '@/components/home/HeroSearch';
import { StatsSection } from '@/components/home/StatsSection';
import { FeatureGrid } from '@/components/home/FeatureGrid';
import { InstrumentShowcase } from '@/components/home/InstrumentShowcase';
import { RoadmapSection } from '@/components/home/RoadmapSection';

export function HomePage() {
  return (
    <>
      <HeroSearch />
      <StatsSection />
      <FeatureGrid />
      <InstrumentShowcase />
      <RoadmapSection />
    </>
  );
}
