# SUEU Voting System — UI Redesign

## Overview
Full redesign of the SUEU (Student Union) voting system. Modern, clean, professional look using Tailwind CSS via CDN. Replaces existing Bootstrap 3/4, W3.CSS, and AngularJS mess with a unified design system.

## Design Direction
- **Style**: Modern & clean — minimalist, white space, subtle shadows, green brand accent
- **Audience**: Students (voters) + Admin (election officials)
- **Tech**: Plain HTML files, Tailwind CSS via CDN, Font Awesome 6 icons, Inter font

## Design System

### Color Palette
- Brand green: derived from `#28a745` via Tailwind config (`brand-50` through `brand-900`)
- Accent blue: for runner-up results (`blue-500`)
- Neutrals: gray-50 (bg), white (cards), gray-900 (text)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Tailwind default scale

### Icons
- Font Awesome 6 Free (CDN)

### Layout Patterns
- **Student pages**: Centered card layout, max-width containers, clean spacing
- **Admin pages**: Fixed left sidebar (dark green) + top bar + main content area
- **Navbar**: Fixed top on student pages, logo left + title, no links (simple flow)
- **Footer**: Simple centered text on results page only

## Student Pages

### Login (`login.html`)
Centered card, university logo, reg number + password fields, "Login to Vote" button, forgot/register links.

### Register (`register.html`)
Same card pattern. Fields: First name, Last name, Reg number, Faculty (select), Hall (select), Password, Confirm password. "Create Account" button.

### Ballot (`ballot.html`)
Navbar with logo + "SUEU Digital Ballot". Category sections with green header bars. Candidate cards in responsive grid with circular photos. Click-to-select with green border highlight. "Review & Cast Vote" pill button at bottom.

### Confirm (`confirm.html`)
"Step 2: Final Confirmation" in navbar. Green header "Review Your Ballot". Table: position -> chosen candidate. Footer: "Edit Choices" link + "Cast Vote" button. Tailwind-styled confirmation modal with warning about irreversibility.

### Success (`success.html` — new)
Large green checkmark, "Your vote has been recorded", mock receipt number, "View Results" + "Logout" buttons.

### Results (`results.html` — public)
Navbar with logo + animated "Live Results" badge. Green/blue legend. Per-position tables with ranking. Winner rows highlighted green, runner-up blue. Footer with voter turnout stats.

## Admin Pages

All share: dark green sidebar (fixed left), top bar (page title + logout), white card content area.

### Dashboard (`admin/dashboard.html`)
Stats cards: Total Voters, Votes Cast, Active Positions, Turnout %. Recent activity list.

### Contestants (`admin/contestants.html`)
"Add Contestant" button. Table: Photo, Name, Position, Faculty, Actions (Edit/Delete). Modal form for add/edit.

### Voters (`admin/voters.html`)
Search bar + "Add Voter" button. Table: Reg No, Name, Faculty, Hall, Status (Voted/Pending), Actions.

### Results Admin (`admin/results-admin.html`)
Same as public results with additional controls: filter by position, export buttons.

## File Structure
```
voting-interface-UI-master/
├── login.html
├── register.html
├── ballot.html
├── confirm.html
├── success.html
├── results.html
├── admin/
│   ├── dashboard.html
│   ├── contestants.html
│   ├── voters.html
│   └── results-admin.html
├── css/
│   └── style.css          # minimal custom overrides
├── js/
│   └── main.js            # shared utilities (optional)
├── images/
│   ├── logo.png
│   ├── _DSC0497.JPG
│   └── _DSC0909.JPG
└── docs/
    └── superpowers/specs/
```

## Notes
- Legacy files (`contreg.html`, `voiting.html`, `w3sidebar.html`, `home.js`) are replaced/removed
- No build step — pure HTML + CDN Tailwind
- Each page is self-contained with inline `<style>` for Tailwind config and minimal custom CSS
- Responsive: mobile-first, works on phones through desktops
