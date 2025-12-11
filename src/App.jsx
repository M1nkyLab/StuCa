import { useState } from "react";
import JobTracker from "./components/JobTracker";
import Resume from "./components/Resume";
import CoverLetter from "./components/CoverLetter";

export default function App() {
  const [tab, setTab] = useState("tracker");

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col relative overflow-hidden font-sans text-gray-900">
      
      {/* MAIN CONTENT AREA */}
      <div
        key={tab}
        className="
          flex-1 
          overflow-y-auto 
          p-4 pb-32 md:p-8 
          animate-fadeSlide
        "
      >
        {tab === "tracker" && <JobTracker />}
        {tab === "resume" && <Resume />}
        {tab === "cover" && <CoverLetter />}
      </div>

      {/* BOTTOM NAVIGATION BAR CONTAINER */}
      <div className="absolute bottom-8 w-full flex justify-center pointer-events-none z-50">
        
        {/* WRAPPER: 
           1. 'group' allows us to control the hover state.
           2. 'rounded-full' shapes the whole container.
           3. 'p-[2px]' creates the thickness of the border (The gradient will show in this 2px gap).
           4. 'bg-transparent' by default, changes to gradient on hover.
        */}
        <div className="
          relative group pointer-events-auto rounded-full 
          p-[2px] 
          transition-all duration-300
          hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]
        ">
          
          {/* THE ANIMATED GRADIENT LAYER (The "Ink")
             - It sits behind the navbar.
             - We use absolute inset-0 to fill the wrapper.
             - opacity-0 (invisible) -> opacity-100 (visible) on hover.
          */}
          <div className="
            absolute inset-0 rounded-full 
            bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
            bg-[length:200%_200%]
            opacity-0 group-hover:opacity-100 
            group-hover:animate-gradient-border
            transition-opacity duration-500
          "></div>

          {/* THE NAVBAR ITSELF (The "Mask")
             - bg-white/80: Slightly more opaque to hide the gradient behind the center.
             - rounded-full: Matches the parent.
             - h-full w-full: Stretches to cover everything except the 2px padding.
          */}
          <div className="
            relative
            h-full w-full
            bg-white/80 
            backdrop-blur-xl 
            rounded-full 
            px-2 py-2 
            flex gap-2 
            border border-white/40
          ">
            
            <NavButton 
              active={tab === "resume"} 
              onClick={() => setTab("resume")}
              label="Resume"
            />
            <NavButton 
              active={tab === "cover"} 
              onClick={() => setTab("cover")}
              label="Cover Letter"
            />
            <NavButton 
              active={tab === "tracker"} 
              onClick={() => setTab("tracker")}
              label="Job Tracker"
            />

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function NavButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
            : "text-gray-600 hover:bg-black/5 hover:text-gray-900"
        }
      `}
    >
      {label}
    </button>
  );
}