{/*TODO: Sidebar icon only at top visible, when scrolling down it disappears*/}

import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { CharacterStats } from "@/components/stats"
import { Axe, Book, Flame, HatGlasses, Heart, Shirt, Star, Sword, User } from 'lucide-react'

export default function ApplicationPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>

        <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>

          <h1 className="text-3xl font-bold tracking-tight">My Character</h1>
          <div className="w-full rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row gap-6 md:items-center">
            
            <div className="w-full md:w-48 aspect-square rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <User className="w-20 h-20"/>
            </div>

            <div className="flex flex-1 flex-col gap-6 w-full">  
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold tracking-tight">User Name </h2>
                <span className="text-md font-bold text-muted-foreground">Level </span>
              </div>
              <div className="flex items-center gap-4">
                <Heart/>
                <CharacterStats 
                label="Health"
                value={85} 
                maxValue={100}
                color="bg-green-600"
                height="h-4"
                />
              </div>
              <div className="flex items-center gap-4">
                <Star/>
                <CharacterStats 
                label="Experience"
                value={15}
                maxValue={100}
                color="bg-yellow-500"
                height="h-4"
                />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Stats</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CharacterStats
            label="Strength" 
            value={45} 
            maxValue={100}
            color="bg-rose-500"
            height="h-2" 
            />

            <CharacterStats
            label="Intelligence" 
            value={90} 
            maxValue={100}
            color="bg-sky-500" 
            height="h-2"
            />
  
            <CharacterStats
            label="Resilience" 
            value={15} 
            maxValue={100}
            color="bg-emerald-500"
            height="h-" 
            />
            
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="min-h-[150px] rounded-xl border border-border bg-muted/20 p-4">
            <div className="w-full w-100 h-100 aspect-rectangle rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <HatGlasses className="w-20 h-20" />
            </div>
            </div>
            <div className="min-h-[150px] rounded-xl border border-border bg-muted/20 p-4">
            <div className="w-full w-100 h-100 aspect-rectangle rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <Shirt className="w-20 h-20" />
            </div>
            </div>
            <div className="min-h-[150px] rounded-xl border border-border bg-muted/20 p-4">
            <div className="w-full w-100 h-100 aspect-rectangle rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <Sword className="w-20 h-20" />
            </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="min-h-[150px] rounded-xl border border-border bg-muted/20 p-4">
            <div className="w-full w-100 h-100 aspect-rectangle rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <Axe className="w-20 h-20" />
            </div>
            </div>
            <div className="min-h-[150px] rounded-xl border border-border bg-muted/20 p-4">
            <div className="w-full w-100 h-100 aspect-rectangle rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <Flame className="w-20 h-20" />
            </div>
            </div>
            <div className="min-h-[150px] rounded-xl border border-border bg-muted/20 p-4">
            <div className="w-full w-100 h-100 aspect-rectangle rounded-xl bg-muted-20 flex items-center justify-center shrink-0">
              <Book className="w-20 h-20" />
            </div>
            </div>
          </div>

        </main>

      </SidebarInset>
    </SidebarProvider>

    
  )
}
