import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FloatingDock } from './components/custom/floating-dock'
import { 
  IconHome,
  IconCalendar,
  IconChartBar,
  IconSettings,
  IconPlus
} from '@tabler/icons-react'
import { Card } from './components/ui/card'
import {motion} from "motion/react";
import { Plus, Clock, MapPin, Calendar, Search } from 'lucide-react'


function App() {
  const [loading, setLoading] = useState(true)
  const appRef = useRef(null)
  const iconRef = useRef(null)
  const habitTextRef = useRef(null)
  const trackerTextRef = useRef(null)

  // Navigation items for the dock (will be used later)
  const NAVIGATION_ITEMS = [
    {
      title: 'Home',
      icon: <IconHome className="w-12 h-12" />,
      href: '/'
    },
    {
      title: 'Calendar',
      icon: <IconCalendar className="w-12 h-12" />,
      href: '/calendar'
    },
    {
      title: 'Add Habit',
      icon: <IconPlus className="w-12 h-12" />,
      href: '/add'
    },
    {
      title: 'Statistics',
      icon: <IconChartBar className="w-12 h-12" />,
      href: '/stats'
    },
    {
      title: 'Settings',
      icon: <IconSettings className="w-12 h-12" />,
      href: '/settings'
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
      
      tl.to(trackerTextRef.current, {
        translateX: "-3rem",  // Increased from -0.7rem
        duration: 2,
        ease: "power3.inOut"
      }, "-=2")
    }
  }, [loading])

  return (
    <div ref={appRef} className="bg-background w-full h-screen overflow-hidden text-primary font-sans">
      {/* Main Title Group */}
      <div className="fixed text-[180px] font-bold z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex items-baseline">
          <span ref={habitTextRef} className="text-primary translate-x-[2rem] font-['Luckiest_Guy']">Habit</span>
          
          {/* Rotating Icon */}
          <div ref={iconRef} className="w-40 h-40 text-primary inline-flex items-baseline mx-2">
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
          
          <span ref={trackerTextRef} className="text-primary -translate-x-[2rem] font-['Luckiest_Guy']">Tracker</span>
        </div>
      </div>
      
      {/* Navigation Dock */}
      <div 
        className={`fixed inset-0 transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-[600px]"
          >
            <Card className="fixed top-50 left-1/2 -translate-x-1/2 z-10 w-full h-full max-w-[98%] max-h-[100vh] bg-card/80 text-card-foreground shadow-lg border border-border/50 backdrop-blur-sm overflow-y-auto">
              <motion.div 
                className="opacity-0"
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="p-6">
                  {/* Main 4-Column Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <h1 className="text-3xl font-bold">
                          Happy Tuesday <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-gray-500">30 Dec 2023, 10:03 am</p>
                      </div>

                      <button className="w-full bg-gradient-to-r from-orange-300 to-orange-200 rounded-full py-3 flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span className="font-medium">New Habits</span>
                      </button>

                      <button className="w-full bg-white border border-gray-200 rounded-full py-3">
                        <span className="font-medium">Browse Popular Habits</span>
                      </button>

                      {/* Calendar */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">December, 2023</h2>
                          <div className="flex gap-2">
                            <button className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <span>&lt;</span>
                            </button>
                            <button className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <span>&gt;</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2 text-center">
                          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                            <div key={i} className="text-sm font-medium">
                              {day}
                            </div>
                          ))}

                          {[...Array(31)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
                                ${i === 4 || i === 19 || i === 29 ? "bg-orange-100" : ""}
                                ${i === 8 || i === 15 || i === 21 || i === 27 ? "border border-orange-300" : ""}
                                ${i === 29 ? "bg-orange-400 text-white" : ""}
                              `}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 text-sm text-green-600 font-medium">+3.2% from last month</div>
                      </div>

                      {/* Mobile App Promo */}
                      <div className="bg-white rounded-xl p-3 shadow-sm relative overflow-hidden">
                        <div className="flex items-center">
                          <div className="w-1/4">
                            <div className="w-[60px] h-[60px] bg-gradient-to-br from-orange-200 to-orange-100 rounded-xl flex items-center justify-center text-2xl">
                              📱
                            </div>
                          </div>
                          <div className="w-3/4">
                            <h3 className="text-base font-bold">Mobile App Coming Soon!</h3>
                            <p className="text-gray-500 text-xs mb-2">Be the first to try our mobile app.</p>
                            <button className="bg-gray-900 text-white rounded-full px-3 py-1 text-xs">Join Waitlist</button>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="h-5 w-5 bg-yellow-300 rounded-full flex items-center justify-center">✨</div>
                        </div>
                      </div>

                      {/* Quote of the Day */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-bold">Quote of the Day</h2>
                          <button className="text-xs bg-amber-100 px-2 py-1 rounded-full">Share</button>
                        </div>
                        <p className="text-gray-600 italic">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
                        <p className="text-right text-sm text-gray-500 mt-2">- Winston Churchill</p>
                      </div>
                    </div>

                    {/* Second Column */}
                    <div className="space-y-6">
                      {/* Weather Widget */}
                      <div className="bg-amber-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-bold">Weather</h2>
                          <button className="text-gray-500 text-sm">View Details</button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="bg-white rounded-full p-2">
                              <span className="text-2xl">☀️</span>
                            </div>
                          </div>
                          <div className="text-5xl font-bold">12°C</div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Wind</div>
                            <div className="font-medium">2-4 km/h</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Pressure</div>
                            <div className="font-medium">102m</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Humidity</div>
                            <div className="font-medium">42%</div>
                          </div>
                        </div>

                        <div className="absolute bottom-0 right-0 opacity-10">
                          <div className="text-[150px]">🌤️</div>
                        </div>
                      </div>

                      {/* Should Do Section */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold">Should Do!</h2>
                          <button className="text-gray-500 text-sm">View Details</button>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-3 mb-3 flex items-center gap-3">
                          <div className="bg-amber-200 h-10 w-10 rounded-lg flex items-center justify-center text-xl">💪</div>
                          <div className="flex-1">
                            <div className="font-medium">We go jjjmmm!!</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <span>👍</span> 4.2k love this
                            </div>
                          </div>
                          <div>
                            <span>&gt;</span>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="bg-red-100 h-10 w-10 rounded-lg flex items-center justify-center text-xl">⏰</div>
                          <div className="flex-1">
                            <div className="font-medium">The 5am club</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <span>👍</span> 5.4k love this
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Friends Activity */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Friends Activity</h2>
                          <button className="text-gray-500 text-sm">View All</button>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                              SM
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Sarah M.</div>
                              <div className="text-sm text-gray-500">Completed morning yoga 🧘‍♀️</div>
                            </div>
                            <div className="text-xs text-gray-400">2m ago</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                              JD
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">John D.</div>
                              <div className="text-sm text-gray-500">Hit 10k steps goal 🚶</div>
                            </div>
                            <div className="text-xs text-gray-400">15m ago</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                              AK
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Alex K.</div>
                              <div className="text-sm text-gray-500">Started meditation streak ✨</div>
                            </div>
                            <div className="text-xs text-gray-400">25m ago</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Third Column */}
                    <div className="space-y-6">
                      {/* Today's Todos */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold">Today's Todos</h2>
                          <button className="text-gray-500 text-sm">View Details</button>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-xl">🐝</div>
                            <div className="flex-1">
                              <div className="font-medium">Study</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>10:00-am</span>
                                <span className="mx-1">•</span>
                                <MapPin className="h-4 w-4" />
                                <span>K-Cafe</span>
                              </div>
                            </div>
                            <div className="h-6 w-6 border border-gray-200 rounded"></div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🛒</div>
                            <div className="flex-1">
                              <div className="font-medium">Groceries</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>02:00pm</span>
                                <span className="mx-1">•</span>
                                <MapPin className="h-4 w-4" />
                                <span>Hayday Market</span>
                              </div>
                            </div>
                            <div className="h-6 w-6 border border-gray-200 rounded"></div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">🥗</div>
                            <div className="flex-1">
                              <div className="font-medium line-through">Eat Healthy Food</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>08:30am</span>
                                <span className="mx-1">•</span>
                                <MapPin className="h-4 w-4" />
                                <span>Home</span>
                              </div>
                            </div>
                            <div className="h-6 w-6 bg-green-500 rounded flex items-center justify-center text-white">✓</div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏊‍♂️</div>
                            <div className="flex-1">
                              <div className="font-medium line-through">Swimming for 45min</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>06:00am</span>
                                <span className="mx-1">•</span>
                                <MapPin className="h-4 w-4" />
                                <span>Gym Pool</span>
                              </div>
                            </div>
                            <div className="h-6 w-6 bg-green-500 rounded flex items-center justify-center text-white">✓</div>
                          </div>
                        </div>
                      </div>

                      {/* Favorite Habits */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Favorite Habits</h2>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input type="text" placeholder="Search" className="pl-8 pr-4 py-1 border rounded-lg text-sm w-32" />
                            </div>
                            <select className="border rounded-lg text-sm py-1 px-2">
                              <option>December</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2 text-center text-sm mb-4">
                          {["Fri 11", "Fri 12", "Fri 13", "Fri 14", "Fri 15"].map((day, i) => (
                            <div key={i}>{day}</div>
                          ))}
                        </div>

                        <div className="h-64 relative">
                          <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                            <div className="w-1/5 px-1">
                              <div className="bg-yellow-200 h-16 rounded-t-lg text-center relative">
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                  <div className="text-xs">Tennis</div>
                                  <div className="text-xs font-bold">24%</div>
                                </div>
                              </div>
                            </div>

                            <div className="w-1/5 px-1">
                              <div className="bg-blue-200 h-32 rounded-t-lg"></div>
                            </div>

                            <div className="w-1/5 px-1">
                              <div className="bg-orange-300 h-48 rounded-t-lg flex items-center justify-center">
                                <div className="bg-yellow-300 h-6 w-6 rounded-full flex items-center justify-center">🎾</div>
                              </div>
                            </div>

                            <div className="w-1/5 px-1">
                              <div className="bg-gray-200 h-24 rounded-t-lg"></div>
                            </div>

                            <div className="w-1/5 px-1">
                              <div className="bg-purple-200 h-20 rounded-t-lg"></div>
                            </div>
                          </div>

                          <div className="absolute bottom-0 w-full grid grid-cols-5 text-xs text-center text-gray-500">
                            <div>Gym</div>
                            <div>Swimming</div>
                            <div>Tennis</div>
                            <div>Study</div>
                            <div>Design</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fourth Column */}
                    <div className="space-y-6">
                      {/* Achievements */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-xl font-bold">Achievements</h2>
                          <button className="text-gray-500 text-sm">See All</button>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-purple-50 rounded-lg p-3 flex items-center gap-3">
                            <div className="bg-purple-200 h-12 w-12 rounded-lg flex items-center justify-center text-xl">🏆</div>
                            <div className="flex-1">
                              <div className="font-medium">Early Bird</div>
                              <div className="text-sm text-gray-500">Woke up at 5 AM for 7 days straight</div>
                            </div>
                            <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                              +5
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
                            <div className="bg-blue-200 h-12 w-12 rounded-lg flex items-center justify-center text-xl">💧</div>
                            <div className="flex-1">
                              <div className="font-medium">Hydration Master</div>
                              <div className="text-sm text-gray-500">Drank 2L water daily for 5 days</div>
                            </div>
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                              +3
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Weekly Progress */}
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Meditation</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-full w-[85%] bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Exercise</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-full w-[92%] bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Reading</span>
                              <span className="font-medium">78%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-full w-[78%] bg-gradient-to-r from-purple-400 to-purple-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Spotify and More Integrations Side by Side */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Spotify Integration */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-2xl">🎵</span>
                            </div>

                            <div className="flex-1">
                              <h3 className="text-base font-bold">Connect Spotify</h3>
                              <p className="text-sm text-gray-500">
                                Track with music
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 space-y-3">
                            <p className="text-xs text-gray-500">Enhance your habit tracking with your favorite music</p>
                            <button className="w-full bg-gray-900 text-white rounded-full py-2 flex items-center justify-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                                <span className="text-black text-xs">🔗</span>
                              </span>
                              <span>Link Account</span>
                            </button>
                          </div>
                        </div>

                        {/* More Integrations */}
                        <div className="bg-red-400 rounded-xl p-4 shadow-sm text-white">
                          <div className="h-full flex flex-col justify-between">
                            <div>
                              <h3 className="text-lg font-bold">23+ Apps</h3>
                              <p className="text-sm mt-1">Supercharge your habits with integrations</p>
                            </div>
                            <div className="mt-6">
                              <button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-full py-2 text-sm backdrop-blur-sm">
                                Explore More
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>
          <FloatingDock 
          items={NAVIGATION_ITEMS} 
          desktopClassName="fixed bottom-4 left-1/2 -translate-x-1/2 z-10" 
          mobileClassName="fixed bottom-4 right-4"
        />
        </motion.div>
      </div>
    </div>
  )
}

export default App