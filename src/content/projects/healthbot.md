---
title: HealthBot
year: 2024–2025
period: 2024–2025
role: Initial builder · AIHealth co-founder · development with the team
status: Launched prototype · AIHealth
summary: I started HealthBot in high school, then worked with the AIHealth team to build and launch it. An assistant for making health information easier to understand became a lesson in streaming responses, image uploads, and making the whole experience dependable.
tags: React, Vite, Node.js, Express, MongoDB, Gemini, Clerk, ImageKit
links: Source code|https://github.com/AayanWasti/Healthbot-official/tree/446a2915ab2ab62a56843f429c59f2da433a2ce9 ; Oakville News|https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011
order: 1
art: healthbot
hero: /projects/healthbot/dashboard-2025.png
heroAlt: Historical HealthBot dashboard showing the conversation list, account control, and message composer.
heroWidth: 2876
heroHeight: 1610
heroCaption: Historical dashboard. Screenshot supplied by Aayan Wasti to [Oakville News](https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011); full image, uncropped.
---

## Overview

I started HealthBot on my own in high school. It became the main product of AIHealth, the healthcare AI startup I co-founded, and eventually a team effort. The goal was straightforward: make health information easier to access and understand through a conversational assistant.

The initial version was something I could build independently. Improving a product that people were actually using was a different kind of work. We had to pay attention to the experience around the model: whether images reached it, whether an answer finished, and whether the conversation was still there when someone returned.

This is the story of that prototype and the parts of its implementation I can trace in the repository. I use a March 12, 2025 code snapshot for the architecture below. The history starts in December 2024 and continues through 2025; later hosting changes are dated separately rather than presented as part of the original launch.

HealthBot was built to help people understand health information. It does not replace professional medical advice. This write-up documents a software prototype; it does not establish clinical validation, diagnostic accuracy, or that every generated answer was verified against medical sources.

## How it started

The problem I wanted to work on was the gap between having a health question and understanding the information available about it. Medical terminology can make a useful explanation difficult to follow. I wanted an interface where someone could ask a question and continue the conversation when something was unclear.

I built the first version before the project grew into a team. As HealthBot developed, we worked together to fix problems and make it more reliable. That distinction matters to this write-up: the initial build was mine, but the later work should not be presented as something I did alone.

In [the March 2025 feature](https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011), the team is credited as: me, co-founder and CEO; Aayan Rahman, CTO; Ivan Jehad, CMO; Brianna Azan, UX/UI designer; and student volunteers.

My contribution began with building the initial version independently. After the team formed, we worked together on improving the platform. The architecture below describes that shared application; it does not assign every component or later fix to me.

## Building HealthBot

### A React interface around the conversation

The frontend is a Vite-built React application. React Router defines the public homepage, sign-in and sign-up screens, a dashboard, and individual conversations at `/dashboard/chats/:id`. Clerk supplies the sign-in components and session state. The dashboard layout checks whether authentication has loaded before redirecting someone who is signed out.

TanStack Query handles loading chat history and refreshing cached data after changes. Responses are displayed with `react-markdown`. These pieces make the interface more than a single prompt box: a conversation can be opened, continued, and found again in the sidebar.

Those details are visible in the [March 2025 client](https://github.com/AayanWasti/Healthbot-official/tree/446a2915ab2ab62a56843f429c59f2da433a2ce9/client/src).

### The model request and the application API are separate

One important detail is easy to miss when describing this as a full-stack AI app: the React client calls Gemini directly. In the March snapshot, `client/src/lib/gemini.js` configures `gemini-1.5-flash`. The Express backend stores conversations and provides upload credentials; it is not the proxy that generates the model’s response.

That split makes the request path clear, but it also puts model configuration in the browser. The code uses a `VITE_` environment variable for the Gemini key. In a rebuild, I would move model access behind the server so provider credentials, request limits, and response handling could be controlled there. I would not describe the browser-based arrangement as a security safeguard.

### Keeping a conversation after the response finishes

The Node.js backend uses Express and Mongoose. There are two MongoDB models: `Chat` holds a user ID and a sequence of user/model messages; `UserChats` holds the sidebar’s chat IDs and titles. Image paths can be attached to individual history entries.

The REST API creates a conversation, lists a user’s conversations, retrieves one, appends a question and answer, and deletes a conversation. Chat routes use Clerk authentication, and reads and updates include the authenticated `userId` in their database filters. That ties stored conversations to the signed-in account.

Keeping the sidebar index separate gives it a smaller representation to load. It also creates two records that must stay consistent. Looking at the schema now, I would test creation and deletion across both models, including what happens if only one write succeeds.

### Streaming an answer, then saving it

`NewPrompt.jsx` starts a model chat from the stored history and receives the next response as a stream. A ref accumulates the text while React state updates what the user sees. Once the stream loop finishes, a mutation sends the accumulated answer to the application API.

This excerpt is from the [March 2025 streaming implementation](https://github.com/AayanWasti/Healthbot-official/blob/446a2915ab2ab62a56843f429c59f2da433a2ce9/client/src/components/newPrompt/NewPrompt.jsx#L102-L110), with comments and blank lines omitted:

```jsx title="NewPrompt.jsx · verified excerpt"
answerRef.current = "";
for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  answerRef.current += chunkText;
  setAnswer(answerRef.current);
}
mutation.mutate();
```

The ref is useful here because the persistence mutation reads the accumulated string, rather than depending on the timing of a React state update. The sequence is also worth being precise about: finishing the stream loop triggers saving; it does not prove that the model produced a complete, medically appropriate answer.

### Two paths for an attached image

An attached image has two jobs in the code. `FileReader` turns it into base64 `inlineData`, including its MIME type, for the Gemini request. Separately, ImageKit uploads the file and returns the path used to display it in the conversation later. The Express `/api/upload` endpoint supplies ImageKit authentication parameters.

Those paths are related, but their results are different. An upload can produce a saved image path without establishing that the model interpreted the image correctly. I would test image selection, file reading, upload authentication, model input, and reloading the conversation as separate steps of the same flow.

## How it works

The user-facing journey in the reviewed code is:

1. Open HealthBot and sign in through Clerk.
2. Write a question on the dashboard. The app creates a conversation and navigates to its chat page.
3. Read the model’s answer as it streams into the interface.
4. Ask a follow-up, optionally attaching an image. The client sends the stored text history and current message to Gemini.
5. Return to a saved conversation through the sidebar. Express retrieves the stored history from MongoDB.

```flow
# Architecture reconstructed from the March 12, 2025 repository snapshot
React client|routing, composer, streaming -> Clerk|sign-in and session
React client|model request and streamed answer -> Gemini API|direct browser call
React client|authenticated chat requests -> Express API|Node.js + Mongoose -> MongoDB|Chat and UserChats
React client|upload authentication -> Express /api/upload|signing parameters -> ImageKit|uploaded image and saved path
```

The diagram separates model generation from persistence. Image bytes also go from the client to Gemini as inline input; storing the file in ImageKit is a different operation.

![Historical HealthBot conversation view showing a user question, generated response, and follow-up composer.](/projects/healthbot/conversation-2025.png "Conversation screenshot supplied by Aayan Wasti to [Oakville News](https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011). Historical generated output, not medical advice.")

These are historical screenshots published with the coverage, not a reconstruction of the interface made for this case study.

## Challenges

### Answers that stopped before they were finished

One of the clearest problems I remember was the AI cutting off its responses. Users complained because they were not getting complete answers. For a healthcare-information assistant, that was especially frustrating, and fixing the experience became a priority for us.

I do not remember the exact technical fix. The available repository does not settle it either: the accumulated-response ref and streaming loop are already present in its earliest commit, from December 2, 2024. A comment mentions a change to a token setting, but the history does not preserve a before-and-after change that I can tie to those complaints. I cannot honestly say that a particular state update, token limit, or streaming change solved them.

What the code does show is how the response is assembled and saved. It catches an error containing `SAFETY` and shows a message, while other stream errors are logged. It does not explicitly inspect a model finish reason before persisting the accumulated text. That is a specific gap I would investigate today: distinguish a normal completion from a limit, interrupted connection, blocked response, or failed save, and make the outcome visible to the user.

### Images and a development URL that escaped into production

The feature reports early text-recognition and image-processing trouble, and credits Rahman with major bug fixes after we met at a hackathon. The repository does not establish a separate OCR service or the exact fix for each reported issue.

There is, however, a concrete image-upload change in [commit `6592545`, dated January 2, 2025](https://github.com/AayanWasti/Healthbot-official/commit/65925456ad03a5d18712ea2fb7aa673284a8d51e). Previously, the ImageKit authenticator always requested `http://localhost:3000/api/upload`. The change chooses `https://healthbot.ca/api/upload` in production and localhost in development. It also adds image-type checking and a file-read error handler.

A localhost URL in a deployed browser points to the visitor’s own machine. That explains why an upload-authentication path that works during local development needs a different address in production. This is a documented fix in the code history; it does not prove it was the cause of every image-processing problem.

### Shipping the whole flow

The March backend serves the built React files from Express and configures allowed frontend origins. Later, an August 2026 change separates the Express app from its listening server and exports it through a Vercel API entry. I keep that later hosting work separate from the 2024–2025 story.

Reading the March code also turns up a case I would test immediately. In `POST /api/chats`, the branch that creates a user’s first sidebar record saves it without sending the success response that the existing-user branch sends. I have not reproduced that in a running deployment; it is a first-use path I would include in an end-to-end check now.

The coverage links user feedback to a more conversational interface, dark mode, and simpler navigation. That fits the broader lesson from the incomplete-answer complaints: user feedback gave us concrete priorities.

## Getting featured in the news

Oakville News featured us on March 27, 2025. I treat that as a record of the project, not clinical validation.

:::press Featured in Oakville News
publication: Oakville News
headline: Local high school students create AI tool to make health information accessible
date: March 27, 2025
author: Ramona Leitao
description: A local profile of our student team, accessibility goals, and early product improvements.
url: https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011
:::

## What I learned

The response-cutoff problem changed how I thought about an AI application. Getting a model to generate an answer was only part of the work. If people could not consistently get a complete, useful response, adding another feature was not the most important next step.

It taught me to take user feedback seriously and prioritize dependability. The upload request, the streamed text, and the saved conversation all belong to the same experience. Today I would test them together, including first-time sign-in, a failed upload, an interrupted stream, and reopening a conversation after refresh.

Reading the model prompt now gives me another concrete improvement to make. It asks for unwarranted certainty and discourages referral to a professional. I did not find a medical-source retrieval or citation-verification pipeline in the reviewed request path. Those limitations need to be stated plainly, even when the intention was dependable health information.

I would also make completion and failure explicit in the interface, move model access behind the backend, and review how user information is retained. For health-related output, I would use language that acknowledges uncertainty, clearly explain the assistant’s limits, and work with qualified medical reviewers before making claims about clinical performance. Those are improvements I would pursue, not safeguards I can claim were already in place.

I started HealthBot independently, but it grew through collaboration. The technical story should give the team credit for that growth and distinguish the parts I can verify from the parts I still need to reconstruct. The result was a launched prototype, with real user feedback and shortcomings worth documenting.

:::placeholder Editorial follow-up — two details still need my input
**The response-cutoff resolution.** I remember the user complaints, but the retained history does not establish which change fixed them. Add the actual fix only if an earlier repository, issue, deployment record, or teammate can confirm it. The account above deliberately makes no claim about its root cause or resolution.

**My responsibilities after the team formed.** My independent initial build is confirmed. Add the specific features or fixes I personally owned during the collaborative phase, with credit to the relevant teammates. Commit authorship alone is not enough to reconstruct that division of work.
:::
