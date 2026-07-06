"use client";

import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePhase3Store } from "@/lib/phase3-store";
import { getGroupBySlug, getGroupMembers, isGroupMember } from "@/lib/phase3-mock-data";
import { socialUsers } from "@/lib/social-mock-data";
import { Users, Lock, Globe, ArrowLeft, Shield, Crown, UserPlus, Settings } from "lucide-react";

const CURRENT_USER_ID = "user-001";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { joinGroup, leaveGroup } = usePhase3Store();

  const slug = params.slug as string;
  const group = getGroupBySlug(slug);

  if (!group) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-muted">Group not found</p>
          <button onClick={() => router.push("/groups")} className="mt-4 text-primary text-sm">
            Back to Groups
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const members = getGroupMembers(group.id);
  const isMember = isGroupMember(group.id, CURRENT_USER_ID);
  const userRole = members.find((m) => m.user_id === CURRENT_USER_ID)?.role;
  const isAdmin = userRole === "admin";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Cover */}
        <div className="relative">
          {group.cover_url ? (
            <img src={group.cover_url} alt="" className="w-full h-48 sm:h-56 object-cover" />
          ) : (
            <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-primary/30 to-primary/10" />
          )}
          <button
            onClick={() => router.push("/groups")}
            className="absolute top-4 left-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Group Info */}
        <div className="px-4 sm:px-6 -mt-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {group.avatar_url ? (
              <img src={group.avatar_url} alt="" className="w-20 h-20 rounded-xl object-cover border-4 border-card-bg shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary/20 border-4 border-card-bg shadow-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">{group.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted mt-1">
                {group.privacy === "public" ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span className="capitalize">{group.privacy} Group</span>
                <span>-</span>
                <span>{group.member_count} members</span>
                <span>-</span>
                <span>{group.post_count} posts</span>
              </div>
            </div>
            <div className="flex gap-2">
              {isMember ? (
                <>
                  {isAdmin && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-card-bg border border-card-border rounded-lg text-sm font-medium text-foreground hover:border-primary/30">
                      <Settings className="w-4 h-4" />
                      Manage
                    </button>
                  )}
                  <button
                    onClick={() => leaveGroup(group.id, CURRENT_USER_ID)}
                    className="px-4 py-2 bg-card-bg border border-card-border rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Leave
                  </button>
                </>
              ) : (
                <button
                  onClick={() => joinGroup(group.id, CURRENT_USER_ID)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  <UserPlus className="w-4 h-4" />
                  Join Group
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          {group.description && (
            <p className="mt-4 text-sm text-muted">{group.description}</p>
          )}
        </div>

        {/* Members List */}
        <div className="px-4 sm:px-6 mt-8">
          <h2 className="text-sm font-semibold text-muted uppercase mb-4">
            Members ({members.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {members.map((member) => {
              const user = socialUsers.find((u) => u.id === member.user_id);
              if (!user) return null;
              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 bg-card-bg border border-card-border rounded-xl hover:border-primary/30 cursor-pointer transition"
                  onClick={() => router.push(`/u/${user.username}`)}
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">{user.full_name}</span>
                      {member.role === "admin" && (
                        <Crown className="w-3.5 h-3.5 text-yellow-500" />
                      )}
                      {member.role === "moderator" && (
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted capitalize">{member.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Placeholder for group posts feed */}
        <div className="px-4 sm:px-6 mt-8 pb-8">
          <h2 className="text-sm font-semibold text-muted uppercase mb-4">Group Posts</h2>
          <div className="bg-card-bg border border-card-border rounded-xl p-8 text-center">
            <p className="text-sm text-muted">Group posts will appear here when members post in this group.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
