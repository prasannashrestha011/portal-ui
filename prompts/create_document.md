Redesign the existing `UploadResume` React/Next.js component into a polished, modern document upload interface for a student internship/job portal.

## Design direction

Use a clean, professional **blue + slate** visual system. The interface should feel like a modern SaaS/job platform: minimal, trustworthy, spacious, and polished. Avoid excessive gradients, excessive shadows, glassmorphism, or overly colorful elements.

### Color palette

Primary:

* `blue-600` — `#2563EB`
* `blue-700` — `#1D4ED8`
* `blue-800` — `#1E40AF`
* `blue-50` — `#EFF6FF`
* `blue-100` — `#DBEAFE`

Slate:

* `slate-900` — `#0F172A` — primary headings
* `slate-800` — `#1E293B`
* `slate-700` — `#334155`
* `slate-600` — `#475569` — body text
* `slate-500` — `#64748B` — secondary text
* `slate-400` — `#94A3B8` — muted text
* `slate-200` — `#E2E8F0` — borders
* `slate-100` — `#F1F5F9`
* `slate-50` — `#F8FAFC` — subtle backgrounds
* white — `#FFFFFF`

Semantic:

* Success: `emerald-600` / `emerald-50`
* Error: `red-600` / `red-50`
* Warning: `amber-500` / `amber-50`

Blue should be the main accent. Do not use dark slate as the primary action color.

## Overall layout

Create a single elegant card:

* White background
* `rounded-2xl`
* `border border-slate-200`
* Very subtle shadow
* Comfortable padding
* Clear visual hierarchy
* Header at the top
* Upload area below the header
* Error/status feedback below upload area
* Uploaded documents section at the bottom

The component should look good on both desktop and mobile.

## Header

Create:

**Resumes & Documents**

Subtitle:

"Upload your resume and supporting documents for your internship applications."

On the right side of the header, optionally show a small document icon inside a `blue-50` circular container.

Use a Lucide icon such as:

* `FileText`
* `Files`
* `FileUp`

Do not manually create SVG icons.

Use:

* Heading: `text-slate-900`
* Subtitle: `text-slate-500`
* Icon: `text-blue-600`
* Icon background: `bg-blue-50`

## Upload area

Make the upload dropzone the visual focal point.

Use a large horizontal/rectangular dashed dropzone rather than a tiny generic box.

Default state:

* `border-2 border-dashed border-slate-200`
* `bg-slate-50`
* `rounded-xl`
* Generous vertical padding
* Smooth hover transition

Inside it:

1. A circular icon container:

   * `h-12 w-12`
   * `rounded-full`
   * `bg-blue-50`
   * `text-blue-600`
   * subtle border/ring

2. Use Lucide `CloudUpload` or `FileUp`.

3. Main text:

"Drop your document here, or browse"

Make "browse" blue and semibold.

4. Supporting text:

"PDF, DOC or DOCX · Maximum 5MB"

Make this `text-slate-400`.

5. Add a subtle hover state:

* Border changes to `border-blue-400`
* Background changes to `bg-blue-50/40`
* Icon/text become slightly more prominent

When dragging a file over the area:

* `border-blue-500`
* `bg-blue-50`
* Slightly stronger blue visual treatment
* Do not use an aggressive scale animation

## Uploading state

When uploading:

* Keep the same dropzone dimensions
* Show Lucide `LoaderCircle` with `animate-spin`
* Use `text-blue-600`
* Main text becomes:

"Uploading document..."

* Supporting text:

"Please wait while your document is uploaded."

Disable the dropzone while uploading.

## Error state

Replace the current basic error box with a polished alert:

* `rounded-xl`
* `border border-red-200`
* `bg-red-50`
* `text-red-700`

Use Lucide `CircleAlert`.

Keep the error visually noticeable but not dominant.

## Uploaded documents section

Create a section titled:

"Uploaded Documents"

On the same line, show the document count in a small blue badge.

Example:

`Uploaded Documents   3`

Use:

* Heading: `text-sm font-semibold text-slate-800`
* Count badge: `bg-blue-50 text-blue-700`

Do not use excessive uppercase tracking.

## Document cards

Instead of making the entire document list look like a generic table, create clean individual document rows/cards.

Each document should have:

### Left

A document/file icon inside a soft blue container:

* `h-10 w-10`
* `rounded-lg`
* `bg-blue-50`
* `text-blue-600`

Use Lucide `FileText`.

Show:

* File name
* File size
* Upload date

Example:

`resume-2026.pdf`

`1.8 MB · Uploaded Aug 19, 2026`

File name should be:

`text-sm font-semibold text-slate-800`

Metadata should be:

`text-xs text-slate-400`

Long filenames must truncate correctly.

## Default resume

For the default document, show a small badge:

`Default`

Use:

* `bg-blue-50`
* `text-blue-700`
* subtle blue ring

Do NOT use emerald for the default badge. Blue should remain the primary visual language.

For non-default documents, show:

`Make Default`

Use a secondary button:

* white background
* `border-slate-200`
* `text-slate-700`
* hover: `bg-blue-50`
* hover text: `text-blue-700`
* hover border: `border-blue-200`

## Document actions

Use Lucide icons instead of manually written SVG.

Recommended:

* `FileText`
* `Check`
* `Trash2`
* `ExternalLink` if preview/open functionality exists
* `LoaderCircle` for loading

Delete action:

* subtle default state
* `text-slate-400`
* hover background `bg-red-50`
* hover text `text-red-600`

Do not make the delete button visually dominant.

## Empty state

When there are no documents:

Create a clean centered empty state inside a subtle bordered container.

Use:

* `FileText` or `Files`
* `bg-slate-50`
* `text-slate-400`

Text:

"No documents uploaded yet"

Supporting text:

"Upload your resume to use it for internship applications."

Keep it compact and professional.

## Loading state

Use skeleton loaders instead of plain gray rectangles.

Skeletons should use:

`bg-slate-100`

with subtle rounded corners.

Create 2–3 document skeleton rows matching the actual document layout.

## Interaction details

Add subtle transitions:

* `transition-colors`
* `transition-all`
* `duration-200`

Do not over-animate the interface.

Buttons should have clear hover and disabled states.

Disabled states should use:

`opacity-50 cursor-not-allowed`

## Responsive design

On mobile:

* Stack document information and actions when necessary.
* Ensure long filenames truncate.
* Make the upload dropzone comfortable to tap.
* Keep action buttons accessible.
* Do not allow the document row to overflow horizontally.

## Icons

Use `lucide-react` exclusively for interface icons.

Import icons such as:

```tsx
import {
  CloudUpload,
  FileText,
  Trash2,
  Check,
  CircleAlert,
  LoaderCircle,
  Files,
} from "lucide-react";
```

Do NOT manually define SVG icons.

## Important implementation constraint

This is a UI redesign only.

Do NOT change the existing:

* `studentService.listDocuments()`
* `studentService.uploadDocument()`
* `studentService.setDefaultDocument()`
* `studentService.deleteDocument()`
* upload validation
* drag-and-drop functionality
* document state management
* callbacks
* API behavior
* TypeScript interfaces

Preserve all existing functionality and handlers. Only improve the visual structure, styling, icons, spacing, responsiveness, and interaction states.

The final result should feel like a high-quality production internship portal rather than a generic file uploader.
