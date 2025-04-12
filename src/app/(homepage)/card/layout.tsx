import TransactionList from "@/components/share/card/transaction-list";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col xl:flex-row xl:justify-between w-full max-w-[1440px] gap-4 py-4 lg:py-0">
      {/* Main content area - maintain approximate 598px:325px ratio (roughly 65:35) */}
      <div className="w-full xl:w-auto flex-shrink-0">
        {children}
      </div>
      {/* Transaction list - hidden on mobile, visible on md screens and up */}
      <div className="hidden md:block xl:w-[325px] flex-shrink-0">
        <TransactionList />
      </div>
      {/* Mobile transaction list - only visible on small screens */}
      <div className="block md:hidden w-full mt-4 pb-15">
        <TransactionList />
      </div>
    </div>
  );
}
