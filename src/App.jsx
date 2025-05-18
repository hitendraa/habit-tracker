import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { FloatingDock } from '@/components/ui/floating-dock'
import { IconHome, IconCalendar, IconChartBar, IconSettings } from '@tabler/icons-react'

function App() {
  const [loading, setLoading] = useState(true)
  const appRef = useRef(null)
  const iconRef = useRef(null)
  const habitTextRef = useRef(null)
  const trackerTextRef = useRef(null)

  const navigationItems = [
    {
      title: "Home",
      href: "/",
      icon: <IconHome className="text-primary h-4 w-4" />
    },
    {
      title: "Calendar",
      href: "/calendar",
      icon: <IconCalendar className="text-primary h-4 w-4" />
    },
    {
      title: "Statistics",
      href: "/stats",
      icon: <IconChartBar className="text-primary h-4 w-4" />
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-primary h-4 w-4" />
    }
  ];

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

      {/* Floating Navigation Dock */}
      <FloatingDock 
        items={navigationItems}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-4 right-4 z-50" 
      />
    </div>
  )
}

export default App