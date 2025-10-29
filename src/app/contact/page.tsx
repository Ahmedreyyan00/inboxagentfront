// "use client";

// import { useState } from "react";
// import { Header } from "@/Components/landing-page/Header";
// import { Footer } from "@/Components/landing-page/Footer";
// import { Container } from "@/Components/landing-page/Container";
// import { Button } from "@/Components/landing-page/Button";
// import Api from "@/lib/Api";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { isValidLanguageCode } from "@/Utils/languageUtils";
// import { ContactPageTranslations } from "@/transalations/CommonTransaltion";

// export default function Contact() {
//   const language = useSelector(
//     (state: RootState) => state.language.activeLanguage
//   );
//   const currentLanguage = isValidLanguageCode(language) ? language : "en";
//   const t = ContactPageTranslations[currentLanguage as "en" | "fr" | "nl"];
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     company: "",
//     subject: "",
//     message: "",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await Api.sendContactForm({
//         name: formData.name,
//         email: formData.email,
//         company: formData.company || undefined,
//         subject: `Contact request: ${formData.subject || "general"}`,
//         message: formData.message,
//         inquiryType: formData.subject || "general",
//       });
//       console.log("Form submitted:", formData);
//     } catch (error) {
//       console.error("Failed to submit contact form:", error);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <>
//       <Header />
//       <main>
//         {/* Hero Section */}
//         <Container className="pt-20 pb-16 text-center lg:pt-32">
//           <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
//             {t.heroTitle1}{" "}
//             <span className="relative whitespace-nowrap text-blue-600">
//               <svg
//                 aria-hidden="true"
//                 viewBox="0 0 418 42"
//                 className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
//                 preserveAspectRatio="none"
//               >
//                 <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
//               </svg>
//               <span className="relative">{t.heroTitle2}</span>
//             </span>
//           </h1>
//           <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
//             {t.heroSubtitle}
//           </p>
//         </Container>

//         {/* Contact Form Section */}
//         <Container className="py-16">
//           <div className="mx-auto max-w-2xl lg:max-w-none">
//             <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
//               {/* Contact Information */}
//               <div className="max-w-xl lg:max-w-lg">
//                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//                   {t.contactInfoHeading}
//                 </h2>
//                 <p className="mt-4 text-lg leading-8 text-slate-600">
//                   {t.contactInfoDescription}
//                 </p>

//                 <div className="mt-10 space-y-6">
//                   <div className="flex gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
//                       <svg
//                         className="h-6 w-6 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">
//                         {t.emailUsLabel}
//                       </h3>
//                       <p className="text-slate-600">{t.emailAddress}</p>
//                     </div>
//                   </div>

//                   {/* <div className="flex gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
//                       <svg
//                         className="h-6 w-6 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">
//                         Call us
//                       </h3>
//                       <p className="text-slate-600">+1 (555) 123-4567</p>
//                     </div>
//                   </div>

//                   <div className="flex gap-4">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
//                       <svg
//                         className="h-6 w-6 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth="1.5"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-slate-900">
//                         Visit us
//                       </h3>
//                       <p className="text-slate-600">
//                         123 Business St, Suite 100
//                         <br />
//                         San Francisco, CA 94105
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-10">
//                   <h3 className="text-lg font-semibold text-slate-900">
//                     Business Hours
//                   </h3>
//                   <div className="mt-2 text-slate-600">
//                     <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
//                     <p>Saturday: 10:00 AM - 4:00 PM PST</p>
//                     <p>Sunday: Closed</p>
//                   </div>
//                 */}
//                 </div> 
//               </div>

//               {/* Contact Form */}
//               <div className="lg:pl-8">
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="name"
//                         className="block text-sm font-medium leading-6 text-slate-900"
//                       >
//                         {t.formFullName}
//                       </label>
//                       <div className="mt-2">
//                         <input
//                           type="text"
//                           name="name"
//                           id="name"
//                           required
//                           value={formData.name}
//                           onChange={handleChange}
//                           className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="block text-sm font-medium leading-6 text-slate-900"
//                       >
//                         {t.formEmail}
//                       </label>
//                       <div className="mt-2">
//                         <input
//                           type="email"
//                           name="email"
//                           id="email"
//                           required
//                           value={formData.email}
//                           onChange={handleChange}
//                           className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="company"
//                       className="block text-sm font-medium leading-6 text-slate-900"
//                     >
//                       {t.formCompany}
//                     </label>
//                     <div className="mt-2">
//                       <input
//                         type="text"
//                         name="company"
//                         id="company"
//                         value={formData.company}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="subject"
//                       className="block text-sm font-medium leading-6 text-slate-900"
//                     >
//                       {t.formSubject}
//                     </label>
//                     <div className="mt-2">
//                       <select
//                         name="subject"
//                         id="subject"
//                         required
//                         value={formData.subject}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//                       >
//                         <option value="">{t.subjectSelectDefault}</option>
//                         <option value="general">{t.subjectGeneral}</option>
//                         <option value="sales">{t.subjectSales}</option>
//                         <option value="support">{t.subjectSupport}</option>
//                         <option value="billing">{t.subjectBilling}</option>
//                         <option value="partnership">{t.subjectPartnership}</option>
//                         <option value="other">{t.subjectOther}</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="message"
//                       className="block text-sm font-medium leading-6 text-slate-900"
//                     >
//                       {t.formMessage}
//                     </label>
//                     <div className="mt-2">
//                       <textarea
//                         name="message"
//                         id="message"
//                         rows={4}
//                         required
//                         value={formData.message}
//                         onChange={handleChange}
//                         className="block w-full rounded-md border-0 px-3.5 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
//                         placeholder={t.formMessagePlaceholder}
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <Button type="submit" color="blue" className="w-full">
//                       {t.formSubmitButton}
//                     </Button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </Container>

//         {/* FAQ Section */}
//         {/* <div className="bg-slate-50 py-16">
//           <Container>
//             <div className="mx-auto max-w-2xl lg:max-w-none">
//               <div className="text-center">
//                 <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//                   {t.faqHeading}
//                 </h2>
//                 <p className="mt-4 text-lg leading-8 text-slate-600">
//                   {t.faqSubheading}
//                 </p>
//               </div>

//               <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
//                 <div className="space-y-8">
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {t.faq1Question}
//                     </h3>
//                     <p className="mt-2 text-slate-600">
//                       {t.faq1Answer}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {t.faq2Question}
//                     </h3>
//                     <p className="mt-2 text-slate-600">
//                       {t.faq2Answer}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {t.faq3Question}
//                     </h3>
//                     <p className="mt-2 text-slate-600">
//                       {t.faq3Answer}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="space-y-8">
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {t.faq4Question}
//                     </h3>
//                     <p className="mt-2 text-slate-600">
//                       {t.faq4Answer}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {t.faq5Question}
//                     </h3>
//                     <p className="mt-2 text-slate-600">
//                       {t.faq5Answer}
//                     </p>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-slate-900">
//                       {t.faq6Question}
//                     </h3>
//                     <p className="mt-2 text-slate-600">
//                       {t.faq6Answer}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Container>
//         </div> */}
//       </main>
//       <Footer />
//     </>
//   );
// }
