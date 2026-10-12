import Header from "@/src/components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center">
        {children}
      </main>
    </>
  );
}