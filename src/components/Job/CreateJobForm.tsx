"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Briefcase,
    DollarSign,
    MapPin,
    Calendar,
    GraduationCap,
    FileText,
    Loader2,
    Send,
    Users,
    Mail,
    Link2,
    Gift,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { CreateJobInput, Job, SalaryPeriod } from "@/src/types/job";
import { useCompanyStore } from "@/src/context/useCompanyStore";
import { jobService } from "@/src/services/job";

const jobFormSchema = z
    .object({
        company_id: z.string().uuid("Please select a valid company"),
        title: z.string().min(3, "Job title must be at least 3 characters"),
        description: z.string().min(30, "Description must be at least 30 characters long"),
        location: z.string().min(2, "Location is required"),
        remote: z.boolean(),
        job_type: z.enum(["full_time", "part_time", "internship", "contract"]),
        work_mode: z.enum(["onsite", "remote", "hybrid"]),
        experience_level: z.enum(["entry", "junior", "mid", "senior"]),
        required_skills: z.string().min(2, "Specify required skills (e.g. Go, React, PostgreSQL)"),
        required_education: z.string().optional(),
        experience_required: z.coerce.number().min(0, "Years of experience cannot be negative"),
        salary_min: z.coerce.number().min(0, "Minimum salary cannot be negative"),
        salary_max: z.coerce.number().min(0, "Maximum salary cannot be negative"),
        salary_currency: z.string().default("NPR"),
        salary_period: z.enum(["hourly", "daily", "weekly", "monthly", "yearly"]).default("monthly"),
        vacancy_count: z.coerce.number().min(1, "At least 1 vacancy is required"),
        application_deadline: z.string().optional(),
        application_email: z.string().email("Invalid email address").optional().or(z.literal("")),
        application_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
        benefits: z.string().optional(),
    })
    .refine((data) => data.salary_max >= data.salary_min, {
        message: "Maximum salary must be greater than or equal to minimum salary",
        path: ["salary_max"],
    });

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormProps {
    initialData?: Job;
    companies?: { id: string; name: string }[];
}

const inputClass = "h-11 rounded-md text-black border-slate-300 bg-white px-3 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950";
const selectClass = "h-11 w-full text-black rounded-md border-slate-300 bg-white px-3 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950";
const labelClass = "text-sm font-semibold text-slate-800 dark:text-slate-100";

function FormSection({
    number,
    icon: Icon,
    title,
    description,
    children,
}: {
    number: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900">
            <div className="flex gap-3 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-7">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0a66c2] dark:bg-blue-950/60 dark:text-blue-400">
                    <Icon className="size-5" />
                </span>
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a66c2] dark:text-blue-400">Step {number}</span>
                    <h2 className="mt-0.5 text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </div>
            </div>
            <div className="grid gap-5 p-5 sm:p-7">{children}</div>
        </section>
    );
}

export function JobForm({ initialData }: JobFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { company, fetchMyCompany } = useCompanyStore()



    console.log("Initial company data in JobForm:", company?.name);
    const form = useForm<JobFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(jobFormSchema) as any,
        defaultValues: {
            company_id: initialData?.company_id || company?.id || "",
            title: initialData?.title || "",
            description: initialData?.description || "",
            location: initialData?.location || "Kathmandu, Nepal",
            remote: initialData?.remote || false,
            job_type: initialData?.job_type || "full_time",
            work_mode: initialData?.work_mode || "onsite",
            experience_level: initialData?.experience_level || "entry",
            required_skills: initialData?.required_skills || "",
            required_education: initialData?.required_education || "",
            experience_required: initialData?.experience_required || 0,
            salary_min: initialData?.salary_min || 0,
            salary_max: initialData?.salary_max || 0,
            salary_currency: initialData?.salary_currency || "NPR",
            salary_period: (initialData?.salary_period as SalaryPeriod) || "monthly",
            vacancy_count: initialData?.vacancy_count || 1,
            application_deadline: initialData?.application_deadline
                ? new Date(initialData.application_deadline).toISOString().split("T")[0]
                : "",
            application_email: initialData?.application_email || "",
            application_url: initialData?.application_url || "",
            benefits: initialData?.benefits || "",
        },
    });

    const handleSubmit = async (values: JobFormValues) => {
        try {
            console.log(values)
            setIsSubmitting(true);
            await jobService.createJob(values as CreateJobInput);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!company) {
            fetchMyCompany();
        } else {
            form.setValue("company_id", company.id, { shouldValidate: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company, fetchMyCompany]);

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="min-w-0 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:px-7">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Create your job post</span>
                    <span className="font-medium text-slate-500">4 sections</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5" aria-label="Four form sections">
                    {[1, 2, 3, 4].map((step) => <span key={step} className="h-1.5 rounded-full bg-[#0a66c2]" />)}
                </div>
            </div>

            <FormSection number="1" icon={Briefcase} title="Job details" description="Start with the information candidates see first.">
                <div className="grid gap-5 md:grid-cols-2">

                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2 md:col-span-2">
                                <FieldLabel htmlFor="title" className={labelClass}>Job title <span className="text-red-600">*</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="title"
                                    placeholder="e.g. Senior Go / Backend Engineer"
                                    className={inputClass}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="company_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="company_id" className={labelClass}>
                                    Company <span className="text-red-600">*</span>
                                </FieldLabel>

                                {/* Hidden input to ensure React Hook Form registers the UUID value */}
                                <input type="hidden" {...field} />

                                {/* Visual input showing the human-readable company name */}
                                <Input
                                    id="company_name_display"
                                    className={inputClass}
                                    value={company?.name ?? "Loading company..."}
                                    disabled={true}
                                />

                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="location"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="location" className={labelClass}>Job location <span className="text-red-600">*</span></FieldLabel>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="location" className={`${inputClass} pl-9`} placeholder="e.g. Kathmandu, Nepal" />
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="job_type"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="job_type" className={labelClass}>Employment type</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="job_type" className={selectClass}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full_time">Full Time</SelectItem>
                                        <SelectItem value="part_time">Part Time</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="work_mode"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="work_mode" className={labelClass}>Workplace type</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="work_mode" className={selectClass}>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="onsite">On-Site</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                        <SelectItem value="remote">Remote</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="remote"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between gap-4 rounded-md border border-blue-100 bg-blue-50/60 p-4 md:col-span-2 dark:border-blue-900 dark:bg-blue-950/30">
                                <div className="space-y-0.5">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Open to remote applicants</span>
                                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Show this role to candidates outside the primary location.</p>
                                </div>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label="Open to remote applicants"
                                    className="data-checked:bg-[#0a66c2]"
                                />
                            </div>
                        )}
                    />

                </div>
            </FormSection>

            <FormSection number="2" icon={GraduationCap} title="Skills and experience" description="Help qualified candidates understand if the role is a match.">
                <div className="grid gap-5 md:grid-cols-2">

                    <Controller
                        name="experience_level"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="experience_level" className={labelClass}>Experience level</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="experience_level" className={selectClass}>
                                        <SelectValue placeholder="Target level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="entry">Entry Level</SelectItem>
                                        <SelectItem value="junior">Junior</SelectItem>
                                        <SelectItem value="mid">Mid-Level</SelectItem>
                                        <SelectItem value="senior">Senior</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="experience_required"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="experience_required" className={labelClass}>Minimum years of experience</FieldLabel>
                                <Input {...field} id="experience_required" type="number" min="0" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="required_skills"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="md:col-span-2 space-y-2">
                                <FieldLabel htmlFor="required_skills" className={labelClass}>Required skills <span className="text-red-600">*</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="required_skills"
                                    placeholder="e.g. Go, PostgreSQL, Docker, gRPC, React"
                                    className={inputClass}
                                />
                                <p className="text-xs text-slate-500">Separate skills with commas. Focus on the most important ones.</p>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="required_education"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="md:col-span-2 space-y-2">
                                <FieldLabel htmlFor="required_education" className={labelClass}>Education <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="required_education"
                                    placeholder="e.g. Bachelor's in Computer Science, BCA, or equivalent experience"
                                    className={inputClass}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                </div>
            </FormSection>

            <FormSection number="3" icon={DollarSign} title="Compensation and timeline" description="Set clear expectations about pay, openings, and timing.">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <Controller
                        name="salary_min"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="salary_min" className={labelClass}>Minimum salary</FieldLabel>
                                <Input {...field} id="salary_min" type="number" step="500" min="0" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="salary_max"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="salary_max" className={labelClass}>Maximum salary</FieldLabel>
                                <Input {...field} id="salary_max" type="number" step="500" min="0" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="salary_currency"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="salary_currency" className={labelClass}>Currency</FieldLabel>
                                <Input {...field} id="salary_currency" className={`${inputClass} uppercase`} placeholder="NPR" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="salary_period"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="salary_period" className={labelClass}>Pay frequency</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="salary_period" className={selectClass}>
                                        <SelectValue placeholder="Pay period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="vacancy_count"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="vacancy_count" className={labelClass}>Number of openings</FieldLabel>
                                <div className="relative">
                                    <Users className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="vacancy_count" type="number" min="1" className={`${inputClass} pl-9`} />
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="application_deadline"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="application_deadline" className={labelClass}>Application deadline</FieldLabel>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="application_deadline" type="date" className={`${inputClass} pl-9`} />
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                </div>
            </FormSection>

            <FormSection number="4" icon={FileText} title="Description and application" description="Bring the opportunity to life and tell candidates how to apply.">

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                            <FieldLabel htmlFor="description" className={labelClass}>Job description <span className="text-red-600">*</span></FieldLabel>
                            <Textarea
                                {...field}
                                id="description"
                                rows={8}
                                placeholder="Describe the role, responsibilities, team, and what success looks like..."
                                className="min-h-48 h-48 w-full max-w-2xl resize-y overflow-x-clip overflow-y-auto rounded-md border-slate-300 bg-white text-black p-3 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950"
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="benefits"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                            <FieldLabel htmlFor="benefits" className={labelClass}>Benefits <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                            <div className="relative">
                                <Gift className="absolute left-3 top-3 size-4 text-slate-400" />
                                <Textarea {...field} id="benefits" rows={3} placeholder="Health insurance, flexible hours, learning budget..." className="rounded-md border-slate-300 bg-white text-black py-2.5 pr-3 pl-9 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950" />
                            </div>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="grid gap-5 md:grid-cols-2">
                    <Controller
                        name="application_email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="application_email" className={labelClass}>Application email <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="application_email" type="email" placeholder="careers@company.com" className={`${inputClass} pl-9`} />
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="application_url"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="application_url" className={labelClass}>Application link <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <div className="relative">
                                    <Link2 className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="application_url" type="url" placeholder="https://company.com/careers" className={`${inputClass} pl-9`} />
                                </div>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

            </FormSection>

            <div className="flex flex-col-reverse gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <p className="text-xs leading-5 text-slate-500">Fields marked with <span className="text-red-600">*</span> are required.</p>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-full border-slate-400 px-5 font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 rounded-full bg-[#0a66c2] px-6 font-semibold text-white shadow-none hover:bg-[#004182]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 size-4" />
                                {initialData ? "Update job" : "Publish job"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
