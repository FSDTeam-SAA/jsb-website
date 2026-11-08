import AccountPanelFrame from "./account-panel-frame";
import ComparePlans from "./compare-plans";
import InvoiceHistory from "./invoice-history";
import SubscriptionPlanCard from "./subscription-plan-card";

const SubscriptionPanel = () => (
  <AccountPanelFrame title="Subscription Plan">
    <SubscriptionPlanCard />
    <ComparePlans />
    <InvoiceHistory />
  </AccountPanelFrame>
);

export default SubscriptionPanel;
