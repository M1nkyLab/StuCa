import { useState, useMemo, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ExternalLink, MapPin, DollarSign, Briefcase, Plus, X, Save, Trash2, Edit3 } from "lucide-react";

// --- CONSTANTS ---
const API_URL = "http://localhost:5000/api/jobs"; // Your Backend URL

const STATUSES = [
  { id: "Wishlist", label: "Wishlist", color: "bg-gray-100 border-gray-300" },
  { id: "Applied", label: "Applied", color: "bg-blue-50 border-blue-200" },
  { id: "Interviewing", label: "Interviewing", color: "bg-yellow-50 border-yellow-200" },
  { id: "Offer", label: "Offer", color: "bg-green-50 border-green-200" },
  { id: "Rejected", label: "Rejected", color: "bg-red-50 border-red-200" },
  { id: "Ghosting", label: "Ghosting", color: "bg-purple-50 border-purple-200" },
];

const INITIAL_FORM = {
  company: "", role: "", status: "Wishlist", job_type: "Full-Time",
  salary: "", currency: "RM", location: "", job_link: "", benefits: "", notes: "",
};

// --- SUB-COMPONENT: JOB CARD ---
const JobCard = ({ app, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={app.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.9 : 1 }}
          className={`
            bg-white p-4 rounded-lg shadow-sm border border-gray-100 
            hover:shadow-md transition-shadow group relative w-full
            ${snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-400 rotate-2 z-50" : ""}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-gray-900 leading-tight pr-6">{app.company}</h4>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 bg-white pl-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit(app); }} className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"><Edit3 size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(app.id); }} className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium mb-3">{app.role}</p>
          <div className="space-y-1.5">
            <div className="flex items-center text-xs text-gray-500 gap-2"><Briefcase size={12} className="flex-shrink-0" /><span className="truncate">{app.job_type}</span></div>
            <div className="flex items-center text-xs text-gray-500 gap-2"><MapPin size={12} className="flex-shrink-0" /><span className="truncate">{app.location || "Remote"}</span></div>
            {app.salary && (
              <div className="flex items-center text-xs text-green-700 font-medium gap-2 bg-green-50 w-fit px-2 py-0.5 rounded">
                <DollarSign size={10} className="flex-shrink-0" /><span>{app.currency} {app.salary}</span>
              </div>
            )}
          </div>
          {app.job_link && (
            <a href={app.job_link} target="_blank" rel="noreferrer" className="absolute bottom-4 right-4 text-gray-400 hover:text-blue-600"><ExternalLink size={14} /></a>
          )}
        </div>
      )}
    </Draggable>
  );
};

// --- SUB-COMPONENT: JOB MODAL ---
const JobModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    if (isOpen) setFormData(initialData || INITIAL_FORM);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeSlide">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">{initialData ? "Edit Application" : "Add New Application"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Company *</label><input required name="company" value={formData.company} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Role *</label><input required name="role" value={formData.role} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Link</label><input name="job_link" value={formData.job_link} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input name="location" value={formData.location} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500">{STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"><option value="Internship">Internship</option><option value="Full-Time">Full-Time</option><option value="Contract">Contract</option></select></div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/3"><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select name="currency" value={formData.currency} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"><option value="RM">RM</option><option value="USD">USD</option><option value="SGD">SGD</option></select></div>
                <div className="w-2/3"><label className="block text-sm font-medium text-gray-700 mb-1">Salary</label><input type="number" name="salary" value={formData.salary} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label><textarea name="benefits" value={formData.benefits} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg h-24 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
            </div>
          </div>
          <div className="mt-4"><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg h-20 resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" /></div>
          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 transform hover:scale-105">
              <Save size={18} /> Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function JobTracker() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [applications, setApplications] = useState([]); // Start empty, fetch later

  // 1. FETCH JOBS ON MOUNT
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // 2. SAVE JOB (CREATE or UPDATE)
  const handleSave = async (formData) => {
    try {
      if (editingApp) {
        // UPDATE Existing
        const res = await fetch(`${API_URL}/${editingApp.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updatedJob = await res.json();
        setApplications(prev => prev.map(app => app.id === editingApp.id ? updatedJob : app));
      } else {
        // CREATE New
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newJob = await res.json();
        setApplications(prev => [newJob, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save job");
    }
  };

  // 3. DELETE JOB
  const handleDelete = useCallback(async (id) => {
    if (window.confirm("Delete this application?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setApplications(prev => prev.filter(app => app.id !== id));
      } catch (error) {
        alert("Failed to delete job");
      }
    }
  }, []);

  // 4. DRAG & DROP (UPDATE STATUS)
  const onDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI Update (Update screen instantly)
    const newStatus = destination.droppableId;
    setApplications(prev => prev.map(app => 
      app.id === draggableId ? { ...app, status: newStatus } : app
    ));

    // Send Update to Backend
    try {
      await fetch(`${API_URL}/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }, []);

  // Columns Memoization
  const columns = useMemo(() => {
    const cols = {};
    STATUSES.forEach(status => {
      cols[status.id] = applications.filter(app => app.status === status.id);
    });
    return cols;
  }, [applications]);

  const openAdd = () => { setEditingApp(null); setIsModalOpen(true); };
  const openEdit = useCallback((app) => { setEditingApp(app); setIsModalOpen(true); }, []);

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Application Board</h2>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all hover:scale-105 flex items-center gap-2">
          <Plus size={20} /> Add Job
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 min-w-max h-full">
            {STATUSES.map((column) => (
              <div key={column.id} className={`w-80 flex-shrink-0 flex flex-col rounded-xl border ${column.color} bg-opacity-50 backdrop-blur-sm`}>
                <div className="p-3 border-b border-black/5 flex justify-between items-center bg-white/40 rounded-t-xl">
                  <h3 className="font-bold text-gray-700">{column.label}</h3>
                  <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-500">{columns[column.id].length}</span>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={`p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar transition-colors ${snapshot.isDraggingOver ? "bg-black/5" : ""}`}>
                      {columns[column.id].map((app, index) => (
                        <JobCard key={app.id} app={app} index={index} onEdit={openEdit} onDelete={handleDelete} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>

      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={editingApp} />
    </div>
  );
}