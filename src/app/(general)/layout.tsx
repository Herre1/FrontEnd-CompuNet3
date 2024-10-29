import { Navbar } from "@/components/nav-bar/NavBar";
import { Providers } from "@/store/Providers";

export default function GeneralLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <Providers>
        {children}
      </Providers>
    </div>
  );
}