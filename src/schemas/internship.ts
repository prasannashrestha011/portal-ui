import { z } from "zod"

export const updateInternshipSchema = z.object({
    title: z
        .string()
        .min(1, "Internship title is required")
        .max(255, "Title must be less than 255 characters"),

    description: z
        .string()
        .min(1, "Description is required"),

    location: z
        .string()
        .max(255, "Location is too long")
        .optional()
        .or(z.literal("")),

    work_mode: z.enum(
        ["onsite", "remote", "hybrid"],
        {
            message: "Please select a work mode",
        }
    ),

    internship_type: z.enum(
        ["paid", "unpaid"],
        {
            message: "Please select an internship type",
        }
    ),

    duration: z.coerce
        .number()
        .int()
        .positive("Duration must be greater than 0"),

    duration_unit: z.enum(
        ["weeks", "months"],
        {
            message: "Please select a duration unit",
        }
    ),

    working_hours: z
        .string()
        .max(100, "Working hours is too long")
        .optional()
        .or(z.literal("")),

    required_skills: z
        .string()
        .optional()
        .or(z.literal("")),

    preferred_skills: z
        .string()
        .optional()
        .or(z.literal("")),

    required_education: z
        .string()
        .max(255, "Education requirement is too long")
        .optional()
        .or(z.literal("")),

    eligible_programs: z
        .string()
        .optional()
        .or(z.literal("")),

    eligible_semester: z
        .string()
        .max(100, "Semester value is too long")
        .optional()
        .or(z.literal("")),

    stipend_amount: z.coerce
        .number()
        .min(0, "Stipend cannot be negative"),

    stipend_currency: z
        .string()
        .min(1, "Currency is required")
        .max(10),

    stipend_period: z.enum(
        ["monthly", "weekly", "fixed"],
        {
            message: "Please select a stipend period",
        }
    ),

    vacancy_count: z.coerce
        .number()
        .int()
        .positive("Vacancy count must be greater than 0"),

    /*
     * Keep these as YYYY-MM-DD inside the form.
     * We convert them to RFC3339 when creating
     * the API payload.
     */
    start_date: z
        .string()
        .optional()
        .or(z.literal("")),

    application_deadline: z
        .string()
        .optional()
        .or(z.literal("")),

    application_email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),

    application_url: z
        .string()
        .url("Invalid application URL")
        .optional()
        .or(z.literal("")),

    responsibilities: z
        .string()
        .optional()
        .or(z.literal("")),

    benefits: z
        .string()
        .optional()
        .or(z.literal("")),
})

export type UpdateInternshipFormValues =
    z.infer<typeof updateInternshipSchema>