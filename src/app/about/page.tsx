import { Header } from "@/Components/landing-page/Header";
import { Footer } from "@/Components/landing-page/Footer";
import { Container } from "@/Components/landing-page/Container";
import { Button } from "@/Components/landing-page/Button";

export default function About() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <Container className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            About{' '}
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Smartle</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            We're revolutionizing accounting for small businesses with intelligent automation and user-friendly design.
          </p>
        </Container>

        {/* Mission Section */}
        <Container className="py-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
              <div className="max-w-xl lg:max-w-lg">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Our Mission
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  We believe that accounting software should be both powerful and intuitive. Our mission is to simplify 
                  financial management for small businesses by combining cutting-edge AI technology with an interface 
                  that anyone can use.
                </p>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Smartle automates invoice processing, expense tracking, and financial reporting, giving you more 
                  time to focus on growing your business instead of managing paperwork.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Automated Processing</h3>
                    <p className="text-slate-600">AI-powered invoice extraction and categorization</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Lightning Fast</h3>
                    <p className="text-slate-600">Process invoices in seconds, not hours</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Secure & Reliable</h3>
                    <p className="text-slate-600">Bank-level security with 99.9% uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Story Section */}
        <div className="bg-slate-50 py-16">
          <Container>
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
                <div className="max-w-xl lg:max-w-lg">
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Our Story
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-600">
                    Smartle was born from a simple observation: small business owners were spending countless hours 
                    on manual accounting tasks that could be automated. We saw the frustration of entrepreneurs 
                    drowning in paperwork when they should be focusing on their passion.
                  </p>
                  <p className="mt-6 text-lg leading-8 text-slate-600">
                    Our team of engineers, designers, and accountants came together to create a solution that 
                    combines the power of artificial intelligence with the simplicity that small businesses need. 
                    The result is Smartle - accounting software that actually works for you, not against you.
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="rounded-2xl bg-white p-8 shadow-lg">
                    <blockquote className="text-lg leading-8 text-slate-600">
                      "We're not just building software, we're building a future where small business owners 
                      can focus on what they do best - running their business."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-semibold">SM</span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Smartle Team</div>
                        <div className="text-slate-600">Founders & Engineers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Values Section */}
        <Container className="py-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Our Values
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The principles that guide everything we do
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">User-Centric</h3>
                <p className="mt-2 text-slate-600">
                  Every feature is designed with the user in mind. We prioritize simplicity and usability over complexity.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Innovation</h3>
                <p className="mt-2 text-slate-600">
                  We continuously push the boundaries of what's possible with AI and automation in accounting.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Transparency</h3>
                <p className="mt-2 text-slate-600">
                  We believe in clear communication, honest pricing, and transparent processes in everything we do.
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <Container className="py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to simplify your accounting?
              </h2>
              <p className="mt-4 text-lg leading-8 text-blue-100">
                Join thousands of small businesses who have already made the switch to Smartle.
              </p>
              <div className="mt-8 flex justify-center gap-x-6">
                <Button href="/signup" color="white">
                  Get started today
                </Button>
                <Button href="/contact" variant="outline" color="white">
                  Contact us
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  )
}
