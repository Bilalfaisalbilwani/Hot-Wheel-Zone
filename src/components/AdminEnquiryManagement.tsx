import React, { useState, useEffect } from 'react';
import { AdminEnquiry } from '../types';
import { 
  Inbox, 
  Search, 
  RefreshCw, 
  Filter, 
  Phone, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Car, 
  FileText, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Edit3, 
  User, 
  Globe, 
  Save, 
  X, 
  AlertTriangle,
  Send,
  ExternalLink
} from 'lucide-react';

interface AdminEnquiryManagementProps {
  token: string | null;
  showToast: (message: string, isError?: boolean) => void;
}

const STATUS_OPTIONS = ['New', 'Contacted', 'In Progress', 'Completed', 'Cancelled'] as const;

export const AdminEnquiryManagement: React.FC<AdminEnquiryManagementProps> = ({ token, showToast }) => {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Editing Note State
  const [editingEnquiryId, setEditingEnquiryId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Deleting State
  const [deletingEnquiry, setDeletingEnquiry] = useState<AdminEnquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Detail Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);

  const fetchEnquiries = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setEnquiries(json.data);
      } else {
        showToast(json.error || 'Failed to fetch enquiries.', true);
      }
    } catch (err) {
      showToast('Network error while loading enquiries.', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [token]);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        showToast(`Status updated to "${newStatus}"`);
        setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        showToast(json.error || 'Failed to update status.', true);
      }
    } catch (err) {
      showToast('Network error while updating status.', true);
    }
  };

  const handleSaveNotes = async (enquiryId: string) => {
    if (!token) return;
    setIsSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: editingNotes })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Notes saved successfully.');
        setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, notes: editingNotes } : e));
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry(prev => prev ? { ...prev, notes: editingNotes } : null);
        }
        setEditingEnquiryId(null);
      } else {
        showToast(json.error || 'Failed to save notes.', true);
      }
    } catch (err) {
      showToast('Network error while saving notes.', true);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteEnquiry = async () => {
    if (!token || !deletingEnquiry) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${deletingEnquiry.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        showToast('Enquiry deleted successfully.');
        setEnquiries(prev => prev.filter(e => e.id !== deletingEnquiry.id));
        if (selectedEnquiry && selectedEnquiry.id === deletingEnquiry.id) {
          setSelectedEnquiry(null);
        }
        setDeletingEnquiry(null);
      } else {
        showToast(json.error || 'Failed to delete enquiry.', true);
      }
    } catch (err) {
      showToast('Network error while deleting enquiry.', true);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-[#0B4DA2]/10 text-[#0B4DA2] border-[#0B4DA2]/20';
      case 'Contacted':
        return 'bg-[#C9A227]/15 text-[#8A6D14] border-[#C9A227]/30';
      case 'In Progress':
        return 'bg-[#0A2540]/10 text-[#0A2540] border-[#0A2540]/20';
      case 'Completed':
        return 'bg-[#0B4DA2] text-white border-[#0B4DA2]';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'visa':
        return { label: 'Visa Enquiry', color: 'bg-[#0B4DA2]/10 text-[#0B4DA2] border-[#0B4DA2]/20' };
      case 'car-rental':
        return { label: 'Car Rental', color: 'bg-[#0B4DA2]/10 text-[#0B4DA2] border-[#0B4DA2]/20' };
      case 'chauffeur':
        return { label: 'Mercedes Chauffeur', color: 'bg-[#C9A227]/15 text-[#8A6D14] border-[#C9A227]/30' };
      default:
        return { label: 'General Contact', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const filteredEnquiries = enquiries.filter(item => {
    const matchesSearch = 
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.whatsappNumber && item.whatsappNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.referenceId && item.referenceId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.destination && item.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.vehicleType && item.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || item.enquiryType === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#0A2540] tracking-tight">
                Enquiries & Leads Management
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B4DA2]/10 text-[#0B4DA2] border border-[#0B4DA2]/20">
                {enquiries.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live customer leads from Visa and Car Rental enquiry forms saved in PostgreSQL database.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchEnquiries}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-[#F5F7FA] hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Enquiries</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, WhatsApp, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
            />
          </div>

          {/* Filter Type */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter enquiries by type"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
            >
              <option value="all">All Enquiry Types</option>
              <option value="visa">Visa Applications</option>
              <option value="car-rental">Car Rentals</option>
              <option value="contact">General Contact</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter enquiries by status"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries List / Cards */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-700">No enquiries found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
              ? 'Try adjusting your search query or filter options.'
              : 'Enquiries submitted via the customer portal will automatically appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEnquiries.map((enquiry) => {
            const typeInfo = getTypeBadge(enquiry.enquiryType || enquiry.type || 'visa');
            const isEditingThisNote = editingEnquiryId === enquiry.id;

            return (
              <div 
                key={enquiry.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#0B4DA2]/30 transition-all space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {enquiry.referenceId || enquiry.id}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(enquiry.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      aria-label="Change enquiry status"
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${getStatusBadge(enquiry.status)}`}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(enquiry)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      title="View Full Details"
                    >
                      Details
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingEnquiry(enquiry)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete enquiry"
                      aria-label="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Main Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#0B4DA2]" />
                      <span>{enquiry.name || 'Unnamed Client'}</span>
                    </div>
                    {enquiry.nationality && (
                      <div className="text-slate-500 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>Nationality: {enquiry.nationality}</span>
                      </div>
                    )}
                    {enquiry.isUaeResident && (
                      <div className="text-slate-500">
                        UAE Resident: <span className="font-semibold text-slate-700">{enquiry.isUaeResident}</span>
                      </div>
                    )}
                  </div>

                  {/* Travel / Rental Details */}
                  <div className="space-y-1">
                    {enquiry.enquiryType === 'visa' ? (
                      <>
                        <div className="text-slate-700">
                          Destination: <span className="font-semibold text-slate-900">{enquiry.destination || 'Dubai, UAE'}</span>
                        </div>
                        <div className="text-slate-500">
                          Travel Date: <span className="font-semibold">{enquiry.travelDate || 'Not specified'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {enquiry.vehicleType && (
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-[#0B4DA2]" />
                            <span>{enquiry.vehicleType}</span>
                          </div>
                        )}
                        {enquiry.pickupLocation && (
                          <div className="text-slate-500 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{enquiry.pickupLocation}</span>
                          </div>
                        )}
                        {enquiry.pickupDate && (
                          <div className="text-slate-500">
                            {enquiry.pickupDate} to {enquiry.returnDate}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Contact & WhatsApp CTA */}
                  <div className="space-y-2 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-[#0B4DA2]" />
                      <span>{enquiry.whatsappNumber}</span>
                    </div>

                    {enquiry.whatsappNumber && (
                      <a
                        href={`https://wa.me/${enquiry.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enquiry.name || ''}, thank you for contacting Zone Tourism & Hotwheels Car Rental regarding Ref: ${enquiry.referenceId || enquiry.id}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] transition-colors w-fit shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Internal Notes Section */}
                <div className="bg-[#F8FAFC] rounded-xl p-3 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-600 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>Internal Operational Notes:</span>
                    </span>
                    {!isEditingThisNote && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEnquiryId(enquiry.id);
                          setEditingNotes(enquiry.notes || enquiry.internalNotes || '');
                        }}
                        className="text-[#0B4DA2] hover:text-[#0A2540] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Notes</span>
                      </button>
                    )}
                  </div>

                  {isEditingThisNote ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Add client requirements, quote details, status updates..."
                        className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0B4DA2]"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingEnquiryId(null)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(enquiry.id)}
                          disabled={isSavingNotes}
                          className="px-3 py-1 rounded-lg bg-[#0B4DA2] hover:bg-[#0A2540] text-white text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Save className="w-3 h-3" />
                          <span>{isSavingNotes ? 'Saving...' : 'Save Note'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-700 whitespace-pre-wrap">
                      {enquiry.notes || enquiry.internalNotes || <span className="italic text-slate-400">No notes added yet. Click "Edit Notes" to add details.</span>}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Delete Enquiry</h4>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete enquiry <span className="font-mono font-bold text-slate-700">{deletingEnquiry.referenceId || deletingEnquiry.id}</span> from <span className="font-semibold">{deletingEnquiry.name || 'Client'}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEnquiry}
                disabled={isDeleting}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Enquiry Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getTypeBadge(selectedEnquiry.enquiryType || selectedEnquiry.type || 'visa').color}`}>
                  {getTypeBadge(selectedEnquiry.enquiryType || selectedEnquiry.type || 'visa').label}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700">
                  {selectedEnquiry.referenceId || selectedEnquiry.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Name</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedEnquiry.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Number</span>
                  <span className="font-bold text-slate-800 text-sm font-mono">{selectedEnquiry.whatsappNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Created Date</span>
                  <span className="font-semibold text-slate-700">{new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded font-bold mt-0.5 ${getStatusBadge(selectedEnquiry.status)}`}>
                    {selectedEnquiry.status}
                  </span>
                </div>
              </div>

              {selectedEnquiry.enquiryType === 'visa' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nationality</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.nationality || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">UAE Resident</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.isUaeResident || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.destination || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Travel Date</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.travelDate || 'N/A'}</span>
                  </div>
                </div>
              )}

              {selectedEnquiry.enquiryType === 'car-rental' && (
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Type</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.vehicleType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Service Type</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.serviceType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pickup Location</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.pickupLocation || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Dates</span>
                    <span className="font-semibold text-slate-800">{selectedEnquiry.pickupDate} → {selectedEnquiry.returnDate}</span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Notes & Details</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap">
                  {selectedEnquiry.notes || selectedEnquiry.internalNotes || 'No notes available.'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              {selectedEnquiry.whatsappNumber && (
                <a
                  href={`https://wa.me/${selectedEnquiry.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name || ''}, following up regarding your enquiry Ref: ${selectedEnquiry.referenceId || selectedEnquiry.id}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
