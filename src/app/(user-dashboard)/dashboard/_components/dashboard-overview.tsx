import DashboardActivity from "./dashboard-activity";
import DashboardMarketplace from "./dashboard-marketplace";
import DashboardSummary from "./dashboard-summary";

const DashboardOverview = () => {
  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-4 md:px-6">
      <section className="mx-auto max-w-[1640px]">
        <div>
          <h2 className="text-xl font-bold leading-none text-[#0e1224]">
            Dashboard Overview
          </h2>
          <p className="mt-2 text-base leading-6 text-[#545454]">
            Welcome back, John! Here&apos;s an overview of your account and the
            latest opportunities.
          </p>
        </div>
        <div className="mt-4">
          <DashboardSummary />
        </div>
        <DashboardActivity />
        <DashboardMarketplace />
      </section>
    </main>
  );
};

export default DashboardOverview;
