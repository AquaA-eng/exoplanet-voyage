import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import './styles/themes.css'

/* If anything crashes at runtime, show the actual error on screen
   instead of a blank page. Diagnosis over mystery. */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '3rem 1.5rem', maxWidth: 560, margin: '0 auto', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: 18, marginBottom: 12 }}>Something crashed — here's the actual error:</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, background: 'rgba(200,60,60,0.1)', padding: '1rem', borderRadius: 8 }}>
            {String(this.state.error && (this.state.error.stack || this.state.error.message || this.state.error))}
          </pre>
          <p style={{ fontSize: 13, marginTop: 12 }}>Screenshot this and send it to Claude.</p>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
