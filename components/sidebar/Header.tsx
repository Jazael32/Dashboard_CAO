'use client';

import { Bell, Files, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useReducer, useState } from 'react'
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { dashboardReducer, initialState } from '@/app/reducers/DashboardReducer';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { NavItems } from '@/app/interfaces/DashboardInterfaces';

export const Header = ({ navItems }: NavItems) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-background/90 px-5 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <button className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={
            () => dispatch({ type: 'TOGGLE_MOBILE_NAV' })} aria-label="Toggle navigation">
            <Files className="size-5" />
          </button>
          <div>
            <p className="text-sm text-muted-foreground">Workspace / <span className="text-foreground">{state.activeSection}</span></p>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{state.activeSection}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
          </Button>

          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs">{'JM'}</AvatarFallback>
          </Avatar>

        </div>
      </header>

      {state.mobileNav &&
        <div className="border-b bg-background px-5 py-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            {navItems.map((item) =>
              <Button key={item.label} variant={state.activeSection === item.label ? 'secondary' : 'ghost'} size="sm" onClick={() => { dispatch({ type: 'SET_ACTIVE_SECTION', payload: item.label }); dispatch({ type: 'TOGGLE_MOBILE_NAV' }) }}>
                {item.icon}{item.label}
              </Button>
            )}
          </nav>
        </div>
      }
    </>
  )
}
