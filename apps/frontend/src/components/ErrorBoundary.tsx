'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Stagewise Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 fallback UI 렌더링 (기본적으로 아무것도 렌더링하지 않음)
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}
