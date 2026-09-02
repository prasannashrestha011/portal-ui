"use client";

import { studentService } from "@/src/services/studentProfile";
import { StudentDocument } from "@/src/types/studentProfile";
import React, { useEffect, useState, useRef } from "react";
import {
    CloudUpload,
    FileText,
    Trash2,
    Check,
    CircleAlert,
    LoaderCircle,
} from "lucide-react";

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
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                    <h3 className="workspace-section-title text-slate-900">Resumes & Documents</h3>
                    <p className="workspace-meta mt-0.5 text-slate-500">
                        Upload your resume and supporting documents for your internship applications.
                    </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                </div>
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
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer ${
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40"
                } ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                    {uploading ? (
                        <LoaderCircle className="h-6 w-6 animate-spin text-blue-600" />
                    ) : (
                        <CloudUpload className="h-6 w-6 text-blue-600" />
                    )}
                </div>

                {uploading ? (
                    <>
                        <p className="mt-3 text-sm font-semibold text-slate-900">Uploading document...</p>
                        <p className="mt-0.5 text-xs text-slate-400">Please wait while your document is uploaded.</p>
                    </>
                ) : (
                    <>
                        <p className="mt-3 text-sm text-slate-600">
                            Drop your document here, or <span className="font-semibold text-blue-600">browse</span>
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">PDF, DOC or DOCX · Maximum {maxSizeMB}MB</p>
                    </>
                )}
            </div>

            {/* Error Alert */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 flex items-center gap-2.5 transition-all">
                    <CircleAlert className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Uploaded Documents Section */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h4 className="workspace-section-title text-slate-800">Uploaded Documents</h4>
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {documents.length}
                    </span>
                </div>

                {loading ? (
                    <div className="space-y-2.5 animate-pulse">
                        <div className="h-16 rounded-xl bg-slate-100" />
                        <div className="h-16 rounded-xl bg-slate-100" />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <FileText className="h-5 w-5" />
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-600">No documents uploaded yet</p>
                        <p className="mt-0.5 text-xs text-slate-400">Upload your resume to use it for internship applications.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-xs"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-800 truncate" title={doc.file_name}>
                                                {doc.file_name}
                                            </p>
                                            {doc.is_default && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-200 shrink-0">
                                                    <Check className="h-3 w-3" />
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {formatBytes(doc.size)} · Uploaded {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                </div>

                                {/* Document Actions */}
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                    {!doc.is_default && (
                                        <button
                                            type="button"
                                            disabled={actionId === doc.id}
                                            onClick={() => handleSetDefault(doc.id)}
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionId === doc.id ? (
                                                <span className="flex items-center gap-1.5">
                                                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                                    Updating...
                                                </span>
                                            ) : (
                                                "Make Default"
                                            )}
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        disabled={actionId === doc.id}
                                        onClick={() => handleDelete(doc.id)}
                                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete document"
                                    >
                                        {actionId === doc.id ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin text-slate-400" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
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
