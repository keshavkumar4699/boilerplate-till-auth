import { Suspense } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        
      </main>
      <Footer />
    </>
  );
}
