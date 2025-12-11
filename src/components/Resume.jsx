import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  Plus, FileText, ChevronLeft, Edit3, 
  Download, Save, Trash2, User, Briefcase, GraduationCap, 
  Loader2, MapPin, Phone, Mail, Globe, Linkedin, Calendar, Flag, CreditCard
} from "lucide-react";

// --- MOCK DATA ---
const INITIAL_RESUMES = [
  { id: 1, title: "Software Engineer Intern", template: "modern", date: "2 days ago" },
];

const DEFAULT_DATA = {
  fullName: "", professionalTitle: "", location: "", phone: "", email: "", website: "",
  linkedin: "", nationality: "", dob: "", visa: "", passport: "", gender: "",
  summary: "",
  experience: [{ id: 1, role: "", company: "", date: "", details: "" }],
  education: [{ id: 1, school: "", degree: "", date: "" }],
  skills: "",
};

// --- PREVIEW DATA (For Template Thumbnails) ---
const PREVIEW_DATA = {
  fullName: "ALEX JORDAN", professionalTitle: "Marketing Specialist", email: "alex@example.com", phone: "+123 456 7890", location: "New York, USA",
  summary: "Experienced specialist with a demonstrated history of working in the industry.",
  experience: [{ id: 1, role: "Senior Marketer", company: "Creative Agency", details: "Led successful campaigns." }],
  education: [{ id: 1, school: "State University", degree: "BSc Marketing", date: "2018 - 2022" }]
};

export default function Resume() {
  const [view, setView] = useState("dashboard"); 
  const [resumes, setResumes] = useState(INITIAL_RESUMES);
  const [currentResume, setCurrentResume] = useState(null); 
  const [resumeData, setResumeData] = useState(DEFAULT_DATA); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExtraDetails, setShowExtraDetails] = useState(false);
  const printRef = useRef();

  // --- ACTIONS ---
  const handleCreateNew = () => { setResumeData(DEFAULT_DATA); setView("templates"); };

  const handleSelectTemplate = (template) => {
    setCurrentResume({ id: Date.now(), template: template, title: "Untitled Resume", date: "Just now" });
    setView("editor");
  };

  const handleEditExisting = (resume) => {
    setCurrentResume(resume);
    setResumeData(DEFAULT_DATA); 
    setView("editor");
  };

  // --- DELETE FUNCTION ---
  const handleDeleteResume = (id, e) => {
    e.stopPropagation(); // Stop the click from triggering "Edit"
    if (window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) {
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  const handleSave = () => {
    const exists = resumes.find(r => r.id === currentResume.id);
    if (exists) {
      setResumes(resumes.map(r => r.id === currentResume.id ? { ...currentResume, date: "Just now" } : r));
    } else {
      setResumes([currentResume, ...resumes]);
    }
    alert("Resume saved!");
    setView("dashboard");
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.fullName || "Resume"}.pdf`);
    } catch (error) {
      alert("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateField = (field, value) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  // --- VIEW 1: DASHBOARD ---
  if (view === "dashboard") {
    return (
      <div className="max-w-6xl mx-auto animate-fadeSlide">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 mt-1">Manage your resume versions.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button onClick={handleCreateNew} className="group flex flex-col items-center justify-center h-80 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
            <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Plus size={28} /></div>
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-600">Create New Resume</h3>
          </button>
          
          {resumes.map((resume) => (
            <div key={resume.id} className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all h-80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                  <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{resume.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">{resume.title}</h3>
                <p className="text-sm text-gray-500 mt-1 capitalize">{resume.template} Template</p>
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => handleEditExisting(resume)} className="flex-1 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors">
                  <Edit3 size={16} /> Edit
                </button>
                {/* DELETE BUTTON ADDED HERE */}
                <button 
                  onClick={(e) => handleDeleteResume(resume.id, e)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Resume"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 2: TEMPLATES (WITH REAL PREVIEWS) ---
  if (view === "templates") {
    return (
      <div className="max-w-7xl mx-auto animate-fadeSlide pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView("dashboard")} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><ChevronLeft size={24} className="text-gray-600" /></button>
          <h1 className="text-2xl font-bold text-gray-900">Choose a Template</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <TemplateCard title="Modern Professional" description="Clean lines with a bold header. Best for corporate roles." onClick={() => handleSelectTemplate("modern")}>
             <TemplateModern data={PREVIEW_DATA} />
          </TemplateCard>
          <TemplateCard title="Clean Minimalist" description="Simple, centered layout. Focuses purely on content." onClick={() => handleSelectTemplate("minimal")}>
             <TemplateMinimal data={PREVIEW_DATA} />
          </TemplateCard>
          <TemplateCard title="Creative & Bold" description="High contrast side-bar layout. Great for designers and tech." onClick={() => handleSelectTemplate("creative")}>
             <TemplateCreative data={PREVIEW_DATA} />
          </TemplateCard>
        </div>
      </div>
    );
  }

  // --- VIEW 3: EDITOR ---
  if (view === "editor") {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col animate-fadeSlide">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setView("dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium"><ChevronLeft size={20} /> Back</button>
            <div className="h-6 w-px bg-gray-300"></div>
            <input type="text" value={currentResume?.title} onChange={(e) => setCurrentResume({...currentResume, title: e.target.value})} className="font-semibold text-gray-900 focus:outline-none border-b border-transparent focus:border-blue-500 px-1" />
          </div>
          <div className="flex gap-3">
             <button onClick={handleSave} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium flex items-center gap-2"><Save size={16} /> Save</button>
             <button onClick={handleDownloadPDF} disabled={isGenerating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} 
                {isGenerating ? "Generating..." : "Download PDF"}
             </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: FORM INPUTS */}
          <div className="w-1/2 bg-gray-50 border-r border-gray-200 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-xl mx-auto space-y-8">
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><User size={18} className="text-blue-500"/> Edit Personal Details</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition"><User size={24} /></div>
                  <div className="text-sm"><p className="font-semibold text-gray-700">Profile Photo</p><p className="text-gray-400 text-xs">Recommended for specific templates</p></div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition" placeholder="SYED FARHAN..." value={resumeData.fullName} onChange={(e) => updateField('fullName', e.target.value)} /></div>
                  <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Professional Title</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition" placeholder="Target position or current role" value={resumeData.professionalTitle} onChange={(e) => updateField('professionalTitle', e.target.value)} /></div>
                  <div className="col-span-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition" placeholder="Puchong, Malaysia" value={resumeData.location} onChange={(e) => updateField('location', e.target.value)} /></div>
                  <div className="col-span-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition" placeholder="+60 19-..." value={resumeData.phone} onChange={(e) => updateField('phone', e.target.value)} /></div>
                  <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label><input type="email" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition" placeholder="syedhaziq...@gmail.com" value={resumeData.email} onChange={(e) => updateField('email', e.target.value)} /></div>
                  <div className="col-span-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Portfolio Website</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition" placeholder="www.yourwebsite.com" value={resumeData.website} onChange={(e) => updateField('website', e.target.value)} /></div>
                </div>
                <button onClick={() => setShowExtraDetails(!showExtraDetails)} className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition">{showExtraDetails ? "Hide Additional Details" : "+ Add Details (LinkedIn, Nationality, etc.)"}</button>
                {showExtraDetails && (
                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-5 animate-fadeSlide">
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">LinkedIn</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" value={resumeData.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nationality</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" value={resumeData.nationality} onChange={(e) => updateField('nationality', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date of Birth</label><input type="date" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" value={resumeData.dob} onChange={(e) => updateField('dob', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Gender / Pronouns</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" value={resumeData.gender} onChange={(e) => updateField('gender', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Visa Status</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" value={resumeData.visa} onChange={(e) => updateField('visa', e.target.value)} /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Passport / ID</label><input type="text" className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" value={resumeData.passport} onChange={(e) => updateField('passport', e.target.value)} /></div>
                  </div>
                )}
              </section>

              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Summary</h3>
                 <textarea className="w-full p-2.5 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 h-24 bg-gray-50 focus:bg-white" value={resumeData.summary} onChange={(e) => updateField('summary', e.target.value)}></textarea>
              </section>
              
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Briefcase size={18} className="text-blue-500"/> Experience</h3><button onClick={() => setResumeData({...resumeData, experience: [...resumeData.experience, { id: Date.now(), role: "", company: "", details: "" }]})} className="text-xs text-blue-600 hover:underline font-bold">+ Add Item</button></div>
                {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0 mb-4">
                       <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Job Title" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={exp.role} onChange={(e) => {const newExp = [...resumeData.experience]; newExp[index].role = e.target.value; setResumeData({...resumeData, experience: newExp});}} />
                          <input placeholder="Company" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={exp.company} onChange={(e) => {const newExp = [...resumeData.experience]; newExp[index].company = e.target.value; setResumeData({...resumeData, experience: newExp});}} />
                       </div>
                       <textarea placeholder="Details..." className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-20" value={exp.details} onChange={(e) => {const newExp = [...resumeData.experience]; newExp[index].details = e.target.value; setResumeData({...resumeData, experience: newExp});}}></textarea>
                       <button onClick={() => {const newExp = resumeData.experience.filter((_, i) => i !== index); setResumeData({...resumeData, experience: newExp})}} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove Item</button>
                    </div>
                ))}
              </section>

               <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><GraduationCap size={18} className="text-blue-500"/> Education</h3><button onClick={() => setResumeData({...resumeData, education: [...resumeData.education, { id: Date.now(), school: "", degree: "", date: "" }]})} className="text-xs text-blue-600 hover:underline font-bold">+ Add Item</button></div>
                 {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-0 last:pb-0 mb-4">
                      <input placeholder="School / University" className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={edu.school} onChange={(e) => {const newEdu = [...resumeData.education]; newEdu[index].school = e.target.value; setResumeData({...resumeData, education: newEdu});}} />
                      <div className="grid grid-cols-2 gap-4">
                         <input placeholder="Degree" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={edu.degree} onChange={(e) => {const newEdu = [...resumeData.education]; newEdu[index].degree = e.target.value; setResumeData({...resumeData, education: newEdu});}} />
                         <input placeholder="Year" className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={edu.date} onChange={(e) => {const newEdu = [...resumeData.education]; newEdu[index].date = e.target.value; setResumeData({...resumeData, education: newEdu});}} />
                      </div>
                       <button onClick={() => {const newEdu = resumeData.education.filter((_, i) => i !== index); setResumeData({...resumeData, education: newEdu})}} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove Item</button>
                    </div>
                 ))}
              </section>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div className="w-1/2 bg-gray-200 overflow-y-auto p-8 flex justify-center">
            <div ref={printRef} className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[12mm] text-gray-800">
               {currentResume?.template === "modern" && <TemplateModern data={resumeData} />}
               {currentResume?.template === "minimal" && <TemplateMinimal data={resumeData} />}
               {currentResume?.template === "creative" && <TemplateCreative data={resumeData} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// --- TEMPLATES ---
function TemplateModern({ data }) {
  return (
    <div>
      <header className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 uppercase tracking-widest">{data.fullName || "YOUR NAME"}</h1>
        <p className="text-xl text-blue-600 font-medium mt-1 tracking-wide">{data.professionalTitle}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
           {data.email && <div className="flex items-center gap-1"><Mail size={14}/> {data.email}</div>}
           {data.phone && <div className="flex items-center gap-1"><Phone size={14}/> {data.phone}</div>}
           {data.location && <div className="flex items-center gap-1"><MapPin size={14}/> {data.location}</div>}
           {data.linkedin && <div className="flex items-center gap-1"><Linkedin size={14}/> {data.linkedin}</div>}
           {data.website && <div className="flex items-center gap-1"><Globe size={14}/> {data.website}</div>}
        </div>
        {(data.nationality || data.visa) && (
           <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2">
              {data.nationality && <span className="flex items-center gap-1"><Flag size={12}/> {data.nationality}</span>}
              {data.visa && <span className="flex items-center gap-1"><CreditCard size={12}/> {data.visa}</span>}
              {data.dob && <span className="flex items-center gap-1"><Calendar size={12}/> {data.dob}</span>}
           </div>
        )}
      </header>
      <div className="mb-6"><h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Professional Summary</h2><p className="text-sm leading-relaxed text-gray-700">{data.summary}</p></div>
      <div className="mb-6"><h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Experience</h2>{data.experience.map(exp => (<div key={exp.id} className="mb-5"><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-800 text-lg">{exp.role}</h3><span className="text-sm font-semibold text-gray-500">{exp.company}</span></div><p className="text-xs text-gray-400 mb-1">Details</p><p className="text-sm text-gray-700 whitespace-pre-line">{exp.details}</p></div>))}</div>
      <div><h2 className="text-lg font-bold text-blue-600 uppercase mb-3 border-b border-gray-200 pb-1">Education</h2>{data.education.map(edu => (<div key={edu.id} className="mb-4"><div className="flex justify-between items-baseline"><h3 className="font-bold text-gray-800">{edu.school}</h3><span className="text-sm font-semibold text-gray-500">{edu.date}</span></div><p className="text-sm text-gray-700">{edu.degree}</p></div>))}</div>
    </div>
  );
}

function TemplateMinimal({ data }) {
  return (
    <div className="text-center">
       <h1 className="text-4xl font-light mb-1">{data.fullName || "Your Name"}</h1>
       <p className="text-lg text-gray-400 font-light mb-4">{data.professionalTitle}</p>
       <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500 mb-8">
         {data.email && <span>{data.email}</span>}
         {data.phone && <span>• {data.phone}</span>}
         {data.location && <span>• {data.location}</span>}
         {data.linkedin && <span>• LinkedIn</span>}
       </div>
       <hr className="mb-8 border-gray-300" />
       <div className="text-left space-y-8">
          <section><h3 className="font-bold text-gray-900 mb-2 tracking-widest text-sm">SUMMARY</h3><p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p></section>
          <section><h3 className="font-bold text-gray-900 mb-4 tracking-widest text-sm">EXPERIENCE</h3>{data.experience.map(exp => (<div key={exp.id} className="mb-6 pl-4 border-l-2 border-gray-200"><h4 className="font-bold text-gray-800">{exp.role}</h4><p className="text-sm text-gray-500 mb-2">{exp.company}</p><p className="text-sm text-gray-600">{exp.details}</p></div>))}</section>
           <section><h3 className="font-bold text-gray-900 mb-4 tracking-widest text-sm">EDUCATION</h3>{data.education.map(edu => (<div key={edu.id} className="mb-3"><h4 className="font-bold text-gray-800">{edu.school}</h4><p className="text-sm text-gray-600">{edu.degree} <span className="text-gray-400 italic">({edu.date})</span></p></div>))}</section>
       </div>
    </div>
  );
}

function TemplateCreative({ data }) {
   return (
      <div className="flex h-full">
         <div className="w-1/3 bg-slate-900 text-white p-8 -m-[12mm] mr-8 min-h-[297mm]">
            <h1 className="text-3xl font-bold mb-2 leading-tight">{data.fullName}</h1>
            <p className="text-blue-400 font-medium mb-8 text-sm">{data.professionalTitle}</p>
            <div className="mb-10 space-y-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contact</h3>
               {data.email && <div className="text-xs flex gap-2"><Mail size={12}/> {data.email}</div>}
               {data.phone && <div className="text-xs flex gap-2"><Phone size={12}/> {data.phone}</div>}
               {data.location && <div className="text-xs flex gap-2"><MapPin size={12}/> {data.location}</div>}
               {data.linkedin && <div className="text-xs flex gap-2"><Linkedin size={12}/> {data.linkedin}</div>}
            </div>
            {(data.nationality || data.dob) && (
                <div className="mb-10 space-y-3">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Personal</h3>
                   {data.nationality && <div className="text-xs text-slate-300">Nationality: {data.nationality}</div>}
                   {data.dob && <div className="text-xs text-slate-300">DOB: {data.dob}</div>}
                </div>
            )}
            <div><h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Education</h3>{data.education.map(edu => (<div key={edu.id} className="mb-6"><p className="font-bold text-sm text-white">{edu.school}</p><p className="text-xs text-blue-300 mb-1">{edu.degree}</p><p className="text-xs text-slate-500">{edu.date}</p></div>))}</div>
         </div>
         <div className="flex-1 py-4">
            <div className="mb-10"><h2 className="text-xl font-bold text-slate-800 border-b-4 border-blue-100 pb-2 mb-4 inline-block">Profile</h2><p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p></div>
            <div><h2 className="text-xl font-bold text-slate-800 border-b-4 border-blue-100 pb-2 mb-6 inline-block">Experience</h2>{data.experience.map(exp => (<div key={exp.id} className="mb-8"><h3 className="font-bold text-lg text-slate-800">{exp.role}</h3><p className="text-sm font-semibold text-blue-600 mb-2">{exp.company}</p><p className="text-sm text-gray-600 leading-relaxed">{exp.details}</p></div>))}</div>
         </div>
      </div>
   )
}

function TemplateCard({ title, description, onClick, children }) {
  return (
    <div onClick={onClick} className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col h-[500px]">
      <div className="relative bg-gray-100 h-full overflow-hidden flex items-start justify-center pt-8">
         <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg transform scale-[0.35] origin-top select-none pointer-events-none text-left">{children}</div>
         <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-colors flex items-center justify-center"><div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">Use Template</div></div>
      </div>
      <div className="p-5 border-t border-gray-100 bg-white z-10"><h3 className="font-bold text-lg text-gray-800">{title}</h3><p className="text-sm text-gray-500 mt-1">{description}</p></div>
    </div>
  );
}