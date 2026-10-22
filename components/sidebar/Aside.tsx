'use client';

import { FileSpreadsheet, Settings } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { NavItems } from '@/app/interfaces/DashboardInterfaces'

export const Aside = ({ navItems }: NavItems) => {
  const [activeSection, setActiveSection] = useState('Dashboard')

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 px-7">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background"><FileSpreadsheet /></div>
          <div><p className="font-semibold tracking-tight">Sheetwise</p><p className="text-xs text-muted-foreground">Data workspace</p></div>
        </div>
        <Separator />
        <div className="flex flex-1 flex-col gap-8 px-4 py-7">
          <div>
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) =>
                <button key={item.label}
                  onClick={() => setActiveSection(item.label)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${activeSection === item.label ? 'bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  {item.icon}{item.label}{item.admin && <Badge className="ml-auto text-[10px]" variant="outline">Admin</Badge>}</button>)}
            </nav>
          </div>
          <div>
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Manage</p>
            <nav className="flex flex-col gap-1">
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                <Settings className="size-4" />
                Settings
              </button>
            </nav>
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-foreground text-background text-xs">{'JM'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{'Jazael'}</p>
              <p className="truncate text-xs text-muted-foreground">{true ? 'Admin' : 'User'}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={(e) => console.log('click')}>Log out</Button>
          </div>
        </div>
      </aside>
    </>
  )
}
