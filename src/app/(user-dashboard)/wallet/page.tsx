import WalletResult from "./wallet-result";

const WalletPage = ({
  searchParams,
}: {
  searchParams?: { funding?: string | string[] };
}) => {
  const funding = Array.isArray(searchParams?.funding)
    ? searchParams?.funding[0]
    : searchParams?.funding;

  return <WalletResult status={funding === "success" ? "success" : "cancelled"} />;
};

export default WalletPage;
