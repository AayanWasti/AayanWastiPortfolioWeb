---
title: CareNest
year: 2024
period: Dec 2024 · Hack The Ridge 2024
role: Member, four-person hackathon team
status: Hackathon prototype
summary: An eight-hour hackathon project exploring newborn temperature monitoring with Arduino hardware and an AI-assisted caregiver dashboard.
tags: Arduino GIGA, C++, React, TypeScript, Vite, Chart.js, Figma, AI integration
links: Devpost|https://devpost.com/software/carenest-q1d4si ; Dashboard code|https://github.com/aayanrahman/Hack-The-Ridge-2024 ; Arduino code|https://github.com/aayanrahman/Arduino-Code
order: 3
art: carenest
---

## Overview

In December 2024, I worked with three other students to build CareNest at Hack The Ridge. We had roughly eight hours to turn an idea into something we could demonstrate. We chose to explore a problem that felt bigger than a typical hackathon project: making basic newborn monitoring more accessible in settings where equipment and specialist support may be limited.

Our prototype had two parts. An Arduino-based device measured temperature and displayed readings locally. A separate web dashboard let someone enter measurements, view a simple chart, and request AI-generated explanations. The idea was to explore what an inexpensive monitoring setup and a more understandable interface might look like together.

We got both parts into a demonstrable state within the hackathon. That was exciting, but looking back, the gaps between a working demo and a dependable healthcare system are just as interesting as what we built.

:::limit An experimental prototype, not a medical device
CareNest was a student hackathon project. The sensor readings, alerts, and AI-generated content were not clinically validated and should not be used to make healthcare decisions. The AI output was a demonstration of an interface, not a reliable diagnosis or treatment recommendation.
:::

![CareNest's original home screen](/projects/carenest/home.png "The original CareNest interface shown in our hackathon submission. The form collects information for the dashboard.")

## Why we built it

We started with a question: what could a small team build to make basic monitoring information easier to see and understand?

Our Devpost submission focused on the difficulty of accessing neonatal care in resource-limited settings. We weren't going to solve that in eight hours. Instead, we narrowed the idea to two experiments: could a sensor continuously display temperature with a visible alert, and could a simple website organize measurements into something easier to review?

That scope gave us a mix of physical computing, frontend development, and AI integration. It also forced us to work on several different parts of the system at once.

## Two parts of one idea

```flow
# The prototype's two paths
Temperature sensor|thermistor -> Arduino GIGA|reads and processes values -> Local display|temperature and alert
Caregiver|enters measurements -> React dashboard|visualization and entries -> AI service|generates explanatory text -> Result|shown in the interface
```

It's important to be precise about what this diagram represents. The Arduino device and the web dashboard were separate pieces in the code available from the project. The dashboard accepted typed-in measurements; the repositories do not demonstrate an automatic, live connection from the sensor to the browser.

That missing connection is one of the first things I'd address in a future iteration.

## Building the temperature monitor

The hardware used an Arduino GIGA, a thermistor, a display, and a buzzer. The firmware read a changing electrical signal from the sensor, converted it to an estimated temperature, and showed a reading in Celsius and Fahrenheit.

When the estimated reading exceeded the threshold defined in our prototype code, the display showed an alert and activated the buzzer. It was a way to demonstrate a visible and audible warning, not a clinically validated alarm.

![CareNest's Arduino temperature monitor](/projects/carenest/hardware.png "The Arduino GIGA and temperature-sensing setup photographed during the hackathon.")

Getting the physical display to update consistently was one of the hardware challenges our team described in the Devpost submission. Unlike a regular web interface, this involved working with an actual sensor, screen updates, and embedded code while the clock was running.

### Looking back at the firmware

Revisiting the source code reveals a useful lesson about testing. The temperature-averaging logic used integer accumulators, even though the readings were floating-point values. It also duplicated part of the accumulation block.

```cpp title="code.cpp (excerpt)"
int totalTempC = 0;

// Inside the sampling loop:
totalTempC += temperatureC;
seconds++;

// The source repeats this accumulation block.
```

This can discard fractional information and make the averaging interval different from what its label suggests. The original sensor-conversion constants also need independent calibration before anyone could trust the measurements.

These are limitations visible in the source, not fixes I'm claiming we made during the hackathon. They're a good reminder that a sensor showing a number isn't the same as a measurement system whose accuracy has been established.

## Designing the dashboard

The software side was built with React, TypeScript, and Vite, with Figma used for the interface design. We wanted a simple place to enter readings and see them presented clearly, rather than a screen full of complicated controls.

The dashboard accepted information such as temperature, weight, and age, and the project used Chart.js to visualize entries. It also displayed generated text alongside those entries.

![CareNest analytics screen](/projects/carenest/analytics.png "An early analytics screen from the hackathon submission, showing the graph and selection controls.")

![CareNest history screen](/projects/carenest/history.png "A history-page design from the hackathon submission.")

The screenshots show the Home, Analytics, and History views we presented. The web source snapshot described in the original project notes uses a simpler route structure, so the screenshots and available code may represent different points during development. I wouldn't describe every pictured element as a fully implemented, persistent feature.

One implementation choice I like is the idea of showing a new entry immediately while the application waits for the AI response, then updating that entry when the answer arrives. That keeps the interface from feeling frozen during an external API call. It's a small UX detail, but one that matters whenever a model takes time to respond.

## Adding AI to the experience

The AI portion was an experiment in turning a few form values into more readable text. The dashboard sent measurements to a language model and displayed a generated response with its entry.

Our Devpost submission names OpenAI, while a later repository snapshot referenced in the original project documentation uses Google's Gemini. I can't establish which provider powered the exact demo from those sources alone, so I think it's more accurate to describe this as an LLM integration rather than claim one specific model throughout the project's history.

There is also a more important limitation: formatting a model response into something that *looks* like clinical guidance doesn't make it medically reliable. A model can be confidently wrong, and a prompt alone cannot guarantee safe output. If this were ever explored beyond a hackathon, it would need clinical oversight, properly validated measurements, careful privacy controls, and strict limits on what the software claims to do.

For me, that distinction is part of the engineering story, not something to hide in fine print.

## What was challenging

The eight-hour deadline made prioritization a real part of the project. We had to get a physical prototype, a website, and an AI interaction working well enough to demonstrate, all while coordinating as a four-person team.

The challenges we documented at the time included getting temperature readings to update on the Arduino display, translating a Figma design into functional frontend code, and integrating the AI API into the dashboard.

The interesting trade-off is that we were building a concept rather than a polished end-to-end system. It was possible to show the hardware and software sides separately without having the time to connect them fully. That helped us demonstrate the idea, but it also defined the prototype's limitations.

I think it's worth showing that honestly. Hackathons are useful partly because they teach you how to choose what can realistically be built in a very short period.

## What I took away

CareNest was an opportunity to work on a project that stretched across hardware, software, and AI instead of staying entirely in one area.

The biggest lesson I take from looking back at it is the difference between a convincing demonstration and a dependable system. A user interface can look complete while important details like sensor calibration, stored history, and reliable communication between components are still unfinished.

I also appreciate how much coordination matters when the team is moving quickly. Everyone can be productive on their own piece, but those pieces only become a complete product if they fit together.

I don't want to overstate my individual contribution here: CareNest was a four-person build, and the public submission doesn't identify who implemented each component. The project is something I contributed to as part of the team, rather than a product I built alone.

## If we revisited CareNest

With more time, I would focus less on adding new features and more on making the existing concept testable and dependable.

First, the sensor and dashboard would need a documented data connection so measurements appear in the interface without being re-entered. Next, the firmware's averaging logic would need to be corrected, and the sensor would need to be calibrated against appropriate reference equipment.

The dashboard would also need reliable storage for historical readings, along with clear states for missing or failed data. Finally, any health-related interpretation would require expert review and carefully defined boundaries; an AI model should not be positioned as a substitute for qualified care.

Our original Devpost mentioned ideas such as solar power, better historical tracking, and predictive features. Those might be interesting later, but I would address the reliability and safety foundations first.

CareNest wasn't a finished healthcare product. It was an ambitious eight-hour experiment that taught us how much there is to consider when hardware, interfaces, and AI meet in one idea.

You can see the original submission on [Devpost](https://devpost.com/software/carenest-q1d4si) and explore the [dashboard](https://github.com/aayanrahman/Hack-The-Ridge-2024) and [Arduino](https://github.com/aayanrahman/Arduino-Code) repositories.
