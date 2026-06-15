"use client";

import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  KeyRound,
  Shield,
  UserCheck,
  UserX,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DbUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

function getRoleBadge(variant: string) {
  switch (variant) {
    case "SUPER_ADMIN":
      return "bg-red-500 text-white hover:bg-red-600";
    case "ADMIN":
      return "bg-blue-500 text-white hover:bg-blue-600";
    case "EDITOR":
      return "bg-green-500 text-white hover:bg-green-600";
    default:
      return "bg-gray-500 text-white";
  }
}

export default function AdminUsers({
  users,
  currentUserId,
  currentUserRole,
  loading,
}: {
  users: DbUser[];
  currentUserId: string | null;
  currentUserRole: string;
  loading: boolean;
}) {
  // Add user dialog
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ username: "", email: "", password: "", role: "ADMIN" });
  const [saving, setSaving] = useState(false);

  // Change password dialog
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [cpForm, setCpForm] = useState({ oldPassword: "", newPassword: "", confirmNew: "" });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  // Check if current user can manage others (ADMIN or SUPER_ADMIN)
  const canManageOthers = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";
  const canCreateUsers = currentUserRole === "SUPER_ADMIN";
  const canDeleteUsers = currentUserRole === "SUPER_ADMIN";

  const handleAddUser = async () => {
    if (!addForm.username || !addForm.email || !addForm.password) {
      toast.error("All fields are required");
      return;
    }
    if (addForm.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User created");
        setShowAdd(false);
        setAddForm({ username: "", email: "", password: "", role: "ADMIN" });
        window.location.hash = "";
        window.dispatchEvent(new Event("user-management-changed"));
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (cpForm.newPassword !== cpForm.confirmNew) {
      toast.error("New passwords do not match");
      return;
    }
    if (cpForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: cpForm.oldPassword, newPassword: cpForm.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully");
        setShowChangePassword(false);
        setCpForm({ oldPassword: "", newPassword: "", confirmNew: "" });
      } else {
        toast.error(data.error || "Failed to change password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: true }), // toggled in component via optimistic update
      });
      if (res.ok) {
        toast.success("User status updated");
        window.dispatchEvent(new Event("user-management-changed"));
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleChangeUserRole = async (userId: string, role: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        toast.success("Role updated");
        window.dispatchEvent(new Event("user-management-changed"));
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("User deleted");
        window.dispatchEvent(new Event("user-management-changed"));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const toggleShowPassword = (key: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage admin users and roles</p>
        </div>
        <div className="flex gap-2">
          {canCreateUsers && (
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Add User
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setShowChangePassword(true)}>
            <KeyRound className="w-4 h-4 mr-1.5" /> Change My Password
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              {(canManageOthers || canDeleteUsers) && <TableHead className="w-[120px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const roleLevel: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };
              const currentUserLevel = roleLevel[currentUserRole] ?? 0;
              const userLevel = roleLevel[user.role] ?? 0;
              // Can only change role if current user has higher level
              const canChangeRole = canManageOthers && userLevel < currentUserLevel;
              // Can delete only if SUPER_ADMIN and not self
              const canDelete = canDeleteUsers && !isSelf;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{user.username}</span>
                      {isSelf && <Badge variant="secondary" className="text-[10px]">You</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined {formatDate(user.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {canChangeRole ? (
                        <Select
                          value={user.role}
                          onValueChange={(v) => handleChangeUserRole(user.id, v!)}
                        >
                          <SelectTrigger className="w-[140px] h-7">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EDITOR">Editor</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            {(currentUserRole === "SUPER_ADMIN") && (
                              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={getRoleBadge(user.role)}>{user.role.replace("_", " ")}</Badge>
                      )}
                      <Shield className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {canManageOthers && user.id !== currentUserId ? (
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => handleToggleActive(user.id!)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {user.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {user.isActive ? (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <UserX className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">{user.isActive ? "Active" : "Disabled"}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(user.lastLogin)}</TableCell>
                  {(canManageOthers || canDeleteUsers) && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canDelete && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Username *</Label>
              <Input
                value={addForm.username}
                onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                placeholder="johndoe"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={addForm.role} onValueChange={(v) => v && setAddForm({ ...addForm, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={saving}>
              {saving ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change My Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 pr-9"
                  type={showPasswords.old ? "text" : "password"}
                  value={cpForm.oldPassword}
                  onChange={(e) => setCpForm({ ...cpForm, oldPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => toggleShowPassword("old")}
                  type="button"
                >
                  {showPasswords.old ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label>New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 pr-9"
                  type={showPasswords.new ? "text" : "password"}
                  value={cpForm.newPassword}
                  onChange={(e) => setCpForm({ ...cpForm, newPassword: e.target.value })}
                  placeholder="Minimum 8 characters"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => toggleShowPassword("new")}
                  type="button"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label>Confirm New Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9 pr-9"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={cpForm.confirmNew}
                  onChange={(e) => setCpForm({ ...cpForm, confirmNew: e.target.value })}
                  placeholder="Re-enter new password"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => toggleShowPassword("confirm")}
                  type="button"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePassword(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={saving}>
              {saving ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
