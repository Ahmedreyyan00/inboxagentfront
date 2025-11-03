"use client";

import { Container } from "./Container";
import { Button } from "./Button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { LandingTranslations } from "@/transalations/CommonTransaltion";
import { Check, Shield } from "lucide-react";
import { IoRocket } from "react-icons/io5";

export function Hero({
  forceSingleLineFirst = true,
  breakSecondAfterComma = true,
}: {
  forceSingleLineFirst?: boolean;
  breakSecondAfterComma?: boolean;
}) {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = LandingTranslations[currentLanguage];
  const heroMatch = (t.heroLine1 || "").match(/^(.*?,\s*)(.*)$/);
  const heroPrefix = heroMatch ? heroMatch[1] : t.heroLine1 || "";
  const heroHighlight = heroMatch ? heroMatch[2] : "";
  const heroLine2Match = (t.heroLine2 || "").match(/^(.*?,)(\s*)(.*)$/);
  const heroLine2First = heroLine2Match ? heroLine2Match[1] : t.heroLine2 || "";
  const heroLine2Rest = heroLine2Match ? heroLine2Match[3] : "";
  return (
    <Container className="pt-20 pb-16 text-center lg:pt-32">
      <h1 className="mx-auto max-w-4xl font-display font-medium tracking-tight text-slate-900 leading-[1.1] text-[clamp(2rem,8vw,4.5rem)] break-words">
        <span className={forceSingleLineFirst ? "lg:whitespace-nowrap" : ""}>
          {heroPrefix}
          {heroHighlight && (
            <span className="relative inline-flex items-baseline text-blue-600 max-w-full">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="pointer-events-none absolute inset-x-0 bottom-[0.05em] h-[0.6em] md:h-[0.55em] w-full max-w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative inline-block align-baseline">{heroHighlight}</span>
            </span>
          )}
        </span>
        <br />
        {breakSecondAfterComma && heroLine2Match ? (
          <>
            {heroLine2First}
            <br />
            {heroLine2Rest}
          </>
        ) : (
          t.heroLine2
        )}
      </h1>

      <p className="mx-auto mt-6 max-w-2xl tracking-tight text-slate-700 text-[clamp(1rem,2.8vw,1.125rem)]">
        {t.heroSubtext1}
        {t.heroSubtext2}
      </p>
      {/* <p className="mx-auto mt-1 max-w-2xl text-lg tracking-tight text-slate-700">{t.heroSubtext2}</p> */}
      <div className="mt-10 flex justify-center gap-x-6">
        <Button href="/register">{t.heroCta}</Button>
      </div>
      <div className="mt-20 lg:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {(t.heroPillars || []).map((p: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="flex justify-center mb-4">
                {idx === 0 && (
                  <div className="relative size-[clamp(2.75rem,6vw,4rem)]">
                    <Shield
                      className="size-[clamp(2.75rem,6vw,4rem)] text-[#155dfc] fill-[#155dfc]"
                      stroke="none"
                    />
                    <Check
                      className="absolute inset-0 m-auto size-[clamp(1.375rem,3.2vw,2rem)] text-white"
                      strokeWidth={3}
                    />
                  </div> // <svg className="h-16 w-16 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm-1 15-5-5 1.414-1.414L11 13.172l6.586-6.586L19 8z"/></svg>
                )}
                {idx === 1 && (
                  <Check className="text-blue-600 size-[clamp(2.75rem,6vw,4rem)]" />
                  // <svg className="h-16 w-16 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                )}
                {idx === 2 && (
                  <IoRocket className="text-blue-600 size-[clamp(2.75rem,6vw,4rem)]" />
                  // <svg className="h-16 w-16 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z"/></svg>
                )}
              </div>
              <h3 className="font-extrabold tracking-tight text-slate-900 mb-2 text-[clamp(1.25rem,3.5vw,1.875rem)]">
                {p.title}
              </h3>
              <p className="text-slate-700 text-[clamp(1rem,2.8vw,1.125rem)]">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
