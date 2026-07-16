"use client";

import React, { useState } from "react";
import { useAppState, Administrator } from "@/context/app-state";
import { AddAdminModal } from "@/components/add-admin-modal";
import { Search, UserCheck, UserMinus, ShieldAlert, KeyRound, UserCog } from "lucide-react";

export default function AdminAccessPage() {
  const { currentAdmin, administrators, deleteAdministrator, updateAdminRole } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Administrator | null>(null);
  const [adminToEdit, setAdminToEdit] = useState<Administrator | null>(null);
  const [editRole, setEditRole] = useState<"Super Admin" | "Registry">("Registry");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Guard: Registry users cannot access this page
  if (currentAdmin && currentAdmin.role !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center bg-surface rounded-2xl border border-outline-variant">
        <div className="w-16 h-16 rounded-full bg-error/15 flex items-center justify-center text-error">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
          Your admin account (Registry role) does not have permission to view or manage security access controls. Only Super Administrators can view this page.
        </p>
      </div>
    );
  }

  // Filter admins
  const filteredAdmins = administrators.filter((admin) => {
    const query = searchQuery.toLowerCase();
    return (
      admin.fullName.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  });

  // Calculate metrics
  const totalAdmins = administrators.length;
  const activeSessions = administrators.filter((a) => a.status === "Active").length;
  const invitesPending = administrators.filter((a) => a.status === "Pending").length;

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Header toolbar */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Manage Access</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Control who has access to the HTC management portal.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all flex items-center gap-2 shadow"
        >
          <KeyRound className="w-4 h-4 text-white" />
          Add New Admin
        </button>
      </div>

      {/* Metrics Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Admins</span>
          <span className="text-3xl font-extrabold text-primary">{totalAdmins}</span>
          <span className="text-xs text-on-surface-variant mt-1">Authorized personnel profiles</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Sessions</span>
          <span className="text-3xl font-extrabold text-success">{activeSessions}</span>
          <span className="text-xs text-on-surface-variant mt-1">Verified login credentials active</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-success" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Invites Pending</span>
          <span className="text-3xl font-extrabold text-amber-600">{invitesPending}</span>
          <span className="text-xs text-on-surface-variant mt-1">Pending user authentication setup</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
        </div>
      </div>

      {/* Admin Master List Container */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-high/30 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-accent/20 transition-all max-w-sm w-full">
            <Search className="text-on-surface-variant w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full focus:ring-0 placeholder:text-on-surface-variant/75"
            />
          </div>
        </div>

        {/* Table data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-bold text-on-surface-variant select-none">
                <th className="p-4 pl-6">Administrator Details</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Last Active Login</th>
                <th className="p-4">Authorization Status</th>
                <th className="p-4 pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-on-surface-variant font-medium">
                    No administrators found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-on-surface">{admin.fullName}</span>
                        <span className="text-xs text-on-surface-variant">{admin.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold inline-block border ${
                        admin.role === "Super Admin"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-secondary-container text-on-secondary-container border-secondary/20"
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-on-surface-variant">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never Logged In"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 font-bold rounded-full text-[9px] inline-block ${
                        admin.status === "Active"
                          ? "bg-success/15 text-success border border-success/20"
                          : "bg-amber-500/15 text-amber-600 border border-amber-500/20"
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setAdminToEdit(admin);
                            setEditRole(admin.role);
                          }}
                          className="p-2 border border-outline text-primary hover:bg-primary/5 hover:border-primary/20 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                          title="Edit Administrator Privilege Role"
                        >
                          <UserCog className="w-3.5 h-3.5" />
                          Edit Role
                        </button>
                        {admin.id !== "admin_1" && admin.id !== "admin_abdulganiyu" && admin.id !== "admin_fazazi" && (
                          <button
                            onClick={() => {
                              setAdminToDelete(admin);
                              setDeletePassword("");
                              setDeleteError("");
                            }}
                            className="p-2 border border-outline text-error hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                            title="Revoke Secure Session Access"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            Revoke Access
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Custom Delete Confirmation Modal */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-error/15 flex items-center justify-center text-error shrink-0">
                <ShieldAlert className="w-5 h-5 text-error" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-bold text-base text-on-surface">Revoke Administrator Access</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Are you sure you want to revoke access for <strong className="text-on-surface">{adminToDelete.fullName}</strong> ({adminToDelete.email})?
                </p>
                <p className="text-[10px] text-error/85 font-medium mt-1 leading-normal bg-error/5 p-2 rounded-lg border border-error/10">
                  This action is immediate. They will lose all administrative privileges on the Camp Portal.
                </p>

                {adminToDelete.role === "Super Admin" && (
                  <div className="flex flex-col gap-1.5 mt-4">
                    <label className="text-xs font-bold text-error flex items-center gap-1">
                      Super Admin Security Override Required
                    </label>
                    <p className="text-[10px] text-on-surface-variant">
                      Enter the system master password to authorize this action:
                    </p>
                    <input
                      type="password"
                      placeholder="Enter system password"
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value);
                        setDeleteError("");
                      }}
                      className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none"
                    />
                    {deleteError && (
                      <p className="text-[10px] text-error font-bold mt-1">{deleteError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-2 pt-3 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => {
                  setAdminToDelete(null);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="px-4 py-2 border border-outline text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (adminToDelete.role === "Super Admin" && deletePassword !== "HtcAdminPortal'26") {
                    setDeleteError("Invalid system password. Action rejected.");
                    return;
                  }
                  await deleteAdministrator(adminToDelete.id);
                  setAdminToDelete(null);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="px-5 py-2 bg-error hover:bg-error/95 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserMinus className="w-3.5 h-3.5 text-white" />
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit Role Modal */}
      {adminToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <h3 className="font-bold text-base text-on-surface">Edit Administrator Role</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Update administrative privileges for <strong className="text-on-surface">{adminToEdit.fullName}</strong> ({adminToEdit.email}).
                </p>
                
                <div className="flex flex-col gap-2 mt-4">
                  <label className="text-xs font-bold text-on-surface-variant">Access Privilege Level</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as "Super Admin" | "Registry")}
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="Registry">Registry (Auditing & Rooms)</option>
                    <option value="Super Admin">Super Admin (Full Security & Controls)</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setAdminToEdit(null)}
                className="px-4 py-2 border border-outline text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateAdminRole(adminToEdit.id, editRole);
                  setAdminToEdit(null);
                }}
                className="px-5 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
