"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, ClipboardList, BarChart, Settings, LogOut } from "lucide-react"

type SidebarItem = {
  title: string
  href: string
  icon: React.ReactNode
}

const teacherItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard/teacher",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Lesson Plans",
    href: "/dashboard/teacher/lesson-planner",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Assignments",
    href: "/dashboard/teacher/assignments",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/dashboard/teacher/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
]

export function Sidebar({ role = 'teacher' }: { role?: string }) {
  const pathname = usePathname()
  const items = role === 'teacher' ? teacherItems : []

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/dashboard">
            <span>ProxiLearn</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  pathname === item.href ? "bg-gray-100 dark:bg-gray-800" : ""
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <form action="/auth/signout" method="post" className="w-full">
            <Button type="submit" variant="ghost" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
