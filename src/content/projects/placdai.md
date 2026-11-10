---
title: PlacdAI
year: 2026
period: May 2026 – Present
role: Founder & Developer
status: Live MVP · In development
summary: An AI-powered interior design platform for visualizing changes to a real room and discovering furniture inspired by the result.
tags: React, Vite, Netlify, Google Gemini, Supabase, Google Visual Search
links: Live website|https://placdai.com
order: 2
art: placdai
hero: /projects/placdai/editor.png
heroAlt: PlacdAI editor showing an uploaded room, design style choices, colour palettes, and a generation prompt
heroCaption: PlacdAI's room editor. A user can upload a room photo, choose a style and colour palette, and describe the result they want.
heroWidth: 2048
heroHeight: 1078
---

## Overview

PlacdAI is an AI interior design platform I've been building since May 2026. It started with a simple question: what if you could see how a room might look with different furniture or a new style before making any changes in real life?

You start with a photograph of your own space. From there, you can choose design preferences, describe what you're imagining, and use AI to generate a new version of the room. I've also been exploring furniture editing and ways to find real products that resemble what appears in the generated design.

I built PlacdAI as its founder and developer, and eventually launched a working MVP at [placdai.com](https://placdai.com). It's still a work in progress. Some of the most interesting challenges have turned out to be about making the images useful and keeping the experience simple, rather than just getting AI to produce something attractive.

## The problem

It's easy to find interior design inspiration. It's much harder to picture that inspiration in your own room.

A bedroom on Pinterest might look great, but the dimensions, windows, flooring, and lighting are different from yours. Even if you like a particular bed or desk, it's difficult to know how it would fit with everything else. Traditional design software can help, but I wanted the starting point to be much simpler: a photo and an idea.

There was another problem I kept coming back to. AI can generate furniture that looks convincing without that exact furniture existing in any store. Someone can love a generated room and still have no practical way to recreate it. That pushed me to think about product discovery as part of the experience, not just the image itself.

## How it works

The main design flow is meant to be approachable even if you've never used design software.

1. **Start with a real room.** Upload a photo of the space you want to change.
2. **Choose a direction.** Select a room type, design style, and colour palette, or write a more specific prompt.
3. **Generate a design.** The app uses Google Gemini's image capabilities to produce a redesigned concept based on the photo and your preferences.
4. **Explore further.** The broader editing workflow is intended to let you work with individual furniture ideas and look for visually similar products through Google Visual Search.

```flow
# From a room photo to a design concept
Upload|Photo of your room -> Describe|Style, palette, and prompt -> Generate|AI image editing -> Review|Redesigned room
Review|Redesigned room -> Discover|Visually similar furniture
```

### An example: an empty room becomes a bedroom

Here is an example using an unfurnished room with dark wood floors, light walls, and a window. The goal was a warm, minimal bedroom with natural-looking materials.

![Original empty room before using PlacdAI](/projects/placdai/original-room.png "Before: the original empty room photographed before generating a design.")

![AI-generated bedroom with rattan bed, rug, desk and dresser](/projects/placdai/redesigned-room.png "After: an AI-generated bedroom concept with a bed, rug, desk, and dresser. The original window, walls, and dark flooring remain recognizable.")

The result isn't a construction plan or a guarantee that every piece of furniture is available to buy. It's a visual starting point that makes it easier to explore what a space could become.

## How I built it

PlacdAI began as a prototype built with help from Lovable. That let me explore the core idea quickly. As I continued working on it, I moved the website into a React and Vite development workflow and used Netlify to deploy it.

The interesting part of the application is the connection between a familiar interface and an image-generating model. The user shouldn't need to understand prompts, API requests, or image-processing services to experiment with their room. The app needs to turn their choices into a request, handle the generation process, and display the result in a way that makes sense.

```flow
# Simplified application flow
Browser|React + Vite interface -> App logic|Prepare design request -> Google Gemini|Generate or edit image -> Browser|Show resulting design
Browser|Design to shop for -> Google Visual Search|Explore similar products
```

Google Gemini provides the generative image capability. The interface collects the original photograph and the user's design direction, while Supabase is part of the supporting application stack. I try to keep the user-facing experience straightforward even though several services have to work together behind it.

Deploying the app with Netlify was another step beyond building a prototype. It meant thinking about how the project behaves outside my local environment, including configuration, external services, and whether users can actually access the features I built.

## The difficult part: keeping the original room intact

One of the hardest design goals is *spatial preservation*. If someone wants to try a different sofa, the AI shouldn't decide to move the windows, change the floor, or completely rebuild the room around it.

The same problem appears when trying to add a particular piece of furniture. A person might have a reference image of a chair, bed, or table they like. The editing workflow can provide that image as a reference so the AI has something concrete to work from, rather than relying only on a text description.

The model then does its best to reproduce the furniture's appearance within the original room. That guidance can improve the direction of a result, but it's not a pixel-perfect copy, and it doesn't guarantee exact dimensions or geometry.

The before-and-after bedroom above shows why this matters. The room is still recognizable because the window, basic shape of the walls, and dark flooring are largely preserved, even though the space has been furnished. It's the kind of result I'm aiming for, but consistency across different inputs remains an ongoing challenge.

## From images to real furniture

A generated room is useful for inspiration, but there's a gap between seeing a piece of furniture and finding something similar to purchase.

An early direction for PlacdAI involved showing a small number of purchasable products alongside generated designs. I also explored the possibility of a more complete internal product catalog and additional shopping features.

Over time, I've been moving toward a simpler approach: let the AI help people visualize a room, then use Google Visual Search as a handoff for finding real-world items that look similar.

That has an important trade-off. External search reduces the need to maintain my own furniture listings, but it also means PlacdAI can't promise that a visually similar result is an exact match for a generated item. Products can differ in size, material, price, and availability.

I'd rather make that limitation clear than pretend an AI-generated object is automatically something you can buy.

## Keeping the product focused

One lesson from building PlacdAI has been learning to separate features that sound exciting from features that actually improve the central experience.

It's tempting to turn an interior design app into a complete platform with a furniture catalog, budgets, subscriptions, and lots of separate tools. Those ideas may have value, but they also introduce more complexity before the most important interaction has been proven.

I've been narrowing the focus toward uploading a room, generating a useful redesign, exploring edits, and discovering furniture. That gives me a clearer question to answer: can someone take a photo of a space and quickly get a result that helps them make a design decision?

## Challenges and trade-offs

### Making a realistic image useful

Generative models can produce attractive images while changing things the user never asked to change. A room might look better at first glance but no longer resemble the original photo closely enough to be useful. That makes the reference image and the preservation of surrounding details especially important.

### Working with furniture references

When a user provides a reference photo of a piece of furniture, the model still has to interpret its appearance and fit it into a different scene. The generated result can vary. A reference guides the model; it doesn't give the application exact control over every object in the output.

### Moving beyond an early prototype

Moving from a quick prototype toward a Vite application deployed on Netlify brought the more practical side of development into focus. A feature has to keep working after deployment, and an integration with an external AI service needs to behave well when requests fail or take longer than expected.

I don't think the most useful project stories are the ones where everything worked immediately. PlacdAI has been an ongoing process of figuring out which parts need to be more dependable and which parts don't need to exist yet.

## What I'm learning, and what's next

PlacdAI has changed the way I think about building with AI. Getting a model to generate a compelling image is one thing. Turning that into a product someone can understand, trust, and use for a real decision is much harder.

I'm learning to pay more attention to the experience around the model: what a user can control, what the output can realistically promise, and what happens when the result isn't what they expected.

Next, I want to keep improving the consistency of room edits and the connection between generated furniture and discoverable real products. I also want to learn more from how people actually use the MVP, because that feedback matters more than adding features just because I can.

For now, PlacdAI is both a working product and an ongoing experiment in making generative AI genuinely useful.
