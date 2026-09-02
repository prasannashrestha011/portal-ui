For your **internship portal**, I'd use this as the complete blue/slate palette. It keeps the UI professional and avoids making everything excessively blue.

### Core palette

| Purpose         | Tailwind    | Hex       |
| --------------- | ----------- | --------- |
| Primary         | `blue-600`  | `#2563EB` |
| Primary hover   | `blue-700`  | `#1D4ED8` |
| Primary dark    | `blue-800`  | `#1E40AF` |
| Primary light   | `blue-50`   | `#EFF6FF` |
| Primary subtle  | `blue-100`  | `#DBEAFE` |
| Main text       | `slate-900` | `#0F172A` |
| Heading text    | `slate-800` | `#1E293B` |
| Body text       | `slate-600` | `#475569` |
| Muted text      | `slate-500` | `#64748B` |
| Disabled text   | `slate-400` | `#94A3B8` |
| Border          | `slate-200` | `#E2E8F0` |
| Light border    | `slate-100` | `#F1F5F9` |
| Page background | `slate-50`  | `#F8FAFC` |
| Card background | `white`     | `#FFFFFF` |

### Blue accent scale

```text
blue-50   #EFF6FF
blue-100  #DBEAFE
blue-200  #BFDBFE
blue-300  #93C5FD
blue-400  #60A5FA
blue-500  #3B82F6
blue-600  #2563EB  ← primary
blue-700  #1D4ED8  ← hover
blue-800  #1E40AF
blue-900  #1E3A8A
```

### Slate scale

```text
slate-50   #F8FAFC  ← page background
slate-100  #F1F5F9
slate-200  #E2E8F0  ← borders
slate-300  #CBD5E1
slate-400  #94A3B8  ← muted
slate-500  #64748B
slate-600  #475569  ← body text
slate-700  #334155
slate-800  #1E293B  ← headings
slate-900  #0F172A  ← primary text
```

### Semantic colors

I'd keep these **secondary** to the blue identity:

| Purpose    | Tailwind      | Hex       |
| ---------- | ------------- | --------- |
| Success    | `emerald-600` | `#059669` |
| Success bg | `emerald-50`  | `#ECFDF5` |
| Warning    | `amber-500`   | `#F59E0B` |
| Warning bg | `amber-50`    | `#FFFBEB` |
| Error      | `red-600`     | `#DC2626` |
| Error bg   | `red-50`      | `#FEF2F2` |
| Info       | `sky-600`     | `#0284C7` |

### How I'd use it in your portal

**Primary button**

```tsx
bg-blue-600 hover:bg-blue-700 text-white
```

**Secondary button**

```tsx
bg-blue-50 text-blue-700 hover:bg-blue-100
```

**Links**

```tsx
text-blue-600 hover:text-blue-700
```

**Active navigation**

```tsx
bg-blue-50 text-blue-700
```

**Normal text**

```tsx
text-slate-600
```

**Headings**

```tsx
text-slate-900
```

**Cards**

```tsx
bg-white border border-slate-200
```

**Page**

```tsx
bg-slate-50
```

**Input**

```tsx
border-slate-200
focus:border-blue-500 focus:ring-blue-500
```

The important part is **don't use `blue-600` everywhere**. Let white/slate dominate the interface and use blue for actions, navigation state, links, icons, and important emphasis. That will give your internship portal the clean blue style we were aiming for.
