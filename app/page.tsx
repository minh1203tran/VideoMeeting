"use client"

import Link from "next/link"
// import { Button } from "@/components/button"
import { Button } from "../components/button"
import { MicIcon, VideoIcon, PlusIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <VideoIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">AI Meet</h1>
        </div>
        <nav className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition">
            Features
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition">
            Pricing
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-balance text-foreground">Meet Smarter with AI</h2>
                <p className="text-xl text-muted-foreground text-balance">
                  Crystal clear video calls, real-time transcription, and AI-powered meeting summaries all in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/meeting">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                    <VideoIcon className="w-5 h-5 mr-2" />
                    Start Meeting
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border hover:bg-card bg-transparent"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Schedule
                </Button>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <VideoIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">High-definition video</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <MicIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">AI transcription & notes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">Screen sharing & recording</span>
                </div>
              </div>
            </div>

            {/* Right Section - Preview */}
            <div className="relative h-96 lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent rounded-2xl border border-primary/30 overflow-hidden">
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <VideoIcon className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground">Ready for your meeting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© 2025 AI Meet. Powered by advanced AI technology.</p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
