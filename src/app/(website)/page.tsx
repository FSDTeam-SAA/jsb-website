import React from "react";
import Hero from './_components/hero'
import Faq from "./_components/faq";
import ReadyToStart from "./_components/ready-to-start";
import ExploreLeadTypes from "./_components/explore-lead-types";
import OurPlan from "./_components/our-plan";
import HowItWorks from "./_components/how-it-works";
import PowerfulLead from "./_components/powerful-lead";
import LeadsForTheMarket from "./_components/leads-for-the-market";

const HomePage = () => {
  return (
    <main className="overflow-x-clip">
      <Hero/>

      <ExploreLeadTypes />
      <HowItWorks />
      <OurPlan />
      <PowerfulLead />
      <LeadsForTheMarket />
      <Faq />
      <ReadyToStart />
    </main>
  );
};

export default HomePage;
