// "use client";

// import { Header } from "@/Components/landing-page/Header";
// import { Footer } from "@/Components/landing-page/Footer";
// import { Container } from "@/Components/landing-page/Container";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { isValidLanguageCode } from "@/Utils/languageUtils";
// import { TermsPageTranslations } from "@/transalations/CommonTransaltion";

// export default function Terms() {
//   const language = useSelector(
//     (state: RootState) => state.language.activeLanguage
//   );
//   const currentLanguage = isValidLanguageCode(language) ? language : "en";
//   const t = TermsPageTranslations[currentLanguage as "en" | "fr" | "nl"];

//   return (
//     <>
//       <Header />
//       <main className="bg-white">
//         {/* Hero Section */}
//         <div className="bg-gradient-to-b from-blue-50 to-white py-20 sm:py-24">
//           <Container>
//             <div className="mx-auto max-w-4xl text-center">
//               <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
//                 {t.title}
//               </h1>
//               <p className="mt-4 text-lg text-slate-600">
//                 Last updated: <span className="font-semibold">{t.lastUpdated}</span>
//               </p>
//             </div>
//           </Container>
//         </div>

//         {/* Content Section */}
//         <Container className="py-16 lg:py-20">
//           <div className="mx-auto max-w-4xl">
//             <div className="space-y-20 flex flex-col gap-6">
              
//               {/* Section 1 */}
//               <section className="scroll-mt-16" id="introduction">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     1
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section1Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section1Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 2 */}
//               <section className="scroll-mt-16" id="acceptance">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     2
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section2Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section2Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 3 */}
//               <section className="scroll-mt-16" id="eligibility">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     3
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section3Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section3Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 4 */}
//               <section className="scroll-mt-16" id="user-obligations">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     4
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section4Title}
//                     </h2>
//                     <ul className="space-y-3">
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.obligation1}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.obligation2}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.obligation3}</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 5 */}
//               <section className="scroll-mt-16" id="email-access">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     5
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section5Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section5Intro}
//                     </p>
//                     <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-6">
//                       <div className="flex items-start gap-3">
//                         <span className="text-blue-600 font-semibold mt-0.5">•</span>
//                         <p className="text-slate-700">{t.privacy1}</p>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <span className="text-blue-600 font-semibold mt-0.5">•</span>
//                         <p className="text-slate-700">{t.privacy2}</p>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <span className="text-blue-600 font-semibold mt-0.5">•</span>
//                         <p className="text-slate-700">{t.privacy3}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 6 */}
//               <section className="scroll-mt-16" id="data-handling">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     6
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section6Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section6Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 7 */}
//               <section className="scroll-mt-16" id="intellectual-property">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     7
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section7Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section7Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 8 */}
//               <section className="scroll-mt-16" id="third-party">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     8
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section8Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section8Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 9 */}
//               <section className="scroll-mt-16" id="disclaimers">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     9
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section9Title}
//                     </h2>
//                     <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
//                       <p className="text-slate-700">
//                         {t.section9Text}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 10 */}
//               <section className="scroll-mt-16" id="limitation-liability">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     10
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section10Title}
//                     </h2>
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                       <p className="text-slate-700">
//                         {t.section10Text}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 11 */}
//               <section className="scroll-mt-16" id="termination">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     11
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section11Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section11Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 12 */}
//               <section className="scroll-mt-16" id="governing-law">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     12
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section12Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section12Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 13 */}
//               <section className="scroll-mt-16" id="changes">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     13
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section13Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section13Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 14 - Contact */}
//               <section className="scroll-mt-16" id="contact">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     14
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section14Title}
//                     </h2>
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//                       <p className="text-slate-700 mb-3">
//                         {t.section14Intro}
//                       </p>
//                       <a 
//                         href="mailto:contact@smartle.be" 
//                         className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                       >
//                         <span>📧</span>
//                         <span>contact@smartle.be</span>
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//             </div>
//           </div>
//         </Container>
//       </main>
//       <Footer />
//     </>
//   );
// }
