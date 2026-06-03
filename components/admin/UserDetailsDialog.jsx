// components/admin/UserDetailsDialog.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Shield,
  FileText,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  File,
  X,
  Award,
  Heart,
  Trophy
} from "lucide-react";

export default function UserDetailsDialog({ open, onOpenChange, user }) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!open || !user) return null;

  const account = user.account || user;
  const profile = user.profile;
  const schedules = user.schedules || [];
  const documents = user.documents || [];
  const notifications = user.notifications || [];
  const stats = user.stats || {};


 


  const getRoleColor = (role) => {
    switch (role) {
      case "ATHLETE": return "bg-[rgba(212,175,100,0.15)] text-[#d4af64] border border-[rgba(212,175,100,0.2)]";
      case "COACH": return "bg-[rgba(212,175,100,0.15)] text-[#d4af64] border border-[rgba(212,175,100,0.2)]";
      default: return "bg-[rgba(212,175,100,0.15)] text-[#d4af64] border border-[rgba(212,175,100,0.2)]";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED": return "bg-[rgba(212,175,100,0.15)] text-[#d4af64] border border-[rgba(212,175,100,0.2)]";
      case "COMPLETED": return "bg-[rgba(52,199,89,0.1)] text-[#4ade80] border border-[rgba(52,199,89,0.2)]";
      case "CANCELLED": return "bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)]";
      default: return "bg-[rgba(240,230,200,0.05)] text-[rgba(240,230,200,0.5)] border border-[rgba(240,230,200,0.1)]";
    }
  };

  const Badge = ({ children, className = "", variant = "default" }) => {
    const variantClasses = {
      default: "bg-[rgba(212,175,100,0.15)] text-[#d4af64] border border-[rgba(212,175,100,0.2)]",
      destructive: "bg-[rgba(255,100,100,0.1)] text-[#fc8181] border border-[rgba(255,100,100,0.2)]",
      success: "bg-[rgba(52,199,89,0.1)] text-[#4ade80] border border-[rgba(52,199,89,0.2)]",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body ${variantClasses[variant]} ${className}`}>
        {children}
      </span>
    );
  };

  const Card = ({ children, className = "" }) => (
    <div className={`bg-[#0f0f12] rounded-xl border border-[rgba(212,175,100,0.1)] ${className}`}>
      {children}
    </div>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );

  const Tabs = ({ children, value, onValueChange }) => {
    return (
      <div>
        {React.Children.map(children, (child) => {
          if (child.type === TabsList) {
            return React.cloneElement(child, {
              activeTab: value,
              onValueChange,
            });
          }
          if (child.type === TabsContent) {
            return React.cloneElement(child, {
              activeTab: value,
            });
          }
          return child;
        })}
      </div>
    );
  };

  const TabsList = ({ children, activeTab, onValueChange, className = "" }) => (
    <div className={`flex bg-[#0c0c0e] rounded-lg p-1 mb-6 overflow-x-auto flex-wrap gap-1 ${className}`}>
      {React.Children.map(children, child => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, onTabChange: onValueChange });
        }
        return child;
      })}
    </div>
  );

  const TabsTrigger = ({ children, value, activeTab, onTabChange, className = "" }) => (
    <button
      onClick={() => onTabChange(value)}
      className={`px-4 py-2 text-sm font-body font-medium rounded-lg transition-all duration-200 ${
        activeTab === value
          ? "bg-[rgba(212,175,100,0.1)] text-[#d4af64]"
          : "text-[rgba(240,230,200,0.5)] hover:text-[rgba(240,230,200,0.7)] hover:bg-[rgba(212,175,100,0.05)]"
      } ${className}`}
    >
      {children}
    </button>
  );

  const TabsContent = ({ children, value, activeTab }) => {
    if (value !== activeTab) return null;
    return <div className="anim-fade-up">{children}</div>;
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0f0f12] rounded-2xl shadow-2xl border border-[rgba(212,175,100,0.15)] max-w-4xl w-full max-h-[85vh] flex flex-col animate-slideDown">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,175,100,0.1)]">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#d4af64]" />
              <h2 className="font-display text-xl font-medium text-[#f0e6c8]">User Profile</h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-lg text-[rgba(240,230,200,0.4)] hover:text-[#f0e6c8] hover:bg-[rgba(212,175,100,0.1)] transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Header Card */}
            <div className="bg-gradient-to-r from-[rgba(212,175,100,0.05)] to-[rgba(212,175,100,0.02)] rounded-xl p-6 mb-6 border border-[rgba(212,175,100,0.1)]">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(212,175,100,0.2)] to-[rgba(212,175,100,0.05)] flex items-center justify-center border-2 border-[rgba(212,175,100,0.3)]">
                    {profile?.profilePictureUrl ? (
                      <img 
                        src={profile.profilePictureUrl} 
                        alt={account.username}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-2xl text-[#d4af64] font-display">${account.username?.[0]?.toUpperCase()}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-2xl text-[#d4af64] font-display font-semibold">
                        {account.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4ade80] border-2 border-[#0f0f12]"></div>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-1">
                    <h2 className="font-display text-xl font-medium text-[#f0e6c8]">
                      {profile?.fullName || account.username}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start text-sm">
                    <Mail className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                    <span className="text-[rgba(240,230,200,0.6)] font-body">{account.email}</span>
                    {account.phone && (
                      <>
                        <span className="text-[rgba(240,230,200,0.3)]">•</span>
                        <Phone className="w-3.5 h-3.5 text-[rgba(212,175,100,0.5)]" />
                        <span className="text-[rgba(240,230,200,0.6)] font-body">{account.phone}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Badge className={getRoleColor(account.role)}>
                      {account.role}
                    </Badge>
                    <Badge variant={account.approvalStatus === "APPROVED" ? "success" : "default"}>
                      {account.approvalStatus==="APPROVED" ? "Approved" : "Pending"}
                    </Badge>
                    {account.isBlocked && (
                      <Badge variant="destructive">Blocked</Badge>
                    )}
                    {account.isVerified && (
                      <Badge variant="success">Verified</Badge>
                    )}
                  </div>
                </div>

                {/* Stats quick view */}
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-display font-light text-[#d4af64]">{documents.length}</p>
                    <p className="text-xs text-[rgba(240,230,200,0.4)] font-body">Docs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-light text-[#d4af64]">{schedules.length}</p>
                    <p className="text-xs text-[rgba(240,230,200,0.4)] font-body">Events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="schedules">Schedules</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" activeTab={activeTab}>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Basic Info */}
                    <Card>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-4 h-4 text-[#d4af64]" />
                          <h3 className="font-display text-sm font-medium text-[rgba(240,230,200,0.8)] uppercase tracking-wider">Basic Information</h3>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex flex-wrap justify-between items-center">
                            <span className="text-[rgba(240,230,200,0.4)] font-body">Username:</span>
                            <span className="font-body text-[#f0e6c8]">{account.username}</span>
                          </div>
                          <div className="flex flex-wrap justify-between items-center">
                            <span className="text-[rgba(240,230,200,0.4)] font-body">Email:</span>
                            <span className="font-body text-[#f0e6c8] break-all text-right">{account.email}</span>
                          </div>
                          {account.phone && (
                            <div className="flex flex-wrap justify-between items-center">
                              <span className="text-[rgba(240,230,200,0.4)] font-body">Phone:</span>
                              <span className="font-body text-[#f0e6c8]">{account.phone}</span>
                            </div>
                          )}
                          <div className="flex flex-wrap justify-between items-center">
                            <span className="text-[rgba(240,230,200,0.4)] font-body">Role:</span>
                            <span className="font-body text-[#d4af64]">{account.role}</span>
                          </div>
                          <div className="flex flex-wrap justify-between items-center">
                            <span className="text-[rgba(240,230,200,0.4)] font-body">Joined:</span>
                            <span className="font-body text-[rgba(240,230,200,0.6)]">{new Date(account.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Profile Info */}
                    {profile && (
                      <Card>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-4">
                            <Award className="w-4 h-4 text-[#d4af64]" />
                            <h3 className="font-display text-sm font-medium text-[rgba(240,230,200,0.8)] uppercase tracking-wider">Profile Details</h3>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex flex-wrap justify-between items-center">
                              <span className="text-[rgba(240,230,200,0.4)] font-body">Full Name:</span>
                              <span className="font-body text-[#f0e6c8]">{profile.fullName}</span>
                            </div>
                            {profile.age && (
                              <div className="flex flex-wrap justify-between items-center">
                                <span className="text-[rgba(240,230,200,0.4)] font-body">Age:</span>
                                <span className="font-body text-[#f0e6c8]">{profile.age} years</span>
                              </div>
                            )}
                            <div className="flex flex-wrap justify-between items-center">
                              <span className="text-[rgba(240,230,200,0.4)] font-body">Sport:</span>
                              <span className="font-body text-[#d4af64]">{profile.sport}</span>
                            </div>
                            <div className="flex flex-wrap justify-between items-center">
                              <span className="text-[rgba(240,230,200,0.4)] font-body">Level:</span>
                              <span className="font-body text-[#f0e6c8]">{profile.level}</span>
                            </div>
                            {profile.club && (
                              <div className="flex flex-wrap justify-between items-center">
                                <span className="text-[rgba(240,230,200,0.4)] font-body">Club:</span>
                                <span className="font-body text-[#f0e6c8]">{profile.club}</span>
                              </div>
                            )}
                            {profile.address && (
                              <div className="flex flex-wrap justify-between items-start gap-2">
                                <span className="text-[rgba(240,230,200,0.4)] font-body">Address:</span>
                                <span className="font-body text-[rgba(240,230,200,0.6)] text-right">{profile.address}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <Card>
                      <CardContent>
                        <div className="flex items-center gap-2 mb-3">
                          <Heart className="w-4 h-4 text-[#d4af64]" />
                          <h3 className="font-display text-sm font-medium text-[rgba(240,230,200,0.8)] uppercase tracking-wider">About</h3>
                        </div>
                        <p className="text-sm text-[rgba(240,230,200,0.6)] font-body italic leading-relaxed">
                          {profile.bio}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" activeTab={activeTab}>
                <Card>
                  <CardContent>
                    {documents.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-[rgba(212,175,100,0.2)] mx-auto mb-3" />
                        <p className="text-[rgba(240,230,200,0.4)] font-body">No documents uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div key={index} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,175,100,0.08)] rounded-lg p-4 hover:border-[rgba(212,175,100,0.2)] transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(212,175,100,0.1)] flex items-center justify-center flex-shrink-0">
                                  <File className="w-5 h-5 text-[#d4af64]" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-body font-medium text-[#f0e6c8] text-sm truncate">
                                    {doc.documentType?.replace(/_/g, " ") || "Document"}
                                  </p>
                                  {doc.uploadedAt && (
                                    <p className="text-xs text-[rgba(240,230,200,0.4)] mt-1">
                                      {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <a
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-[rgba(212,175,100,0.6)] hover:text-[#d4af64] hover:bg-[rgba(212,175,100,0.1)] rounded-lg transition-all flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedules Tab */}
              <TabsContent value="schedules" activeTab={activeTab}>
                <Card>
                  <CardContent>
                    {schedules.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-[rgba(212,175,100,0.2)] mx-auto mb-3" />
                        <p className="text-[rgba(240,230,200,0.4)] font-body">No schedules created</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {schedules.map((schedule) => (
                          <div key={schedule.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,175,100,0.08)] rounded-lg p-4 hover:border-[rgba(212,175,100,0.2)] transition-all duration-300">
                            <div className="flex flex-wrap justify-between items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h4 className="font-body font-medium text-[#f0e6c8] text-sm">{schedule.title}</h4>
                                  <Badge className={getStatusColor(schedule.status)}>
                                    {schedule.status}
                                  </Badge>
                                </div>
                                <div className="space-y-1.5 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-[rgba(212,175,100,0.4)]" />
                                    <span className="text-[rgba(240,230,200,0.6)] font-body text-xs">
                                      {new Date(schedule.date).toLocaleDateString()}
                                    </span>
                                    <Clock className="w-3.5 h-3.5 text-[rgba(212,175,100,0.4)] ml-1" />
                                    <span className="text-[rgba(240,230,200,0.6)] font-body text-xs">{schedule.time}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-[rgba(212,175,100,0.4)]" />
                                    <span className="text-[rgba(240,230,200,0.6)] font-body text-xs truncate">{schedule.location}</span>
                                  </div>
                                </div>
                                {schedule.description && (
                                  <p className="text-xs text-[rgba(240,230,200,0.4)] mt-2 line-clamp-2">{schedule.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" activeTab={activeTab}>
                <Card>
                  <CardContent>
                    {notifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="w-12 h-12 text-[rgba(212,175,100,0.2)] mx-auto mb-3" />
                        <p className="text-[rgba(240,230,200,0.4)] font-body">No notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.slice(0, 10).map((notification) => (
                          <div key={notification.id} className="flex items-start gap-3 p-3 bg-[rgba(255,255,255,0.02)] rounded-lg border border-[rgba(212,175,100,0.05)]">
                            <Bell className="w-4 h-4 text-[#d4af64] mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-body font-medium text-[#f0e6c8] text-sm">{notification.title}</p>
                              <p className="text-xs text-[rgba(240,230,200,0.5)] mt-0.5">{notification.message}</p>
                              <p className="text-xs text-[rgba(240,230,200,0.3)] mt-1">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-[#d4af64] flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}