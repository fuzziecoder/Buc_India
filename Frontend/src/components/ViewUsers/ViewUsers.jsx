import React, { useState, useEffect, useCallback } from "react";
import { Download, RefreshCw, Filter, X, Camera, FileText, Upload, Shield, GraduationCap, Bike, Users, User, Mail, Phone, Trash2 } from "lucide-react";
import { profileService, clubService } from "../../services/api";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";

const REGISTRATION_TYPES = ["All", "PC", "Rider", "Student Rider", "Student"];

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  // Admin edit states
  const [clubs, setClubs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState(null);
  const [editProfileImagePreview, setEditProfileImagePreview] = useState(null);
  const [editLicenseImage, setEditLicenseImage] = useState(null);
  const [editLicenseImagePreview, setEditLicenseImagePreview] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubData = await clubService.getPublic();
        setClubs(clubData || []);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };
    fetchClubs();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      id: user._id,
      registrationType: user.registrationType || "Rider",
      fullName: user.fullName || "",
      gender: user.gender || "",
      phone: user.phone || "",
      email: user.email || "", // view only
      collegeName: user.collegeName || "",
      collegeIdNo: user.collegeIdNo || "",
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      bloodGroup: user.bloodGroup || "",
      address: user.address || "",
      city: user.city || "",
      state: user.state || "",
      pincode: user.pincode || "",
      bikeModel: user.bikeModel || "",
      bikeRegistrationNumber: user.bikeRegistrationNumber || "",
      licenseNumber: user.licenseNumber || "",
      clubId: user.clubId?._id || user.clubId || "",
      emergencyContactName: user.emergencyContactName || "",
      emergencyContactPhone: user.emergencyContactPhone || "",
      facebookUrl: user.facebookUrl || "",
      instagramUrl: user.instagramUrl || "",
      twitterUrl: user.twitterUrl || "",
      youtubeUrl: user.youtubeUrl || "",
      websiteUrl: user.websiteUrl || "",
    });
    setEditProfileImagePreview(user.profileImage || null);
    setEditLicenseImagePreview(user.licenseImage || null);
    setEditProfileImage(null);
    setEditLicenseImage(null);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = new FormData();
      Object.keys(editFormData).forEach((key) => {
        payload.append(key, editFormData[key]);
      });
      if (editProfileImage) {
        payload.append("profileImage", editProfileImage);
      }
      if (editLicenseImage) {
        payload.append("licenseImage", editLicenseImage);
      }

      await profileService.update(payload);
      alert("Profile updated successfully!");
      setShowEditModal(false);
      loadData();
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const allUsers = await profileService.getAllAdmin();
      const processedUsers = allUsers.map(u => {
        // Ensure clubName is always defined on every user object so the column header is generated dynamically
        u.clubName = "-";
        if (u.clubId && typeof u.clubId === 'object' && u.clubId.name) {
          u.clubName = u.clubId.name;
        } else if (u.clubId && typeof u.clubId === 'string') {
          u.clubName = u.clubId;
        }
        delete u.clubId;
        return u;
      });
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users from server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filterData = useCallback(() => {
    let filtered = [...users];
    if (filterName.trim()) {
      filtered = filtered.filter(u =>
        (u.fullName && u.fullName.toLowerCase().includes(filterName.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(filterName.toLowerCase()))
      );
    }
    if (filterType !== "All") {
      filtered = filtered.filter(u => u.registrationType === filterType);
    }
    setFilteredUsers(filtered);
  }, [users, filterName, filterType]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  const formatColumnName = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const columns = [
    { key: "sno", label: "S.No", width: "60px" },
    { key: "actions", label: "Actions", width: "120px" },
    { key: "profileImage", label: "Profile Image", width: "110px" },
    { key: "licenseImage", label: "License Image", width: "110px" },
    { key: "bucId", label: "BUC ID", width: "110px" },
    { key: "registrationType", label: "Registration Type", width: "140px" },
    { key: "fullName", label: "Full Name", width: "150px" },
    { key: "phone", label: "Phone Number", width: "120px" },
    { key: "email", label: "Email Address", width: "180px" },
    { key: "collegeName", label: "College Name", width: "150px" },
    { key: "collegeIdNo", label: "Student ID Number", width: "140px" },
    { key: "dateOfBirth", label: "Date of Birth", width: "110px" },
    { key: "bloodGroup", label: "Blood Group", width: "100px" },
    { key: "address", label: "Address", width: "200px" },
    { key: "city", label: "City", width: "120px" },
    { key: "state", label: "State", width: "120px" },
    { key: "pincode", label: "Pincode", width: "100px" },
    { key: "bikeModel", label: "Bike Model", width: "120px" },
    { key: "bikeRegistrationNumber", label: "Bike Registration", width: "150px" },
    { key: "licenseNumber", label: "License Number", width: "150px" },
    { key: "clubName", label: "Associated Club", width: "150px" },
    { key: "emergencyContactName", label: "Emergency Contact Name", width: "160px" },
    { key: "emergencyContactPhone", label: "Emergency Contact Phone", width: "160px" },
    { key: "facebookUrl", label: "Facebook", width: "150px" },
    { key: "instagramUrl", label: "Instagram", width: "150px" },
    { key: "twitterUrl", label: "Twitter / X", width: "150px" },
    { key: "youtubeUrl", label: "YouTube", width: "150px" },
    { key: "websiteUrl", label: "Personal Website", width: "150px" },
    { key: "createdAt", label: "Registered At", width: "120px" },
  ];

  const renderCellValue = (column, user, index) => {
    if (column.key === "sno") return index + 1;
    if (column.key === "actions") {
      return (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", alignItems: "center" }}>
          {/* Edit Button */}
          <button
            onClick={() => handleEditClick(user)}
            title="Edit User"
            style={{
              background: "rgba(193, 154, 107, 0.15)",
              color: "#c19a6b",
              border: "1px solid rgba(193, 154, 107, 0.3)",
              borderRadius: "6px",
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              fontSize: "10px",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#c19a6b";
              e.currentTarget.style.color = "#111";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(193, 154, 107, 0.15)";
              e.currentTarget.style.color = "#c19a6b";
            }}
          >
            EDIT
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteUser(user._id, user.fullName)}
            title="Delete User"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "6px",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "#ef4444";
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      );
    }
    const value = user[column.key];
    if (column.key === "profileImage" || column.key === "licenseImage") {
      if (!value) return "-";
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View Image
        </a>
      );
    }
    if (column.key.toLowerCase().includes("date") || column.key.toLowerCase().includes("at")) {
      if (value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) return date.toLocaleDateString();
        } catch (e) {}
      }
    }
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  };

  const getAvailableFields = () => {
    if (filteredUsers.length === 0) return [];
    const excludeFields = ["_id", "password", "licenseImagePublicId", "profileImagePublicId", "__v", "updatedAt"];
    const firstReg = filteredUsers[0];
    const keys = Object.keys(firstReg).filter((key) => !excludeFields.includes(key));
    return keys.map((key) => ({ key, label: formatColumnName(key) }));
  };

  const handleExportClick = (type) => {
    if (filteredUsers.length === 0) {
      alert("No users to export");
      return;
    }
    const fields = getAvailableFields();
    setAvailableFields(fields);
    setSelectedFields(fields.map((f) => f.key));
    setExportType(type);
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    if (selectedFields.length === 0) {
      alert("Please select at least one field to export");
      return;
    }
    setShowExportModal(false);

    const title = `BUC India - Registered Users${filterType !== "All" ? ` (${filterType})` : ""}`;
    
    if (exportType === "excel") {
      exportToExcel(filteredUsers, null, selectedFields);
    } else if (exportType === "pdf") {
      exportToPDF(filteredUsers, null, selectedFields, { eventTitle: title });
    }

    setExportType(null);
    setSelectedFields([]);
  };

  const handleExportCancel = () => {
    setShowExportModal(false);
    setExportType(null);
    setSelectedFields([]);
  };

  const toggleFieldSelection = (fieldKey) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey) ? prev.filter((k) => k !== fieldKey) : [...prev, fieldKey]
    );
  };

  const selectAllFields = () => setSelectedFields(availableFields.map((f) => f.key));
  const deselectAllFields = () => setSelectedFields([]);

  const clearFilters = () => {
    setFilterName("");
    setFilterType("All");
  };

  const handleDeleteUser = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${fullName || 'this user'}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsLoading(true);
      await profileService.delete(id);
      alert("User deleted successfully");
      loadData(); // Reload the list
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="view-registrations">
      <div className="page-header">
        <div>
          <h1 className="page-title">Registered Users</h1>
          <p className="page-subtitle">
            Total: {filteredUsers.length} user(s)
            {filterType !== "All" && <span style={{ color: "#c19a6b", marginLeft: 8 }}>— {filterType}</span>}
          </p>
        </div>
        <div className="header-actions" style={{ flexWrap: "wrap", gap: "8px" }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="filter-input"
          />

          {/* Role Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-input"
            style={{ minWidth: 140 }}
          >
            {REGISTRATION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {(filterName || filterType !== "All") && (
            <button onClick={clearFilters} className="clear-filters-button" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <X size={14} /> Clear
            </button>
          )}

          {/* Export Actions */}
          <button
            onClick={() => handleExportClick("excel")}
            className="refresh-button"
            title="Export to Excel"
            style={{ background: "#217346", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Download size={16} /> Excel
          </button>

          <button
            onClick={() => handleExportClick("pdf")}
            className="refresh-button"
            title="Export to PDF"
            style={{ background: "#c19a6b", color: "#111", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Download size={16} /> PDF
          </button>

          <button
            onClick={loadData}
            className="refresh-button"
            title="Refresh Data"
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Role Filter Badges */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {REGISTRATION_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: "4px 14px",
              borderRadius: 999,
              border: filterType === type ? "1px solid #c19a6b" : "1px solid rgba(255,255,255,0.1)",
              background: filterType === type ? "rgba(193,154,107,0.15)" : "transparent",
              color: filterType === type ? "#c19a6b" : "#888",
              fontSize: 10,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {type}
            {type !== "All" && (
              <span style={{ marginLeft: 6, opacity: 0.6 }}>
                ({users.filter(u => u.registrationType === type).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading users...</p>
        </div>
      ) : columns.length === 0 ? (
        <div className="empty-state">
          <p>No users found for the selected criteria.</p>
        </div>
      ) : (
        <div className="registrations-table-container">
          <table className="registrations-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={column.width !== "auto" ? { width: column.width } : {}}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty-table-message">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id || index}>
                    {columns.map((column) => (
                      <td key={`${user._id || index}-${column.key}`}>
                        {renderCellValue(column, user, index)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showExportModal && (
        <div className="export-modal-overlay" onClick={handleExportCancel} style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()} style={{
            background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", width: "90%", maxWidth: "500px", display: "flex", flexDirection: "column", maxHeight: "80vh"
          }}>
            <div className="export-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ margin: 0, color: "#fff" }}>Select Fields to Export ({exportType === "excel" ? "Excel" : "PDF"})</h3>
              <button onClick={handleExportCancel} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "16px" }}>✕</button>
            </div>
            <div className="export-modal-content" style={{ padding: "16px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
                <button onClick={selectAllFields} style={{ background: "#c19a6b", color: "#111", border: "none", padding: "4px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Select All</button>
                <button onClick={deselectAllFields} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "4px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>Deselect All</button>
                <span style={{ color: "#888", fontSize: "12px", marginLeft: "auto" }}>{selectedFields.length} of {availableFields.length} selected</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {availableFields.map((field) => (
                  <label key={field.key} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ccc", fontSize: "13px", cursor: "pointer" }}>
                    <input type="checkbox" checked={selectedFields.includes(field.key)} onChange={() => toggleFieldSelection(field.key)} style={{ accentColor: "#c19a6b" }} />
                    <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{field.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="export-modal-footer" style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={handleExportCancel} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
              <button onClick={handleExportConfirm} disabled={selectedFields.length === 0} style={{ background: selectedFields.length === 0 ? "rgba(255,255,255,0.1)" : "#c19a6b", color: selectedFields.length === 0 ? "#888" : "#111", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: selectedFields.length === 0 ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                Export {exportType === "excel" ? "Excel" : "PDF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-carbon/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-carbon-light border border-white/10 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="font-heading text-xl uppercase tracking-wider text-white flex items-center gap-3">
                <Users className="text-copper" size={24} /> Edit User Registration
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-steel-dim hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-y-auto p-6 md:p-8 flex-grow space-y-8 max-h-[75vh]">
              <form onSubmit={handleEditSubmit} className="space-y-8">
                {/* Visual Assets */}
                {editFormData.registrationType !== "PC" && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <Camera size={14} /> Visual Assets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Image */}
                      <div className="space-y-2">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Profile Image</label>
                        <div className="flex items-center gap-4 bg-carbon p-4 border border-white/5">
                          {editProfileImagePreview ? (
                            <img src={editProfileImagePreview} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-copper/30" />
                          ) : (
                            <div className="w-16 h-16 bg-white/5 flex items-center justify-center rounded-full text-steel-dim border border-white/10">
                              <Camera size={20} />
                            </div>
                          )}
                          <label className="cursor-pointer bg-white/5 hover:bg-copper hover:text-carbon text-white font-heading text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 transition-all font-bold">
                            Change Image
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setEditProfileImage(file);
                                const reader = new FileReader();
                                reader.onloadend = () => setEditProfileImagePreview(reader.result);
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                        </div>
                      </div>

                      {/* License Image */}
                      {(editFormData.registrationType === "Rider" || editFormData.registrationType === "Student Rider") && (
                        <div className="space-y-2">
                          <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">License Image</label>
                          <div className="flex items-center gap-4 bg-carbon p-4 border border-white/5">
                            {editLicenseImagePreview ? (
                              <img src={editLicenseImagePreview} alt="License" className="w-16 h-16 object-cover border border-copper/30" />
                            ) : (
                              <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-steel-dim border border-white/10">
                                <FileText size={20} />
                              </div>
                            )}
                            <label className="cursor-pointer bg-white/5 hover:bg-copper hover:text-carbon text-white font-heading text-[10px] uppercase tracking-widest px-4 py-2 border border-white/10 transition-all font-bold">
                              Change Image
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setEditLicenseImage(file);
                                  const reader = new FileReader();
                                  reader.onloadend = () => setEditLicenseImagePreview(reader.result);
                                  reader.readAsDataURL(file);
                                }
                              }} />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                    <User size={14} /> Basic Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Full Name</label>
                      <input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Phone Number</label>
                      <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value.replace(/\D/g, "").slice(0, 10)})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">T-Shirt Size</label>
                      <select value={editFormData.tshirtSize} onChange={(e) => setEditFormData({...editFormData, tshirtSize: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white appearance-none" style={{ background: "#111" }} required>
                        <option value="">Select Size</option>
                        {["S", "M", "L", "XL", "XXL", "XXXL"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Gender</label>
                      <select value={editFormData.gender} onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white appearance-none" style={{ background: "#111" }} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefernottosay">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Email Address (Read-Only)</label>
                      <input type="email" value={editFormData.email} disabled className="w-full bg-carbon/50 border border-white/10 px-4 py-3 font-body text-xs outline-none opacity-50 text-white" />
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                {(editFormData.registrationType === "Student" || editFormData.registrationType === "Student Rider") && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <GraduationCap size={14} /> Student Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">College Name</label>
                        <input type="text" value={editFormData.collegeName} onChange={(e) => setEditFormData({...editFormData, collegeName: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Student ID Number</label>
                        <input type="text" value={editFormData.collegeIdNo} onChange={(e) => setEditFormData({...editFormData, collegeIdNo: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Personal Details */}
                {(editFormData.registrationType === "Rider" || editFormData.registrationType === "Student Rider") && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <Calendar size={14} /> Personal Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Date of Birth</label>
                        <input type="date" value={editFormData.dateOfBirth} onChange={(e) => setEditFormData({...editFormData, dateOfBirth: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Blood Group</label>
                        <select value={editFormData.bloodGroup} onChange={(e) => setEditFormData({...editFormData, bloodGroup: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white appearance-none" style={{ background: "#111" }} required>
                          <option value="">Select Blood Group</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                    <Shield size={14} /> Address Info
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Address</label>
                      <input type="text" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">City</label>
                        <input type="text" value={editFormData.city} onChange={(e) => setEditFormData({...editFormData, city: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">State</label>
                        <input type="text" value={editFormData.state} onChange={(e) => setEditFormData({...editFormData, state: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Pincode</label>
                        <input type="text" value={editFormData.pincode} onChange={(e) => setEditFormData({...editFormData, pincode: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bike & License Info */}
                {(editFormData.registrationType === "Rider" || editFormData.registrationType === "Student Rider" || editFormData.registrationType === "PC") && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <Bike size={14} /> Bike & License Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Bike Model</label>
                        <input type="text" value={editFormData.bikeModel} onChange={(e) => setEditFormData({...editFormData, bikeModel: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Bike Registration Number</label>
                        <input type="text" value={editFormData.bikeRegistrationNumber} onChange={(e) => setEditFormData({...editFormData, bikeRegistrationNumber: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      {(editFormData.registrationType === "Rider" || editFormData.registrationType === "Student Rider") && (
                        <div className="space-y-1 md:col-span-2">
                          <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">License Number</label>
                          <input type="text" value={editFormData.licenseNumber} onChange={(e) => setEditFormData({...editFormData, licenseNumber: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Club Affiliation */}
                {(editFormData.registrationType === "Rider" || editFormData.registrationType === "Student Rider") && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <Shield size={14} /> Club Affiliation
                    </h3>
                    <div className="space-y-1">
                      <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Select Associated Club</label>
                      <select value={editFormData.clubId} onChange={(e) => setEditFormData({...editFormData, clubId: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white appearance-none" style={{ background: "#111" }}>
                        <option value="">None / Not Applicable</option>
                        {clubs.map(club => (
                          <option key={club.id} value={club.id}>{club.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {editFormData.registrationType !== "PC" && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <Shield size={14} /> Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Emergency Contact Name</label>
                        <input type="text" value={editFormData.emergencyContactName} onChange={(e) => setEditFormData({...editFormData, emergencyContactName: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Emergency Contact Phone</label>
                        <input type="text" value={editFormData.emergencyContactPhone} onChange={(e) => setEditFormData({...editFormData, emergencyContactPhone: e.target.value.replace(/\D/g, "").slice(0, 10)})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" required />
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Presence */}
                {editFormData.registrationType !== "PC" && (
                  <div className="space-y-4">
                    <h3 className="font-body text-xs uppercase tracking-[0.2em] text-copper border-b border-white/10 pb-2 flex items-center gap-2">
                      <Shield size={14} /> Social Presence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Facebook URL</label>
                        <input type="text" value={editFormData.facebookUrl} onChange={(e) => setEditFormData({...editFormData, facebookUrl: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Instagram URL</label>
                        <input type="text" value={editFormData.instagramUrl} onChange={(e) => setEditFormData({...editFormData, instagramUrl: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Twitter / X URL</label>
                        <input type="text" value={editFormData.twitterUrl} onChange={(e) => setEditFormData({...editFormData, twitterUrl: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">YouTube URL</label>
                        <input type="text" value={editFormData.youtubeUrl} onChange={(e) => setEditFormData({...editFormData, youtubeUrl: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="font-body text-[10px] uppercase tracking-widest text-steel-dim">Personal Website URL</label>
                        <input type="text" value={editFormData.websiteUrl} onChange={(e) => setEditFormData({...editFormData, websiteUrl: e.target.value})} className="w-full bg-carbon border border-white/10 px-4 py-3 font-body text-xs outline-none focus:border-copper transition-colors text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-4 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-heading text-xs uppercase tracking-widest transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-8 py-3 bg-copper hover:bg-white text-carbon font-heading text-xs uppercase tracking-widest transition-all font-bold disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;
