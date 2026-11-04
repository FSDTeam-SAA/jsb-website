import MembershipInformationCard from "./membership-information-card";
import RecentOrdersCard from "./recent-orders-card";
import SavedSearchesCard from "./saved-searches-card";

const DashboardActivity = () => (
  <section className="mt-4 grid gap-4 xl:grid-cols-[2.47fr_1.645fr_1.645fr]">
    <RecentOrdersCard />
    <SavedSearchesCard />
    <MembershipInformationCard />
  </section>
);

export default DashboardActivity;
