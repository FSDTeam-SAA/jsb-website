'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2">
          {error.message || 'An unexpected error occurred.'}
        </p>
        {error.digest && (
          <p className="mt-2 text-sm text-gray-600">
            Error reference: <code className="select-all">{error.digest}</code>
          </p>
        )}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 px-4 py-2 rounded border"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
