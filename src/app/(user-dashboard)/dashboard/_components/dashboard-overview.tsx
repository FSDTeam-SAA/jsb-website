import DashboardActivity from "./dashboard-activity";
import DashboardMarketplace from "./dashboard-marketplace";
import DashboardSummary from "./dashboard-summary";
import LeadPreviewController from "./lead-preview-controller";

const DashboardOverview = () => {
  return (
    <main className="min-w-0 flex-1 bg-[#f6f9fd] px-4 py-5 md:px-6">
      <section className="mx-auto max-w-[1640px]">
        <div>
          <h2 className="text-[18px] font-bold text-[#17212e]">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-[12px] text-[#667085]">
            Welcome back, John! Here&apos;s an overview of your account and the
            latest opportunities.
          </p>
        </div>
        <div className="mt-4">
          <DashboardSummary />
        </div>
        <DashboardActivity />
        <DashboardMarketplace />
        <LeadPreviewController />
      </section>
    </main>
  );
};

export default DashboardOverview;
