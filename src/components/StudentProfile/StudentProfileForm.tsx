"use client";

import { useEffect } from "react";
import { useStudentProfileStore } from "@/src/context/useStudentProfile";
import { StudentProfileFormContent } from "./FormContent";


export function StudentProfileForm() {
  const { profile, loading, fetchProfile } = useStudentProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) return <FormSkeleton />;

  // Passing key forces React to reset internal form state when profile finishes loading
  return <StudentProfileFormContent key={profile ? "loaded" : "new"} profile={profile} />;
}



function FormSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-8 p-6">
      <div className="space-y-2 border-b pb-5">
        <div className="h-7 w-48 rounded bg-slate-200" />
        <div className="h-4 w-72 rounded bg-slate-100" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-xl border border-slate-200 bg-slate-50 p-6" />
        ))}
      </div>
    </div>
  );
}