"use client"

import Link from "next/link"

export function MeetingHeader() {
  const meetingCode = "abc-defg-hij"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingCode)
  }

  return (
    <header className="meeting-header">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link href="/">
          <h1 className="meeting-title">AI Meet</h1>
        </Link>
        <div className="meeting-code">
          <code>{meetingCode}</code>
          <button
            onClick={copyToClipboard}
            style={{ marginLeft: "0.5rem", background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}
            title="Copy meeting code"
          >
            📋
          </button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link href="/">
          <button
            style={{
              padding: "0.25rem 0.75rem",
              background: "none",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
            }}
            title="Leave"
          >
            Leave
          </button>
        </Link>
      </div>
    </header>
  )
}
