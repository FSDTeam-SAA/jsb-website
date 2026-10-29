import DashboardSidebar from "./_components/dashboard-sidebar";
import DashboardHeader from "./_components/dashboard-header";

const DashboardOverviewLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen bg-[#f6f9fd]">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardOverviewLayout;
