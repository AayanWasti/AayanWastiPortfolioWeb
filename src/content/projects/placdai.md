---
title: PlacdAI
year: 2026
period: May 2026 – Present
role: Founder & Developer
status: In development
summary: AI interior design platform that generates personalized room concepts from user preferences and images. Building a product recommendation system connecting AI-generated designs with real furniture and decor products.
tags: React, TanStack Start, Supabase, Google Gemini, Image editing
links:
order: 2
art: placdai
---

## Overview

PlacdAI is an AI interior design platform. You upload a photo of a room, the app finds the furniture already in it, and you can swap items or add new ones using generative image editing. The long-term goal is to connect those AI-generated designs with real furniture and decor products you could actually buy.

:::note About this page
I couldn't read the PlacdAI code while writing this. The technical details below follow the stack and design rules as you've described them, so check each one against the repository before publishing. Anything I couldn't state is a placeholder.
:::

![PlacdAI editor](/projects/placdai/editor.png "[ADD a screenshot of the editor, ideally a before and after]")

## The problem

:::placeholder Why interior design?
[FILL IN: why this problem, and why now? A sentence or two about what's frustrating about imagining a room, and what you wanted PlacdAI to feel like.]
:::

## How it works

```flow
# From photo to new room
Upload|a photo of a room -> Detect furniture|/api/detect-furniture -> Choose|swap an item or add one
Choose|swap an item or add one -> Generate|/api/swap-product · /api/generate-room -> Gemini image model|edits the room -> Result|the room, redesigned
```

1. **Upload.** Supabase Storage Buckets are part of the stack, so that is where uploaded room images would naturally live. [CONFIRM]
2. **Detect.** A server handler sends it to an AI model that identifies the furniture already in the room.
3. **Edit.** You pick something to swap, or ask for a new piece, and a multimodal Gemini image-editing model produces the updated image.

## Architecture

```flow
# The pieces
Browser|React app, file-based routes -> Server handlers|TanStack Start -> Google Gemini|multimodal image editing
Server handlers|TanStack Start -> Supabase|Postgres + Row Level Security + Storage Buckets
```

- **Frontend and routing:** React with TanStack Start, using file-based routing. The server handlers `/api/generate-room`, `/api/swap-product` and `/api/detect-furniture` live in the same project.
- **Data:** Supabase for PostgreSQL, Row Level Security and Storage Buckets.
- **AI:** Google Gemini, using a multimodal image-editing model for swapping objects while keeping the layout.

:::placeholder Code you'd like to show
[ADD a short snippet from the repository, such as a server handler for /api/swap-product or the RLS policy that protects uploads. I haven't made one up.]
:::

## The rule everything bends around

The design rule at the center of the product is **spatial preservation**: the geometry of the room has to stay intact while an item is edited. Swap a sofa and the walls, windows and floor shouldn't move. It is easy to say and hard to guarantee with a generative model, which is why it's worth a section of its own.

:::placeholder How spatial preservation is enforced
[FILL IN: what do you actually do to keep the room intact? Prompt wording, masks, checks, rejecting results that drift? Describe what you tried and what worked. I haven't guessed.]
:::

## Staying minimal

The product direction is intentionally minimal. PlacdAI is moving away from its own product catalog, paywalled subscription blocks and budget trackers. When you want to find a real item, it hands off to an external visual search (Google Visual Search) instead of maintaining a catalog of its own.

:::placeholder Why that direction
[FILL IN: what made you cut those features, and what did you gain? This is a good place for an honest product decision.]
:::

## Challenges

:::placeholder Challenges and how you approached them
[FILL IN: real problems you've hit, such as consistency of generated images, latency, cost, or detection accuracy, and what you did.]
:::

## What I'm learning, and what's next

:::placeholder Reflections and next steps
[FILL IN: what the build has taught you so far, and what you'll do next. The product recommendation system connecting designs to real products is the most obvious next chapter.]
:::
