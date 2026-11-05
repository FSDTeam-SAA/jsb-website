const AccountPanelFrame = ({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => (
  <section className="min-w-0 flex-1 overflow-hidden rounded-[8px] bg-white">
    <header className="border-b border-[#e4eaf8] p-4">
      <h2 className="text-xl font-bold text-[#0e1224]">{title}</h2>
    </header>
    <div className="p-4">{children}</div>
    {footer && <footer className="border-t border-[#e4eaf8] p-4">{footer}</footer>}
  </section>
);

export const fieldClass =
  "mt-2 h-[51px] w-full rounded-[12px] border-0 bg-[#f5f7ff] px-4 text-base text-[#505050] outline-none";

export const SaveButton = () => (
  <button className="flex h-12 w-full items-center justify-center rounded-[6px] bg-[#0073df] px-4 text-base font-medium text-white transition hover:bg-[#0067c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 sm:min-w-[180px] sm:w-auto">
    Save Changes
  </button>
);

export default AccountPanelFrame;
