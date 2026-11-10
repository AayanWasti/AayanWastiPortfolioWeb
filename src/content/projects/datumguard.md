---
title: DatumGuard
year: 2026
period: March 2026
role: Developer
status: Prototype
summary: A prototype for understanding where AI training data comes from, detecting sensitive information in samples, tracing dataset relationships, and preparing audit reports.
tags: React, TypeScript, Vite, Supabase Edge Functions, SHA-256, Data lineage
links:
order: 4
art: datumguard
---

## Overview

DatumGuard is a prototype I worked on around a question that has become increasingly important as AI systems are built on more and more data: **how do you know what went into a model, where that data came from, and what risks came with it?**

The application, labelled **DatumControl** in its interface, brings dataset information, privacy-risk indicators, relationships between datasets, and model associations into one place. The aim is to make data provenance easier to inspect instead of leaving it scattered across spreadsheets, storage systems, and disconnected documentation.

This is an early proof of concept, not a production compliance system. The screenshots show a populated demonstration workspace; its example organization, datasets, models, risk scores, and readiness indicator are sample data rather than results from a real company's audit.

![DatumGuard Mission Control dashboard](/projects/datumguard/dashboard.png "Mission Control: a demo overview of datasets, model associations, and risk indicators.")

## The problem

Training an AI model is not just a question of choosing an algorithm. It also means making decisions about the data: where it was collected, whether it can be used, whether it includes personal information, and how it changed before reaching the model.

Those details can be difficult to reconstruct afterward. A team might know which dataset it used, but not immediately know which earlier dataset it came from or what checks were performed on it.

I wanted to explore what a lightweight interface for answering those questions might look like. The initial scope was deliberately practical: register a dataset, inspect a sample for possible personal information, connect datasets and models, and export an audit-style record.

## How it works

DatumGuard has two sides: an interactive sample-scanning flow and a set of dashboard views built around demonstration records.

```flow
# From a dataset sample to a reviewable result
Choose sample|file up to 2 MB -> Fingerprint|SHA-256 in the browser -> Consent|approve sample upload
Consent|approve sample upload -> Scan|Supabase Edge Function -> Verify|server recomputes SHA-256
Verify|server recomputes SHA-256 -> Detect|regex-based PII prototype -> Result|redacted text, findings, risk score
```

**1. Register a dataset.** The form records information such as its name, source reference, licence, tags, and intended visibility. A sample file can be selected for scanning.

**2. Fingerprint the sample.** Before uploading, the browser calculates a SHA-256 digest of the file. The server calculates the digest again and checks it against the client-provided value. This detects a mismatch between the submitted file and its declared fingerprint; it does not, by itself, prove who created the dataset or whether its contents are trustworthy.

**3. Review possible sensitive information.** After the user explicitly consents, the sample is sent to a Supabase Edge Function. The current prototype uses regular expressions to identify patterns such as email addresses, phone numbers, and identification numbers. It returns a redacted excerpt, counts by category, and a simple calculated risk score.

**4. Explore relationships.** Separate screens display dataset connections, models linked to datasets, and downloadable audit-style reports. In the repository version I reviewed, these screens use predefined demonstration records rather than a persistent dataset registry.

## The technical implementation

I built the prototype interface with **React, TypeScript, and Vite**, using Tailwind CSS and shadcn/ui components. React Router separates the dashboard, dataset registration, lineage, model registry, dataset details, and audit/export views.

The implementation uses Supabase for an Edge Function that receives and scans sample data. It also uses the browser's Web Crypto API to generate SHA-256 hashes locally.

```flow
# Prototype architecture
Browser|React + TypeScript -> Registration|metadata and sample form -> Fingerprint|Web Crypto SHA-256
Fingerprint|Web Crypto SHA-256 -> Scan endpoint|Supabase Edge Function -> Scan result|redacted preview + risk score
Demo records|local mock data -> Dashboard|summary cards and scan history
Demo records|local mock data -> Lineage|dataset graph
Demo records|local mock data -> Registry|models and linked datasets
Demo records|local mock data -> Export|PDF and JSON reports
```

The distinction between the scan function and the other screens matters. The scan function performs actual computation on a submitted sample; the populated dashboard, lineage graph, model registry, and report examples are largely driven by local mock data. The current dataset registration flow displays a completion message but does not save a new dataset to a persistent registry.

### Checking a file's fingerprint

One of the more concrete parts of the code is the hash comparison. The browser hashes the file first, and the Edge Function independently hashes the received bytes:

```ts title="supabase/functions/sample-scan/index.ts (abridged)"
const serverHash = await sha256Hex(sampleBytes);

if (clientHash && clientHash !== serverHash) {
  return new Response(
    JSON.stringify({ error: "Hash mismatch — sample may have been tampered with" }),
    { status: 422 }
  );
}
```

This is a useful building block for detecting mismatched data in transit. For a complete provenance system, I would still need trusted identities, stored records, and an auditable history of changes.

### Scanning a sample

The prototype scanner runs in a Supabase Edge Function. It checks for a limited set of text patterns, replaces matches with labels, and calculates a heuristic risk score from the number and types of matches.

Importantly, the function is named like a Presidio scanner in parts of the project, but the actual implementation is currently **a regex-based mock**, not a deployed Microsoft Presidio service or a comprehensive privacy detector. It can miss sensitive information and produce false positives. The score is a prototype indicator, not a verified assessment of compliance or data safety.

The function returns redacted results without intentionally persisting the raw sample. That does not establish production-grade privacy or access controls; authentication, retention, and secure storage would need a separate review.

## Making data relationships visible

One of the ideas I wanted to explore was dataset lineage: showing how one dataset might lead to another through transformations, filtering, or merging.

The Lineage View represents datasets as nodes and transformations as arrows in a directed graph. Each node displays a dataset name, a shortened fingerprint, and a risk score. The current graph uses sample relationships, but the interface demonstrates how a team could begin tracing the path from source data to a derived dataset.

![DatumGuard dataset lineage view](/projects/datumguard/lineage.png "Lineage View: example datasets connected by transformation arrows; relationships shown are demonstration data.")

This was an interesting interface challenge because relationships are easier to understand visually than as a long list of IDs. The next step would be generating the graph from real recorded transformations rather than a fixed set of example edges.

## Connecting datasets to models

Knowing what data exists is useful, but another question matters just as much: **which models rely on it?**

The Model Registry shows models, their versions and metadata, and links to associated datasets. In the demonstration, each linked dataset also carries its risk label, making it possible to spot where a higher-risk source is associated with a model.

![DatumGuard model registry](/projects/datumguard/model-registry.png "Model Registry: demo model records and the datasets associated with them.")

The model entries shown here, including their frameworks and parameter counts, are illustrative records. The current repository does not demonstrate automatic discovery of deployed models or verified connections to real training pipelines.

## Generating an audit-style report

The prototype also includes an Audit & Export screen. A user can choose an example dataset or model and download a PDF or JSON report containing available metadata. For datasets, the report can include a hash, scan summary, redacted sample, and lineage relationships.

I used **jsPDF** for the PDF output, with a separate JSON export for machine-readable records.

This is a useful way to bring the information together, but it is important not to confuse a formatted report with a certified audit. In this prototype, much of the report content is derived from mock records. The displayed “regulatory readiness” percentage is also a simple calculation based on demo risk scores, not an assessment against a specific regulation.

## The challenges and trade-offs

The biggest challenge illustrated by this project is the gap between **displaying trust information** and **proving that the information is trustworthy**.

A dashboard can show a dataset fingerprint, but that doesn't mean the platform has independently verified the dataset's origin. A lineage graph can display transformations, but it becomes valuable only when those transformations are recorded reliably. And a risk score can help prioritize review, but it needs a tested detection process and a clear explanation of its limitations.

The prototype also deliberately mixes a functioning sample-processing flow with mock registry data. That made it possible to explore the product and its interface before building all the supporting infrastructure. The trade-off is that it should be presented as an MVP concept, not as a ready-to-use enterprise governance platform.

## What I learned, and what I'd improve

DatumGuard changed how I think about building AI-related tools. Instead of focusing on what an AI model can generate, this project pushed me toward questions about the data behind it: its origins, its limitations, and how people can inspect it.

It also reinforced a broader engineering lesson: **showing a result is not the same as being able to justify it**. The more serious the use case, the more important it becomes to trace where information came from and what checks actually happened.

If I return to this project, I would focus on four improvements:

1. **Persistent data and audit history.** Replace mock records with a real database, scoped access controls, and append-only event history.
2. **Stronger privacy scanning.** Replace the regex-only prototype with a tested detection service, evaluate false positives and false negatives, and minimize exposure of raw samples.
3. **Real lineage ingestion.** Record datasets and transformations as they happen, rather than drawing relationships from static examples.
4. **Evidence-based reporting.** Distinguish verified evidence from manually entered claims and map any compliance reporting to a specific standard.

For now, DatumGuard is a prototype of the product I wanted to explore: a place where the history and risks of AI data are easier to understand, question, and eventually verify.
