import type { ErrorInfo, ReactNode } from 'react'

import { Component } from 'react'

import { ErrorFallback } from './error-fallback'

interface ErrorBoundaryProps {
  children: ReactNode
  variant?: 'full' | 'content'
}

interface ErrorBoundaryState {
  error: unknown
}

/**
 * ด่านสุดท้ายสำหรับ error ที่หลุดจาก router (เช่น error ใน provider)
 * error ภายใน route จะถูกจับโดย errorComponent ของ TanStack Router ก่อนถึงตรงนี้
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    // จุดเชื่อมกับระบบ monitoring (เช่น Sentry) ในอนาคต
    console.error('Uncaught error:', error, info.componentStack)
  }

  private readonly handleRetry = () => {
    this.setState({ error: null })
  }

  override render() {
    if (this.state.error) {
      return (
        <ErrorFallback error={this.state.error} onRetry={this.handleRetry} variant={this.props.variant ?? 'full'} />
      )
    }

    return this.props.children
  }
}
