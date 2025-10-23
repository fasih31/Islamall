# Design Guidelines: Islamic Compass Portal

## Design Approach

**Selected Approach**: Reference-Based with Islamic Cultural Foundation

Drawing inspiration from established Islamic digital platforms (Quran.com, IslamicFinder, MuslimPro) while incorporating modern web design principles. The design emphasizes authenticity, spiritual calmness, and functional clarity suitable for both devotional and practical use.

**Core Principles**:
- Reverent simplicity that honors sacred content
- Hierarchical clarity for diverse content types
- Bilingual excellence (Arabic RTL + English LTR)
- Timeless visual language avoiding trendy flourishes

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- **Primary Brand**: 158 65% 25% (Deep teal-green, evoking Islamic architecture)
- **Primary Accent**: 158 55% 35% (Lighter teal for interactive elements)
- **Background Base**: 220 15% 8% (Soft near-black)
- **Background Elevated**: 220 12% 12% (Cards, modals)
- **Text Primary**: 0 0% 95% (Warm white)
- **Text Secondary**: 0 0% 70% (Muted for supporting text)
- **Arabic/Quranic Text**: 45 30% 90% (Slightly warm off-white for reverence)
- **Success/Verified**: 142 65% 45% (Scholar verification badges)
- **Warning**: 30 85% 55% (Prayer time alerts)

**Light Mode**:
- **Primary Brand**: 158 60% 40%
- **Background Base**: 45 25% 98% (Warm paper-like)
- **Background Elevated**: 0 0% 100%
- **Text Primary**: 220 15% 15%
- **Text Secondary**: 220 10% 45%
- **Arabic/Quranic Text**: 220 20% 10%

### B. Typography

**Font Families**:
- **Arabic/Quranic**: 'Amiri' or 'Scheherazade New' from Google Fonts (traditional, highly readable for Quranic text)
- **English Primary**: 'Inter' (clean, modern, excellent readability)
- **English Display**: 'Playfair Display' for hero headings (elegant, authoritative)

**Type Scale**:
- Display/Hero: text-5xl to text-7xl (Playfair Display, font-semibold)
- Section Headers: text-3xl to text-4xl (Inter, font-bold)
- Quranic Verses: text-2xl to text-3xl (Amiri, leading-loose for breathing room)
- Body Text: text-base to text-lg (Inter, leading-relaxed)
- Metadata/Captions: text-sm (Inter, text-secondary)

**Arabic Typography Rules**:
- Minimum 1.8 line-height for Arabic script
- Right-to-left flow with proper Unicode bidi support
- Larger font sizes for Quranic text (minimum text-xl on mobile)

### C. Layout System

**Spacing Primitives**: Using Tailwind units of **4, 6, 8, 12, 16, 20, 24** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Container gaps: gap-6 to gap-12
- Card spacing: p-6 with gap-4 for content

**Grid Systems**:
- Content containers: max-w-7xl for main layouts
- Reading containers: max-w-4xl for Quran/Hadith (optimal reading width)
- Cards/Features: Grid with grid-cols-1 md:grid-cols-2 lg:grid-cols-3

### D. Component Library

**Navigation**:
- Sticky header with transparent-to-solid transition on scroll
- Mega menu for major sections (Quran, Hadith, Finance, Community)
- Prayer time indicator in header (live countdown to next prayer)
- Language/theme toggle (Arabic/English, Dark/Light)

**Hero Section**:
- Full-width with subtle Islamic geometric pattern overlay (SVG)
- Large centered heading with verse of the day in Arabic + translation
- Primary CTA for "Start Reading Quran" and secondary for "Explore Hadith"
- Background: Subtle gradient from primary to darker shade

**Quran Reader Components**:
- Verse cards with elevated background, generous padding (p-8)
- Arabic text prominent (text-3xl), translation below (text-lg, text-secondary)
- Inline tafsir expansion with animated accordion
- Verse actions toolbar: bookmark, share, copy, play audio (icon-only, tooltip on hover)

**Data Display Cards**:
- Prayer Times: Grid of 5 cards showing each prayer with countdown
- Finance Calculator: Step-by-step form with real-time calculation display
- Hadith Results: List view with book badge, authenticity grade chip, and excerpt

**Forms**:
- Input fields with border-2 on focus, transition-colors
- Labels with text-sm font-semibold above inputs
- Helper text in text-secondary below inputs
- Submit buttons: Primary brand color with w-full on mobile, w-auto on desktop

**Community Features**:
- User avatars with verified scholar badge overlay (green checkmark)
- Forum posts in card format with engagement metrics
- Event cards with date badge, location pin, and RSVP button

**Interactive Elements**:
- Bookmark icon fills with animation when saved
- Audio player with waveform visualization for Quran recitation
- Search with instant results dropdown (debounced)

### E. Animations

**Minimal, Purposeful Motion**:
- Fade-in on scroll for section reveals (0.3s ease-out)
- Smooth page transitions between Quran verses (slide effect)
- Prayer time countdown with subtle pulse on upcoming prayer
- Bookmark heart animation (scale + fill)
- No parallax, no decorative animations

---

## Page-Specific Layouts

### Homepage
- **Hero**: Full-width with Islamic pattern overlay, verse of the day, dual CTAs
- **Quick Access**: 4-column grid (Quran, Hadith, Prayer Times, Finance) with icon cards
- **Featured Content**: 2-column layout - Recent Hadith + Islamic Events
- **Statistics**: 3-column centered display (Verses, Hadiths, Users) with count-up animation
- **Community Highlights**: Carousel of verified scholar posts
- **Footer**: 4-column layout (About, Resources, Community, Contact) with newsletter signup

### Quran Module
- **Surah List**: Sidebar with fixed position, scrollable list
- **Reading View**: Center-aligned verses with max-w-4xl, surah header with revelation context
- **Verse Interactions**: Floating action bar on verse hover (bookmark, share, tafsir)
- **Audio Player**: Sticky bottom bar with play/pause, speed control, autoplay toggle

### Hadith Module  
- **Search Interface**: Prominent search bar with filters (book, authenticity, keyword)
- **Results Grid**: 2-column on desktop, single on mobile
- **Hadith Detail**: Full-width card with isnad chain, translation, and scholar commentary in tabs

### Finance Section
- **Calculator Interface**: Left sidebar for inputs, right panel for results with visual breakdown
- **Articles Grid**: 3-column masonry layout with featured article hero
- **Fatwa Database**: Searchable list with category filters and scholar avatars

### Community/Events
- **Map View**: Interactive map with mosque pins, event markers
- **Event Cards**: Timeline layout with date ribbon, location, and organizer info
- **Forum**: Reddit-style threaded discussions with upvote/reply actions

---

## Images

**Hero Section**: Use authentic, high-quality imagery
- Image 1 (Homepage Hero): Overhead view of open Quran with soft natural lighting, blurred background of mosque interior - conveys peace and study
- Image 2 (Quran Module): Close-up of Arabic calligraphy from Quran manuscript - artistic and reverent
- Image 3 (Community Section): Diverse group of Muslims in prayer/study circle - emphasizes brotherhood
- Image 4 (Finance Section): Modern Islamic architecture with geometric patterns - connects tradition with contemporary life

**Content Imagery**:
- Scholar profile photos with circular crop, subtle border
- Event location photos as card backgrounds with gradient overlay for text legibility
- Mosque photos for community finder with location badge overlay

**Image Treatment**:
- All images with rounded-xl borders (border-radius: 12px)
- Overlay gradient from transparent to background-base/50 for text readability
- Lazy loading with blur-up placeholder effect

---

## Accessibility & RTL Support

**Bidirectional Layout**:
- Full RTL support with dir="rtl" switching
- Mirrored layouts for Arabic interface (navigation, cards, grids)
- Dedicated Arabic font loading and sizing

**Dark Mode**:
- System preference detection with manual override
- Smooth theme transitions (0.2s)
- High contrast ratios maintained (WCAG AAA for body text)

**Keyboard Navigation**:
- Focus indicators with 2px primary brand ring
- Skip links for Quran verse navigation
- Modal traps with escape key closing

---

## Responsive Breakpoints

- Mobile: < 768px (Single column, stacked navigation)
- Tablet: 768px - 1024px (2-column grids, collapsed sidebar)
- Desktop: > 1024px (Full multi-column layouts, persistent sidebars)

**Mobile Priorities**:
- Prayer times accessible in 1 tap from header
- Quran reader optimized for one-handed reading
- Bottom navigation bar for core modules (Quran, Hadith, Prayer, Profile)