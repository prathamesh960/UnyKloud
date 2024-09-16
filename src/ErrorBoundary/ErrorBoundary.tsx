import React, { Component } from "react";

export default class ErrorBoundary extends Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error: any) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      // You can also log the error to an error reporting service
      console.log("error", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
        <>
            <h1><b>Unexpected Error</b></h1>
              <h3><p>An error has occurred</p></h3>
        </>
        )
      }
      return <>{this.props.children}</>
    }
  }