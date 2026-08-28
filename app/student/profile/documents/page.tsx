import { UploadResume } from "@/src/components/StudentProfile/UploadResume";
import Link from "next/link";
import React from "react";
import { ArrowLeft, ChevronRight, FileText } from "lucide-react";

export const metadata = {
  title: "My Documents | Student Portal",
  description: "Manage your resumes and supporting documents for internship applications.",
};

const DocumentsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              <FileText className="h-6 w-6 text-blue-600" />
              Document Management
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload and manage your resumes, cover letters, and certificates to use across internship applications.
            </p>
          </div>

          <Link
            href="/student/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 hover:text-slate-900 transition-all self-start sm:self-auto"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            Back to Profile
          </Link>
        </div>

        {/* Upload Resume / Documents Component */}
        <main>
          <UploadResume />
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;
