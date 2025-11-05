import { Button } from "@/components/button"
import { X, Copy } from "lucide-react"
import Link from "next/link"

export function MeetingHeader() {
  const meetingCode = "abc-defg-hij"

  return (
    <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-card">
      <div className="flex items-center gap-4">
        <Link href="/">
          <h1 className="text-lg font-semibold text-foreground hover:text-primary transition">AI Meet</h1>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-background rounded border border-border">
          <code className="text-sm text-muted-foreground">{meetingCode}</code>
          <button className="text-muted-foreground hover:text-foreground">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <X className="w-5 h-5 mr-2" />
          Leave
        </Button>
      </div>
    </header>
  )
}
