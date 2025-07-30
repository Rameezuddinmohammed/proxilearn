"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/hooks/use-sidebar"
import { UserNav } from "./user-nav"

export function Header() {
  const { toggle } = useSidebar()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={toggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      <div className="flex items-center gap-2 md:gap-4">
        <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
      </div>
      <div className="ml-auto flex items-center gap-4
      ">
        <UserNav />
      </div>
    </header>
  )
}
