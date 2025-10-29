// "use client";

// import { Header } from "@/Components/landing-page/Header";
// import { Footer } from "@/Components/landing-page/Footer";
// import { Container } from "@/Components/landing-page/Container";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { isValidLanguageCode } from "@/Utils/languageUtils";
// import { PrivacyPageTranslations } from "@/transalations/CommonTransaltion";

// export default function Privacy() {
//   const language = useSelector(
//     (state: RootState) => state.language.activeLanguage
//   );
//   const currentLanguage = isValidLanguageCode(language) ? language : "en";
//   const t = PrivacyPageTranslations[currentLanguage as "en" | "fr" | "nl"];

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
//                 Effective Date: <span className="font-semibold">{t.effectiveDate}</span>
//               </p>
//               <p className="mt-6 text-base text-slate-700 max-w-2xl mx-auto">
//                 {t.intro}{" "}
//                 <a href="https://app.smartle.be" className="text-blue-600 hover:text-blue-800 underline">app.smartle.be</a> {t.andOurServices}
//               </p>
//             </div>
//           </Container>
//         </div>

//         {/* Content Section */}
//         <Container className="py-16 lg:py-20">
//           <div className="mx-auto max-w-4xl">
//             <div className="space-y-20 flex flex-col gap-6">
              
//               {/* Section 1 */}
//               <section className="scroll-mt-16" id="who-are-we">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     1
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section1Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section1Intro}
//                     </p>
//                     <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
//                       <p className="font-semibold text-slate-900 text-lg mb-2">{t.companyName}</p>
//                       <p className="text-slate-700">{t.companyAddress1}</p>
//                       <p className="text-slate-700">{t.companyAddress2}</p>
//                       <p className="text-slate-700 mt-2">{t.companyNumber}</p>
//                       <p className="mt-3">
//                         <span className="text-slate-700">📧 </span>
//                         <a href="mailto:contact@smartle.be" className="text-blue-600 hover:text-blue-800 font-medium">
//                           contact@smartle.be
//                         </a>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 2 */}
//               <section className="scroll-mt-16" id="data-collected">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     2
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section2Title}
//                     </h2>
//                     <p className="text-slate-700 mb-6">
//                       {t.section2Intro}
//                     </p>
//                     <div className="space-y-4">
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataIdentification}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataIdentificationDesc}</p>
//                       </div>
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataProfessional}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataProfessionalDesc}</p>
//                       </div>
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataBilling}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataBillingDesc}</p>
//                       </div>
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataMessaging}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataMessagingDesc}</p>
//                       </div>
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataTechnical}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataTechnicalDesc}</p>
//                       </div>
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataAnalytics}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataAnalyticsDesc}</p>
//                       </div>
//                       <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                         <h3 className="font-semibold text-slate-900 mb-2">{t.dataCookies}</h3>
//                         <p className="text-slate-700 text-sm">{t.dataCookiesDesc}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 3 */}
//               <section className="scroll-mt-16" id="processing-purposes">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     3
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section3Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section3Intro}
//                     </p>
//                     <ul className="space-y-3">
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose1}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose2}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose3}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose4}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose5}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose6}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">✓</span>
//                         <span className="text-slate-700">{t.purpose7}</span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 4 */}
//               <section className="scroll-mt-16" id="legal-basis">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     4
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section4Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section4Intro}
//                     </p>
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3">
//                         <span className="text-blue-600 font-semibold mt-0.5">•</span>
//                         <p className="text-slate-700">
//                           <span className="font-semibold">{t.basisContract}</span> {t.basisContractDesc}
//                         </p>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <span className="text-blue-600 font-semibold mt-0.5">•</span>
//                         <p className="text-slate-700">
//                           <span className="font-semibold">{t.basisLegitimate}</span> {t.basisLegitimateDesc}
//                         </p>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <span className="text-blue-600 font-semibold mt-0.5">•</span>
//                         <p className="text-slate-700">
//                           <span className="font-semibold">{t.basisConsent}</span> {t.basisConsentDesc}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 5 */}
//               <section className="scroll-mt-16" id="data-recipients">
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
//                     <ul className="space-y-2 mb-4">
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">→</span>
//                         <span className="text-slate-700">{t.recipient1}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">→</span>
//                         <span className="text-slate-700">{t.recipient2}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">→</span>
//                         <span className="text-slate-700">{t.recipient3}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">→</span>
//                         <span className="text-slate-700">{t.recipient4}</span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="text-blue-600 mt-1">→</span>
//                         <span className="text-slate-700">{t.recipient5}</span>
//                       </li>
//                     </ul>
//                     <p className="text-slate-700 font-medium">
//                       {t.section5Footer}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 6 */}
//               <section className="scroll-mt-16" id="data-retention">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     6
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section6Title}
//                     </h2>
//                     <p className="text-slate-700 mb-6">
//                       {t.section6Intro}
//                     </p>
//                     <div className="overflow-x-auto">
//                       <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
//                         <thead>
//                           <tr className="bg-blue-600 text-white">
//                             <th className="px-6 py-4 text-left font-semibold">{t.tableDataType}</th>
//                             <th className="px-6 py-4 text-left font-semibold">{t.tableRetentionPeriod}</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200">
//                           <tr className="hover:bg-slate-50">
//                             <td className="px-6 py-4 text-slate-700">{t.retentionUserAccount}</td>
//                             <td className="px-6 py-4 text-slate-700">{t.retentionUserAccountPeriod}</td>
//                           </tr>
//                           <tr className="hover:bg-slate-50">
//                             <td className="px-6 py-4 text-slate-700">{t.retentionInvoiceData}</td>
//                             <td className="px-6 py-4 text-slate-700">{t.retentionInvoiceDataPeriod}</td>
//                           </tr>
//                           <tr className="hover:bg-slate-50">
//                             <td className="px-6 py-4 text-slate-700">{t.retentionTechnicalLogs}</td>
//                             <td className="px-6 py-4 text-slate-700">{t.retentionTechnicalLogsPeriod}</td>
//                           </tr>
//                           <tr className="hover:bg-slate-50">
//                             <td className="px-6 py-4 text-slate-700">{t.retentionMarketingData}</td>
//                             <td className="px-6 py-4 text-slate-700">{t.retentionMarketingDataPeriod}</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                     <p className="text-slate-700 mt-4">
//                       {t.section6Footer}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 7 */}
//               <section className="scroll-mt-16" id="cookies">
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
//               <section className="scroll-mt-16" id="security">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     8
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section8Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section8Intro}
//                     </p>
//                     <p className="text-slate-700 font-semibold mb-3">{t.section8Examples}</p>
//                     <div className="grid sm:grid-cols-2 gap-3">
//                       <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//                         <span className="text-green-600">🔒</span>
//                         <span className="text-slate-700 text-sm">{t.security1}</span>
//                       </div>
//                       <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//                         <span className="text-green-600">🔐</span>
//                         <span className="text-slate-700 text-sm">{t.security2}</span>
//                       </div>
//                       <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//                         <span className="text-green-600">🛡️</span>
//                         <span className="text-slate-700 text-sm">{t.security3}</span>
//                       </div>
//                       <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
//                         <span className="text-green-600">📄</span>
//                         <span className="text-slate-700 text-sm">{t.security4}</span>
//                       </div>
//                     </div>
//                     <p className="text-slate-700 mt-4 italic">
//                       {t.section8Footer}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 9 */}
//               <section className="scroll-mt-16" id="your-rights">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     9
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section9Title}
//                     </h2>
//                     <p className="text-slate-700 mb-4">
//                       {t.section9Intro}
//                     </p>
//                     <div className="grid sm:grid-cols-2 gap-3 mb-4">
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//                         <p className="text-slate-900 font-medium">{t.rightAccess}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//                         <p className="text-slate-900 font-medium">{t.rightRectification}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//                         <p className="text-slate-900 font-medium">{t.rightErasure}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//                         <p className="text-slate-900 font-medium">{t.rightRestriction}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//                         <p className="text-slate-900 font-medium">{t.rightObject}</p>
//                       </div>
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
//                         <p className="text-slate-900 font-medium">{t.rightPortability}</p>
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 border-l-4 border-blue-600 rounded-r-lg p-4">
//                       <p className="text-slate-900 font-medium mb-1">{t.rightComplaint}</p>
//                     </div>
//                     <p className="text-slate-700 mt-6">
//                       {t.section9Footer}{" "}
//                       <span className="text-slate-700">📧 </span>
//                       <a href="mailto:contact@smartle.be" className="text-blue-600 hover:text-blue-800 font-medium underline">
//                         contact@smartle.be
//                       </a>
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 10 */}
//               <section className="scroll-mt-16" id="data-location">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     10
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section10Title}
//                     </h2>
//                     <p className="text-slate-700 mb-3">
//                       {t.section10Text1}
//                     </p>
//                     <p className="text-slate-700">
//                       {t.section10Text2}
//                     </p>
//                   </div>
//                 </div>
//               </section>

//               {/* Section 11 */}
//               <section className="scroll-mt-16" id="modifications">
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

//               {/* Section 12 - Contact */}
//               <section className="scroll-mt-16" id="contact">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-lg flex-shrink-0">
//                     12
//                   </div>
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                       {t.section12Title}
//                     </h2>
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
//                       <p className="text-slate-700 mb-3">
//                         {t.section12Intro}
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
