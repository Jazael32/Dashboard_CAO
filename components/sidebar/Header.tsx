'use client';

import { Bell, Files, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useReducer, useState } from 'react'
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { NavItems } from '@/app/interfaces/DashboardInterfaces';
import { usePathname } from 'next/navigation';
import { getActiveItem } from '@/lib/navigation';
import Link from 'next/link';

export const Header = ({ navItems }: NavItems) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const pathname = usePathname();
  const activeLabel = getActiveItem(navItems, pathname)?.label ?? 'Dashboard';

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-background/90 px-5 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setMobileNav((open) => !open)} aria-label="Toggle navigation">
            <Files className="size-5" />
          </button>
          <div>
            <p className="text-sm text-muted-foreground">Workspace / <span className="text-foreground">{activeLabel}</span></p>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{activeLabel}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />

          {
            mounted &&
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
            </Button>
          }

          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs">{'JM'}</AvatarFallback>
          </Avatar>

        </div>
      </header>
      {mobileNav &&
        <div className="border-b bg-background px-5 py-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map((item) =>
              <Link key={item.label} href={item.path} className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${activeLabel === item.label
                ? 'bg-secondary font-medium text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}>
                {item.icon}
                {item.label}
              </Link>
            )}
          </nav>
        </div>
      }
    </>
  )
}
