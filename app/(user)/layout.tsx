import ChatWidget from "./_components/chatWidget";
import Footer from "./_components/footer";
import NavBar from "./_components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <NavBar />
      {children}
      <ChatWidget />
      <Footer />
    </main>
  );
}
