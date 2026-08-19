import moment from "moment";
import { Internship } from "../types/internship";

export function splitCsv(value?: string): string[] {
    if (!value) return [];
    return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
}

export function formatStipend(internship: Pick<Internship, "internship_type" | "stipend_amount" | "stipend_currency" | "stipend_period">) {
    if (internship.internship_type === "unpaid" || !internship.stipend_amount) {
        return "Unpaid";
    }
    const currency = internship.stipend_currency || "USD";
    const amount = new Intl.NumberFormat("en-US").format(internship.stipend_amount);
    const period =
        internship.stipend_period === "monthly"
            ? "/mo"
            : internship.stipend_period === "weekly"
                ? "/wk"
                : "";
    return `${currency} ${amount}${period}`;
}

export function formatDuration(duration?: number, unit?: string) {
    if (!duration) return null;
    const label = unit === "weeks" ? "week" : "month";
    return `${duration} ${label}${duration > 1 ? "s" : ""}`;
}

export function formatRelativeTime(dateStr?: string) {
    if (!dateStr) return "";
    return moment(dateStr).fromNow();
}

export function formatDeadline(dateStr?: string) {
    if (!dateStr) return null;
    const deadline = moment(dateStr);
    const daysLeft = deadline.diff(moment(), "days");

    if (daysLeft < 0) return { label: "Closed", urgent: false, closed: true };
    if (daysLeft <= 3) return { label: deadline.fromNow(), urgent: true, closed: false };
    return { label: `Closes ${deadline.format("MMM D")}`, urgent: false, closed: false };
}

export function workModeLabel(mode: string) {
    return mode.charAt(0).toUpperCase() + mode.slice(1);
}