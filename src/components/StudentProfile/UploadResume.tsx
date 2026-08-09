"use client";

import { studentService } from "@/src/services/studentProfile";
import { StudentDocument } from "@/src/types/studentProfile";
import React, { useEffect, useState, useRef } from "react";

interface UploadResumeProps {
    maxSizeMB?: number;
    accept?: string;
    onDocumentChange?: () => void;
}

export const UploadResume: React.FC<UploadResumeProps> = ({
    maxSizeMB = 5,
    accept = ".pdf,.doc,.docx",
    onDocumentChange,
}) => {
    const [documents, setDocuments] = useState<StudentDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null); // tracks loading state for individual items
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1. Fetch document list on mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    async function fetchDocuments() {
        setLoading(true);
        setError(null);
        try {
            const res = await studentService.listDocuments();
            if (res.success && res.data) {
                setDocuments(res.data);
            }
        } catch {
            setError("Failed to load documents.");
        } finally {
            setLoading(false);
        }
    }

    // 2. Validate and upload file
    async function handleFileUpload(file: File) {
        setError(null);

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds the ${maxSizeMB}MB limit.`);
            return;
        }

        // Validate type
        const allowedExts = accept.split(",").map((ext) => ext.trim().toLowerCase());
        const fileExt = `.${file.name.split(".").pop()?.toLowerCase()}`;
        if (!allowedExts.includes(fileExt)) {
            setError(`Invalid file type. Allowed formats: ${accept.replace(/,/g, ", ")}.`);
            return;
        }

        setUploading(true);
        try {
            const res = await studentService.uploadDocument(file);
            if (res.success) {
                await fetchDocuments();
                onDocumentChange?.();
            }
        } catch {
            setError("Failed to upload document. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    // 3. Set default document
    async function handleSetDefault(id: string) {
        setActionId(id);
        setError(null);
        try {
            const res = await studentService.setDefaultDocument(id);
            if (res.success) {
                setDocuments((prev) =>
                    prev.map((doc) => ({
                        ...doc,
                        is_default: doc.id === id,
                    }))
                );
                onDocumentChange?.();
            }
        } catch {
            setError("Failed to set default document.");
        } finally {
            setActionId(null);
        }
    }

    // 4. Delete document
    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this document?")) return;

        setActionId(id);
        setError(null);
        try {
            const res = await studentService.deleteDocument(id);
            if (res.success) {
                setDocuments((prev) => prev.filter((doc) => doc.id !== id));
                onDocumentChange?.();
            }
        } catch {
            setError("Failed to delete document.");
        } finally {
            setActionId(null);
        }
    }

    // Drag-and-drop handlers
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-semibold text-slate-900">Resumes & Documents</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                    Upload up to {maxSizeMB}MB in PDF or Word format. Mark one as your default resume for job applications.
                </p>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />

            {/* Upload Dropzone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${isDragging
                    ? "border-slate-900 bg-slate-50 scale-[0.99]"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50"
                    } ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                    {uploading ? (
                        <svg className="h-5 w-5 animate-spin text-slate-700" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    )}
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-900">
                    {uploading ? "Uploading document..." : "Click to upload or drag and drop"}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">PDF, DOC, DOCX up to {maxSizeMB}MB</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Document List */}
            <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Uploaded Resumes ({documents.length})
                </h4>

                {loading ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-16 rounded-xl bg-slate-100" />
                        <div className="h-16 rounded-xl bg-slate-100" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                        No documents uploaded yet.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 transition hover:bg-slate-50/50"
                            >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold uppercase text-white">
                                        {doc.file_name.split(".").pop() || "doc"}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{doc.file_name}</p>
                                            {doc.is_default && (
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {formatBytes(doc.size)} • Uploaded {new Date(doc.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Document Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {!doc.is_default && (
                                        <button
                                            type="button"
                                            disabled={actionId === doc.id}
                                            onClick={() => handleSetDefault(doc.id)}
                                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            {actionId === doc.id ? "Updating..." : "Make Default"}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        disabled={actionId === doc.id}
                                        onClick={() => handleDelete(doc.id)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                                        title="Delete document"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};