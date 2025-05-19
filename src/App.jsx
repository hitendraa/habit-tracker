import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Sheet, SheetTrigger, SheetContent } from "./components/ui/sheet";
import { ScrollArea } from "./components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { HabitBrowser } from './components/dashboard/HabitBrowser';
import { AddHabitForm } from './components/dashboard/AddHabitForm'; 
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)
import { FloatingDock } from './components/custom/floating-dock'
import { Card } from './components/ui/card'
import { IconHome, IconCalendar, IconChartBar, IconSettings, IconPlus } from '@tabler/icons-react'
import { WeatherWidget } from './components/dashboard/WeatherWidget'
import { CalendarWidget } from './components/dashboard/CalendarWidget'
import { QuoteOfDay } from './components/dashboard/QuoteOfDay'
import { TodoList } from './components/dashboard/TodoList'
import { FriendsActivity } from './components/dashboard/FriendsActivity'
import { SuggestedHabits } from './components/dashboard/SuggestedHabits'
import { FavoriteHabits } from './components/dashboard/FavoriteHabits'
import { Achievements } from './components/dashboard/Achievements'
import { WeeklyProgress } from './components/dashboard/WeeklyProgress'
import { AppIntegrations } from './components/dashboard/AppIntegrations'
import { HabitProvider } from './lib/habit-context'
import { AchievementProvider } from './lib/achievement-context'
import { format } from 'date-fns'

function App() {
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const appRef = useRef(null)
  const iconRef = useRef(null)
  const habitTextRef = useRef(null)
  const trackerTextRef = useRef(null)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Navigation items for the dock
  const handleNavClick = (action) => (e) => {
    e.preventDefault();
    switch(action) {
      case 'home':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'calendar':
        setCalendarOpen(true);
        break;
      case 'add':
        document.getElementById('add-habit-dialog')?.click();
        break;
      case 'stats':
        setStatsOpen(true);
        break;
      case 'settings':
        setSettingsOpen(true);
        break;
    }
  };

  const NAVIGATION_ITEMS = [
    {
      title: 'Home',
      icon: <IconHome className="w-12 h-12" />,
      href: "#home",
      onClick: handleNavClick('home')
    },
    {
      title: 'Calendar',
      icon: <IconCalendar className="w-12 h-12" />,
      href: "#calendar",
      onClick: handleNavClick('calendar')
    },
    {
      title: 'Add Habit',
      icon: <IconPlus className="w-12 h-12" />,
      href: "#add",
      onClick: handleNavClick('add')
    },
    {
      title: 'Statistics',
      icon: <IconChartBar className="w-12 h-12" />,
      href: "#stats",
      onClick: handleNavClick('stats')
    },
    {
      title: 'Settings',
      icon: <IconSettings className="w-12 h-12" />,
      href: "#settings",
      onClick: handleNavClick('settings')
    }
  ]

  useEffect(() => {
    // Initial loading animation
    if (loading) {
      // Create timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setLoading(false);
        }
      })

      // Set initial states
      gsap.set(habitTextRef.current, { 
        opacity: 0,
        x: -100,
        translateX: "2rem"
      });
      gsap.set(trackerTextRef.current, { 
        opacity: 0,
        x: 100,
        translateX: "-2rem"
      });
      gsap.set(iconRef.current, { 
        x: "-100vw",
        rotate: 0,
        scale: 1
      });

      // Animate icon spinning in from left with overshoot
      tl.to(iconRef.current, {
        x: "15vw",  // Overshoot to the right
        rotate: 1080, // Reduce to 3 rotations for slower spin
        duration: 2.5,
        ease: "power2.out"
      }, "forward")
      .set(iconRef.current, {
        rotate: 1440 // Set to 4 rotations
      }, "switch")
      .to(iconRef.current, {
        x: 0,  // Return to center
        rotate: 1080, // Back to 3 rotations
        duration: 1.8,
        ease: "power1.out"
      }, "switch+=0.01") // Start immediately after the switch

      // Fade in text from sides
      tl.to([habitTextRef.current, trackerTextRef.current], {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1
      })

      // Move everything up together
      tl.to([habitTextRef.current, trackerTextRef.current, iconRef.current], {
        y: "-40vh",
        duration: 2,
        ease: "power3.inOut"
      })
      
      // Smooth transition from face to dot
      tl.to(iconRef.current.querySelector('.face-features'), {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
      }, "-=2")

      // Fade in the dot
      tl.to(iconRef.current.querySelector('.dot'), {
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut"
      }, "-=1.5")

      // Fade out the main circle stroke
      tl.to(iconRef.current.querySelector('.main-circle'), {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
      }, "-=1.5")

      // Scale down the icon
      tl.to(iconRef.current, {
        scale: 0.3,
        duration: 2,
        ease: "power3.inOut"
      }, "-=2")
      
      // Move text closer together
      tl.to(habitTextRef.current, {
        translateX: "3rem",  // Increased from 0.7rem
        duration: 2,
        ease: "power3.inOut"
      }, "-=2")
      
      tl      .to(trackerTextRef.current, {
        translateX: "-3rem",  // Increased from -0.7rem
        duration: 2,
        ease: "power3.inOut"
      }, "-=2")
      
      // After initial animation, set up scroll trigger
      .call(() => {
        // Create scroll trigger for main content
        gsap.to([habitTextRef.current, iconRef.current, trackerTextRef.current], {
          scale: 0.8,
          opacity: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: appRef.current,
            start: "top top",
            end: "25% top",
            scrub: true
          }
        });
      })
    }

    // Text fade out animation
    gsap.to([habitTextRef.current, iconRef.current, trackerTextRef.current], {
      scale: 0.9,
      opacity: 0,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: appRef.current,
        start: "top top",
        end: "30% top",
        scrub: 1.5,
        smoothing: true
      }
    });

    // Card slide up animation
    gsap.fromTo(".main-card", 
      { 
        yPercent: 0
      },
      {
        yPercent: -20,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: appRef.current,
          start: "top top",
          end: "30% top",
          scrub: 1.5,
          smoothing: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading])

  return (
    <HabitProvider>
      <AchievementProvider>
        <div ref={appRef} className="bg-background w-full h-[200vh] text-primary font-sans">
          {/* Main Title Group */}
          <div className="fixed w-full text-center z-50" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <div className="relative flex items-center justify-center">
              <span ref={habitTextRef} className="text-[180px] text-primary translate-x-[2rem] font-['Luckiest_Guy']">Habit</span>
              
              {/* Rotating Icon */}
              <div ref={iconRef} className="w-40 h-40 text-primary inline-flex items-center mx-2">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="main-circle" fill="currentColor" fillOpacity="0.1" />
                  <g className="face-features">
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                  </g>
                  <circle cx="12" cy="12" r="10" className="dot" fill="currentColor" opacity="0" />
                </svg>
              </div>
              
              <span ref={trackerTextRef} className="text-[180px] text-primary -translate-x-[2rem] font-['Luckiest_Guy']">Tracker</span>
            </div>
          </div>
          
          {/* Navigation Dock */}
          <div 
            className={`fixed inset-0 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
            style={{ visibility: loading ? 'hidden' : 'visible' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
              style={{ marginTop: '20vh' }}
            >
              <Card className="main-card sticky top-[80vh] left-0 w-full min-h-screen bg-card/80 text-card-foreground shadow-lg border border-border/50 backdrop-blur-sm overflow-y-auto transition-all duration-300">
                <div className="p-6">
                  {/* Main 4-Column Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <h1 className="text-3xl font-bold">
                          Happy {format(currentTime, 'EEEE')} <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-gray-500">{format(currentTime, 'dd MMM yyyy, h:mm a')}</p>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button id="add-habit-dialog" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 flex items-center justify-center gap-2 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">New Habits</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Habit</DialogTitle>
                          </DialogHeader>
                          <AddHabitForm onClose={() => document.querySelector('[role="dialog"]')?.close()} />
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="w-full bg-white border border-gray-200 rounded-full py-3 hover:bg-gray-50 transition-colors">
                            <span className="font-medium">Browse Popular Habits</span>
                          </button>
                        </DialogTrigger>
                        <HabitBrowser />
                      </Dialog>

                      <CalendarWidget />
                      <QuoteOfDay />
                    </div>

                    {/* Second Column */}
                    <div className="space-y-6">
                      <WeatherWidget />
                      <SuggestedHabits />
                      <FriendsActivity />
                    </div>

                    {/* Third Column */}
                    <div className="space-y-6">
                      <TodoList />
                      <FavoriteHabits />
                    </div>

                    {/* Fourth Column */}
                    <div className="space-y-6">
                      <Achievements />
                      <WeeklyProgress />
                      <AppIntegrations />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
            <FloatingDock 
              items={NAVIGATION_ITEMS} 
              desktopClassName="fixed bottom-4 left-1/2 -translate-x-1/2 z-10" 
              mobileClassName="fixed bottom-4 right-4"
            />
          </div>

          {/* Calendar Dialog */}
          <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Calendar View</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <CalendarWidget className="rounded-lg" />
              </div>
            </DialogContent>
          </Dialog>

          {/* Statistics Dialog */}
          <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Statistics & Analytics</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="habits">Habits</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                  <ScrollArea className="h-[500px] mt-4">
                    <TabsContent value="overview">
                      <WeeklyProgress />
                    </TabsContent>
                    <TabsContent value="habits">
                      <FavoriteHabits showAll />
                    </TabsContent>
                    <TabsContent value="achievements">
                      <Achievements expanded />
                    </TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>

          {/* Settings Dialog */}
          <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-gradient-to-b from-background/80 to-background border-l border-border/40 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <IconSettings className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-primary">Settings</h2>
              </div>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50 rounded-xl">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[600px] mt-6 pr-4">
                  <TabsContent value="general">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Push Notifications</label>
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Daily Reminders</label>
                            <input type="checkbox" className="toggle" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Weekly Reports</label>
                            <input type="checkbox" className="toggle" />
                          </div>
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <label className="text-sm font-medium">Smart Reminders</label>
                              <p className="text-xs text-muted-foreground">AI-powered timing based on your activity</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                              <input type="checkbox" className="toggle" disabled />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Backup & Sync</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <label className="text-sm font-medium">Cloud Backup</label>
                              <p className="text-xs text-muted-foreground">Auto-backup to secure cloud storage</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                              <input type="checkbox" className="toggle" disabled />
                            </div>
                          </div>
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <label className="text-sm font-medium">Cross-Device Sync</label>
                              <p className="text-xs text-muted-foreground">Real-time sync across all devices</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                              <input type="checkbox" className="toggle" disabled />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="appearance">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Theme</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Dark Mode</label>
                            <input type="checkbox" className="toggle" />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Compact View</label>
                            <input type="checkbox" className="toggle" />
                          </div>
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <label className="text-sm font-medium">Custom Themes</label>
                              <p className="text-xs text-muted-foreground">Create and apply custom color schemes</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                              <button className="px-3 py-1 text-sm border rounded-md" disabled>Customize</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Animations</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between opacity-50">
                            <div>
                              <label className="text-sm font-medium">Advanced Animations</label>
                              <p className="text-xs text-muted-foreground">Enhanced visual feedback and transitions</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                              <input type="checkbox" className="toggle" disabled />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="premium" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Premium Features</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between opacity-50">
                          <div>
                            <label className="text-sm font-medium">AI Habit Coach</label>
                            <p className="text-xs text-muted-foreground">Personalized recommendations and insights</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                            <button className="px-3 py-1 text-sm border rounded-md" disabled>Upgrade</button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                          <div>
                            <label className="text-sm font-medium">Advanced Analytics</label>
                            <p className="text-xs text-muted-foreground">Detailed insights and trend analysis</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                            <button className="px-3 py-1 text-sm border rounded-md" disabled>Upgrade</button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                          <div>
                            <label className="text-sm font-medium">Habit Groups</label>
                            <p className="text-xs text-muted-foreground">Create and join habit-forming communities</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Coming Soon</span>
                            <button className="px-3 py-1 text-sm border rounded-md" disabled>Upgrade</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="integrations">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1 p-1.5 rounded-md border opacity-50">
                          <div className="flex-1 min-w-0">
                            <label className="text-xs font-medium">Apple Health</label>
                          </div>
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded-full">Soon</span>
                        </div>
                        <div className="flex items-center gap-1 p-1.5 rounded-md border opacity-50">
                          <div className="flex-1 min-w-0">
                            <label className="text-xs font-medium">Google Calendar</label>
                          </div>
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded-full">Soon</span>
                        </div>
                        <div className="flex items-center gap-1 p-1.5 rounded-md border opacity-50">
                          <div className="flex-1 min-w-0">
                            <label className="text-xs font-medium">Spotify</label>
                          </div>
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-1 py-0.5 rounded-full">Soon</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <AppIntegrations />
                      </div>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </SheetContent>
          </Sheet>
        </div>
      </AchievementProvider>
    </HabitProvider>
  )
}

export default App