import { CreditCard, Headphones, KeyRound, Trash2, UserRound } from "lucide-react";

const items = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "password", label: "Change Password", icon: KeyRound },
  { id: "subscription", label: "Subscription Plan", icon: CreditCard },
  { id: "support", label: "Contact & Support", icon: Headphones },
] as const;

export type AccountTab = (typeof items)[number]["id"];

const AccountSettingsNav = ({ active, onChange, onDelete }: { active: AccountTab; onChange: (tab: AccountTab) => void; onDelete: () => void }) => (
  <aside className="h-fit w-full shrink-0 rounded-[8px] bg-white p-3 lg:w-[421px]">
    <h2 className="border-b border-[#e4eaf8] pb-4 text-xl font-bold text-[#0e1224]">Settings</h2>
    <nav className="mt-4 space-y-2">
      {items.map(({ id, label, icon: Icon }) => {
        const selected = active === id;

        return (
          <button key={id} onClick={() => onChange(id)} className={`flex min-h-[40px] w-full items-center gap-2 rounded-[8px] px-2 text-left text-sm font-medium transition ${selected ? "bg-[#0073df] text-white" : "text-[#676767] hover:bg-[#f5f7ff]"}`}>
            <Icon size={20} strokeWidth={1.8} />
            {label}
          </button>
        );
      })}
      <div className="my-4 border-t border-[#e4eaf8]" />
      <button onClick={onDelete} className="flex min-h-[40px] w-full items-center gap-2 rounded-[8px] px-2 text-left text-sm font-medium text-[#ef4444] transition hover:bg-[#fff1f2]">
        <Trash2 size={20} strokeWidth={1.8} />
        Delete Account
      </button>
    </nav>
  </aside>
);

export default AccountSettingsNav;
