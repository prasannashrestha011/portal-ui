"use client";

import React, { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { CreateInternshipInput, Internship, InternshipType, StipendPeriod, WorkMode } from "@/src/types/internship";
import { internshipService } from "@/src/services/internship";
import { useRouter } from "next/navigation";

const internshipFormSchema = z
    .object({
        title: z.string().min(3, "Internship title must be at least 3 characters"),
        description: z.string().min(30, "Description must be at least 30 characters long"),
        location: z.string().min(2, "Location is required"),
        work_mode: z.enum(["onsite", "remote", "hybrid"]),
        internship_type: z.enum(["paid", "unpaid"]),
        duration: z.coerce.number().min(0, "Duration cannot be negative"),
        duration_unit: z.enum(["weeks", "months"]),
        working_hours: z.string().optional(),
        required_skills: z.string().min(2, "Specify required skills (e.g. Go, React, PostgreSQL)"),
        preferred_skills: z.string().optional(),
        required_education: z.string().optional(),
        eligible_programs: z.string().min(2, "Specify eligible programs (e.g. BSc CSIT, BIT, BCA)"),
        eligible_semester: z.string().optional(),
        stipend_amount: z.coerce.number().min(0, "Stipend cannot be negative"),
        stipend_currency: z.string().default("NPR"),
        stipend_period: z.enum(["monthly", "weekly", "fixed"]).default("monthly"),
        vacancy_count: z.coerce.number().min(1, "At least 1 vacancy is required"),
        start_date: z.string().optional(),
        application_deadline: z.string().optional(),
        application_email: z.string().email("Invalid email address").optional().or(z.literal("")),
        application_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
        responsibilities: z.string().optional(),
        benefits: z.string().optional(),
    }).refine((data) => {
        if (!data.start_date || !data.application_deadline) return true;
        return new Date(data.application_deadline) <= new Date(data.start_date);
    }, {
        message: "Application deadline must be on or before the start date",
        path: ["application_deadline"],
    });

type InternshipFormValues = z.infer<typeof internshipFormSchema>;

interface InternshipFormProps {
    initialData?: Internship;
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

export function JobForm({ initialData }: InternshipFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const isSubmittedRef = useRef(false);
    const route = useRouter()



    const form = useForm<InternshipFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(internshipFormSchema) as any,
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            location: initialData?.location || "Kathmandu, Nepal",
            work_mode: initialData?.work_mode || ("onsite" as WorkMode),
            internship_type: initialData?.internship_type || ("paid" as InternshipType),
            duration: initialData?.duration || 0,
            duration_unit: initialData?.duration_unit || "months",
            working_hours: initialData?.working_hours || "",
            required_skills: initialData?.required_skills || "",
            preferred_skills: initialData?.preferred_skills || "",
            required_education: initialData?.required_education || "",
            eligible_programs: initialData?.eligible_programs || "",
            eligible_semester: initialData?.eligible_semester || "",
            stipend_amount: initialData?.stipend_amount || 0,
            stipend_currency: initialData?.stipend_currency || "NPR",
            stipend_period: (initialData?.stipend_period as StipendPeriod) || "monthly",
            vacancy_count: initialData?.vacancy_count || 1,
            start_date: initialData?.start_date
                ? new Date(initialData.start_date).toISOString()
                : "",
            application_deadline: initialData?.application_deadline
                ? new Date(initialData.application_deadline).toISOString()
                : "",
            application_email: initialData?.application_email || "",
            application_url: initialData?.application_url || "",
            responsibilities: initialData?.responsibilities || "",
            benefits: initialData?.benefits || "",
        },
    });

    const handleSubmit = async (values: InternshipFormValues) => {
        try {
            console.log(values)
            setIsSubmitting(true);
            // Format the date picker string into an ISO timestamp for the backend
            const formattedPayload = {
                ...values,
                start_date: values.start_date
                    ? new Date(values.start_date).toISOString()
                    : undefined,
                application_deadline: values.application_deadline
                    ? new Date(values.application_deadline).toISOString()
                    : undefined,
            };
            console.log(formattedPayload)
            await internshipService.createInternship(formattedPayload as CreateInternshipInput);

            // isSubmittedRef.current = true

            route.push("/recruiter/internships/list");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="min-w-0 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:border-slate-800 dark:bg-slate-900 sm:px-7">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">Create your internship post</span>
                    <span className="font-medium text-slate-500">4 sections</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5" aria-label="Four form sections">
                    {[1, 2, 3, 4].map((step) => <span key={step} className="h-1.5 rounded-full bg-[#0a66c2]" />)}
                </div>
            </div>

            <FormSection number="1" icon={Briefcase} title="Internship details" description="Start with the information candidates see first.">
                <div className="grid gap-5 md:grid-cols-2">

                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2 md:col-span-2">
                                <FieldLabel htmlFor="title" className={labelClass}>Internship title <span className="text-red-600">*</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="title"
                                    placeholder="e.g. Backend Engineering Intern"
                                    className={inputClass}
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
                                <FieldLabel htmlFor="location" className={labelClass}>Internship location <span className="text-red-600">*</span></FieldLabel>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="location" className={`${inputClass} pl-9`} placeholder="e.g. Kathmandu, Nepal" />
                                </div>
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
                        name="internship_type"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="internship_type" className={labelClass}>Internship type</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="internship_type" className={selectClass}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="unpaid">Unpaid</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="duration"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="duration" className={labelClass}>Duration</FieldLabel>
                                <Input {...field} id="duration" type="number" min="0" placeholder="e.g. 3" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="duration_unit"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="duration_unit" className={labelClass}>Duration unit</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="duration_unit" className={selectClass}>
                                        <SelectValue placeholder="Select unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="weeks">Weeks</SelectItem>
                                        <SelectItem value="months">Months</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="working_hours"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2 md:col-span-2">
                                <FieldLabel htmlFor="working_hours" className={labelClass}>Working hours <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <Input {...field} id="working_hours" placeholder="e.g. 10:00 AM - 5:00 PM" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                </div>
            </FormSection>

            <FormSection number="2" icon={GraduationCap} title="Skills and eligibility" description="Help qualified students understand if the role is a match.">
                <div className="grid gap-5 md:grid-cols-2">

                    <Controller
                        name="eligible_programs"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="eligible_programs" className={labelClass}>Eligible programs <span className="text-red-600">*</span></FieldLabel>
                                <Input {...field} id="eligible_programs" placeholder="e.g. BSc CSIT, BIT, BCA" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="eligible_semester"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="eligible_semester" className={labelClass}>Eligible semester <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <Input {...field} id="eligible_semester" placeholder="e.g. 5th semester and above" className={inputClass} />
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
                        name="preferred_skills"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="md:col-span-2 space-y-2">
                                <FieldLabel htmlFor="preferred_skills" className={labelClass}>Preferred skills <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <Input
                                    {...field}
                                    id="preferred_skills"
                                    placeholder="e.g. Kubernetes, gRPC, Kafka"
                                    className={inputClass}
                                />
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
                                    placeholder="e.g. Currently pursuing Bachelor's in Computer Science"
                                    className={inputClass}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                </div>
            </FormSection>

            <FormSection number="3" icon={DollarSign} title="Stipend and timeline" description="Set clear expectations about pay, openings, and timing.">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <Controller
                        name="stipend_amount"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="stipend_amount" className={labelClass}>Stipend amount</FieldLabel>
                                <Input {...field} id="stipend_amount" type="number" step="500" min="0" className={inputClass} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="stipend_currency"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="stipend_currency" className={labelClass}>Currency</FieldLabel>
                                <Input {...field} id="stipend_currency" className={`${inputClass} uppercase`} placeholder="NPR" />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="stipend_period"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="stipend_period" className={labelClass}>Pay frequency</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger id="stipend_period" className={selectClass}>
                                        <SelectValue placeholder="Pay period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="fixed">Fixed</SelectItem>
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
                        name="start_date"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="space-y-2">
                                <FieldLabel htmlFor="start_date" className={labelClass}>Start date <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 size-4 text-slate-400" />
                                    <Input {...field} id="start_date" type="date" className={`${inputClass} pl-9`} />
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
                            <FieldLabel htmlFor="description" className={labelClass}>Internship description <span className="text-red-600">*</span></FieldLabel>
                            <Textarea
                                {...field}
                                id="description"
                                rows={8}
                                placeholder="Describe the role, team, and what the intern will learn..."
                                className="min-h-48 h-48 w-full max-w-2xl resize-y overflow-x-clip overflow-y-auto rounded-md border-slate-300 bg-white text-black p-3 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950"
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="responsibilities"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="space-y-2">
                            <FieldLabel htmlFor="responsibilities" className={labelClass}>Responsibilities <span className="font-normal text-slate-400">(optional)</span></FieldLabel>
                            <Textarea
                                {...field}
                                id="responsibilities"
                                rows={4}
                                placeholder="Key day-to-day tasks and responsibilities..."
                                className="rounded-md border-slate-300 bg-white text-black p-3 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950"
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
                                <Textarea {...field} id="benefits" rows={3} placeholder="Certificate, mentorship, letter of recommendation..." className="rounded-md border-slate-300 bg-white text-black py-2.5 pr-3 pl-9 shadow-none focus-visible:border-[#0a66c2] focus-visible:ring-[#0a66c2]/20 dark:border-slate-700 dark:bg-slate-950" />
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
                                {initialData ? "Update internship" : "Publish internship"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}