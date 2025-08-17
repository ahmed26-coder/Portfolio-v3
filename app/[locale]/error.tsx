"use client"

import Link from "next/link"
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  const t = useTranslations('error');

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-12">
        {/* Error Visualization */}
        <div className="relative space-y-4">
          <div className="relative mx-auto w-32 h-32">
            {/* Animated background circles */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse"></div>
            <div
              className="absolute inset-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>

            {/* Error icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('Oops')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              {t('my')}
            </p>
          </div>

          <div className="bg-muted text-center flex justify-center rounded-lg p-4 max-w-sm mx-auto">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{t('this')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/25 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t('try')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-2 hover:bg-muted/50 transition-all duration-300 bg-transparent"
          >
            <Link href="/">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {t('go')}
            </Link>
          </Button>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left max-w-md mx-auto">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              {t('error')}
            </summary>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-muted">
              <pre className="text-xs text-muted-foreground overflow-auto whitespace-pre-wrap break-words">
                {error.message}
              </pre>
            </div>
          </details>
        )}

        {/* Portfolio Branding */}
        <div className="pt-4">
          <div className="flex justify-center items-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-muted-foreground/20 to-transparent"></div>
            <div className="text-xs text-muted-foreground font-medium tracking-wider">{t('portfolio')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
