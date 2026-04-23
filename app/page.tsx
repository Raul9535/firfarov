import type { Metadata } from "next";
import { HomeApproach } from "@/components/sections/home/Approach";
import { HomeFinalCTA } from "@/components/sections/home/FinalCTA";
import { HomeFounderMoment } from "@/components/sections/home/FounderMoment";
import { HomeHero } from "@/components/sections/home/Hero";
import { HomeLatestThinking } from "@/components/sections/home/LatestThinking";
import { HomePositioning } from "@/components/sections/home/Positioning";
import { HomeSelectedWork } from "@/components/sections/home/SelectedWork";
import { HomeServicesOverview } from "@/components/sections/home/ServicesOverview";
import { buildMetadata } from "@/lib/seo/metadata";

const locale = "en" as const;

export const metadata: Metadata = buildMetadata({ locale, path: "/" });

export default function HomePage() {
  return (
    <>
      <HomeHero locale={locale} />
      <HomePositioning locale={locale} />
      <HomeSelectedWork locale={locale} />
      <HomeServicesOverview locale={locale} />
      <HomeFounderMoment locale={locale} />
      <HomeApproach locale={locale} />
      <HomeLatestThinking locale={locale} />
      <HomeFinalCTA locale={locale} />
    </>
  );
}
