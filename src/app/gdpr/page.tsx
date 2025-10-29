// "use client";

// import { Header } from "@/Components/landing-page/Header";
// import { Footer } from "@/Components/landing-page/Footer";
// import { Container } from "@/Components/landing-page/Container";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { isValidLanguageCode } from "@/Utils/languageUtils";
// import { GDPRPageTranslations } from "@/transalations/CommonTransaltion";

// export default function GDPR() {
//   const language = useSelector(
//     (state: RootState) => state.language.activeLanguage
//   );
//   const currentLanguage = isValidLanguageCode(language) ? language : "en";
//   const t = GDPRPageTranslations[currentLanguage as "en" | "fr" | "nl"];

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
//               <p className="mt-6 text-base text-slate-700 max-w-2xl mx-auto">
//                 {t.subtitle}
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
//               <section className="scroll-mt-16" id="lawful-basis">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     2
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section2Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section2Intro}
//                     </p>
//                     <div className="space-y-4">
//                       <div className="bg-white border-l-4 border-blue-600 rounded-r-lg p-4 shadow-sm">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.basisConsent}</h3>
//                         <p className="text-slate-700 text-sm">{t.basisConsentDesc}</p>
//                       </div>
//                       <div className="bg-white border-l-4 border-green-600 rounded-r-lg p-4 shadow-sm">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.basisContractual}</h3>
//                         <p className="text-slate-700 text-sm">{t.basisContractualDesc}</p>
//                       </div>
//                       <div className="bg-white border-l-4 border-purple-600 rounded-r-lg p-4 shadow-sm">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.basisLegal}</h3>
//                         <p className="text-slate-700 text-sm">{t.basisLegalDesc}</p>
//                       </div>
//                       <div className="bg-white border-l-4 border-orange-600 rounded-r-lg p-4 shadow-sm">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.basisLegitimate}</h3>
//                         <p className="text-slate-700 text-sm">{t.basisLegitimateDesc}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 3 */}
//               <section className="scroll-mt-16" id="your-rights">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     3
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section3Title}
//                     </h2>
//                     <p className="text-slate-700 mb-6">
//                       {t.section3Intro}
//                     </p>
//                     <div className="grid gap-4">
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">📖</span>
//                           {t.rightAccess}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightAccessDesc}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">✏️</span>
//                           {t.rightRectification}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightRectificationDesc}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">🗑️</span>
//                           {t.rightErasure}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightErasureDesc}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">⏸️</span>
//                           {t.rightRestriction}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightRestrictionDesc}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">📦</span>
//                           {t.rightPortability}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightPortabilityDesc}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">🚫</span>
//                           {t.rightObject}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightObjectDesc}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
//                           <span className="text-blue-600">↩️</span>
//                           {t.rightWithdraw}
//                         </h3>
//                         <p className="text-slate-700 text-sm">{t.rightWithdrawDesc}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 4 */}
//               <section className="scroll-mt-16" id="data-transfers">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     4
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section4Title}
//                     </h2>
//                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
//                       <p className="text-slate-700 mb-3">
//                         {t.section4Text1}
//                       </p>
//                       <p className="text-slate-700">
//                         {t.section4Text2}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 5 */}
//               <section className="scroll-mt-16" id="data-retention">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     5
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section5Title}
//                     </h2>
//                     <p className="text-slate-700">
//                       {t.section5Text}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 6 */}
//               <section className="scroll-mt-16" id="automated-processing">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     6
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section6Title}
//                     </h2>
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-6">
//                       <p className="text-slate-700">
//                         {t.section6Text}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 7 */}
//               <section className="scroll-mt-16" id="complaints">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     7
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section7Title}
//                     </h2>
//                     <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-6">
//                       <p className="text-slate-700 mb-3">
//                         {t.section7Text1}
//                       </p>
//                       <p className="text-slate-700 font-medium">
//                         {t.section7Text2}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 8 - Contact */}
//               <section className="scroll-mt-16" id="contact">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     8
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section8Title}
//                     </h2>
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//                       <p className="text-slate-700 mb-3">
//                         {t.section8Intro}
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
