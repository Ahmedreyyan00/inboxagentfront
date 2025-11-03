"use client";
import { CallToAction } from "@/Components/landing-page/CallToAction";
import { Faqs } from "@/Components/landing-page/Faqs";
import { Footer } from "@/Components/landing-page/Footer";
import { Header } from "@/Components/landing-page/Header";
import { Hero } from "@/Components/landing-page/Hero";
import { Pricing } from "@/Components/landing-page/Pricing";
import { PrimaryFeatures } from "@/Components/landing-page/PrimaryFeatures";
import { SecondaryFeatures } from "@/Components/landing-page/SecondaryFeatures";
import { Testimonials } from "@/Components/landing-page/Testimonials";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";



export default function Home() {


  const router = useRouter();

  useEffect(() => {
     router.push("/dashboard");
         }, []);


  return (
    <>
      {/* <Header /> */}
      {/* <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction /> */}
        {/* <Testimonials /> */}
        {/* <Pricing />
        <Faqs />
      </main> */}
      {/* <Footer /> */}
    </>
  )
}
