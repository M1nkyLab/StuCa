import { useState } from "react";
import { Plus, FileText, ChevronLeft, Edit3, Wand2, Download, Save } from "lucide-react";

export default function CoverLetter() {
  // Views: 'dashboard' | 'templates' | 'editor'
  const [view, setView] = useState("dashboard");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const [letterData, setLetterData] = useState({
    title: "Untitled Cover Letter",
    jobTitle: "",
    company: "",
    content: ""
  });

  // --- VIEW 1: DASHBOARD ---
  if (view === "dashboard") {
    return (
      <div className="max-w-5xl mx-auto animate-fadeSlide">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cover Letters</h1>
            <p className="text-gray-500 mt-1">Manage your application letters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setView("templates")}
            className="group flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
          >
            <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600">
              New Cover Letter
            </h3>
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: TEMPLATE SELECTION ---
  if (view === "templates") {
    return (
      <div className="max-w-6xl mx-auto animate-fadeSlide">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView("dashboard")} className="p-2 hover:bg-gray-200 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Choose a Style</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TemplateCard title="Standard" color="bg-gray-700" onClick={() => { setSelectedTemplate("standard"); setView("editor"); }} />
          <TemplateCard title="Modern" color="bg-blue-600" onClick={() => { setSelectedTemplate("modern"); setView("editor"); }} />
          <TemplateCard title="Creative" color="bg-orange-500" onClick={() => { setSelectedTemplate("creative"); setView("editor"); }} />
        </div>
      </div>
    );
  }

  // --- VIEW 3: EDITOR ---
  if (view === "editor") {
    return (
      <div className="h-full flex flex-col animate-fadeSlide">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setView("dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md text-sm font-medium flex items-center gap-2">
                <Download size={16} /> Download PDF
             </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden mt-4 gap-6 h-[800px]">
          <div className="w-1/2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-4 flex justify-between items-center">
               <span className="text-sm font-bold text-purple-700 flex items-center gap-2"><Wand2 size={16}/> AI Writer</span>
               <button className="text-xs bg-white border border-purple-200 px-2 py-1 rounded text-purple-700">Auto-Generate</button>
            </div>
            <textarea 
               className="flex-1 p-4 border border-gray-300 rounded-lg outline-none resize-none font-serif text-gray-700" 
               placeholder="Dear Hiring Manager..."
               value={letterData.content}
               onChange={(e) => setLetterData({...letterData, content: e.target.value})}
            ></textarea>
          </div>

          <div className="w-1/2 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-8">
             <div className="bg-white shadow-xl w-full h-full p-10 scale-95 overflow-y-auto font-serif">
                <p>{new Date().toLocaleDateString()}</p>
                <p className="mt-8 whitespace-pre-wrap">{letterData.content || "Your letter preview..."}</p>
             </div>
          </div>
        </div>
      </div>
    );
  }
}

function TemplateCard({ title, color, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-500 transition-all h-40">
      <div className={`h-24 ${color} opacity-80 flex items-center justify-center text-white font-bold`}>Preview</div>
      <div className="p-4 font-bold text-gray-700 text-center">{title}</div>
    </div>
  );
}