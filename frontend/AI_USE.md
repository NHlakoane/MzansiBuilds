# How I Used AI to Build MzansiBuilds

## Honest Truth
Yes, I used AI (Claude and ChatGPT) to help build this project. But let me be clear - I didn't just copy-paste. I have a BSc in Computer Science, I understand the code, and I made all the important decisions myself.

## What I Used AI For

### 1. **Boilerplate Code** (40% of code)
- Initial React component structures
- Express route skeletons
- Basic form handling
- Why? Because typing the same thing over and over is boring. I know how to write it, but AI saved me time.

### 2. **Debugging Help** (30% of my AI usage)
- That annoying "Failed to resolve import" error? AI helped me figure out it was a path issue (`../` vs `../../`)
- The Celebration Wall not showing completed projects? AI helped me trace it to the database column mismatch
- CORS errors? AI pointed me to the middleware order problem

### 3. **Learning PostgreSQL** (20% of AI usage)
- I know MySQL, but PostgreSQL was new. AI helped me understand the syntax differences
- Foreign key constraints, JOIN queries - I learned as I built

### 4. **Testing** (10% of AI usage)
- Generated test skeletons
- Helped me understand why tests were failing (port already in use, foreign key errors)

## What I Did MYSELF (No AI)

### Architecture Decisions
- **Stack choice**: React + Node + PostgreSQL (not MongoDB even though AI suggested it)
- **Folder structure**: Organized it my way
- **Authentication flow**: JWT with localStorage (my decision)

### Problem Solving
- Fixed the import path error after AI gave me the hint
- Designed the database schema (tables, relationships)
- Made the green/black theme look good (AI gave me basic colors, I made it elegant)

### Code I Wrote 100% Myself
- The Celebration Wall filtering logic
- Dashboard project management UI
- Navbar conditional rendering
- Form validation and error handling

## What I UNDERSTAND (Even if AI helped write it)

| Code | I understand it? | Could I rewrite it? |
|------|-----------------|---------------------|
| AuthContext.jsx | ✅ Yes | ✅ Yes |
| useAuth hook | ✅ Yes | ✅ Yes |
| Project CRUD | ✅ Yes | ✅ Yes |
| Database queries | ✅ Yes | ✅ Yes (learned PG for this) |
| Test files | 🤔 Most of it | 🟡 Would need documentation |

## Time Breakdown

- **Planning & design**: 4 hours (me alone)
- **Coding with AI help**: 12 hours
- **Debugging**: 6 hours (AI helped with 3 of those)
- **Testing & fixing**: 4 hours

## Why I Chose to Use AI

1. **Time constraint**: This is a code challenge with a deadline, not a production app
2. **Learning tool**: I wanted to see how AI handles full-stack development
3. **Efficiency**: Why spend 2 hours writing boilerplate when I can spend 20 minutes reviewing AI-generated code?

## Would I Use AI Like This at Derivco?

**No.** For a real job, I would:
- Write my own code for production systems
- Use AI only as a "smarter autocomplete"
- Never copy-paste without fully understanding
- Follow the company's AI policy

But for a code challenge? AI is a tool, and I used it strategically.

## Final Thought

I'm a software engineer with a degree. AI didn't build this - I did. AI was my assistant, not my replacement.

**Ask me about any part of this codebase, and I'll explain it.**

---

*Neoh*
*BSc Computer Science Graduate*
*April 2026*