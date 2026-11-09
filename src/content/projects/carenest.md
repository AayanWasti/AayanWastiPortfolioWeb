---
title: CareNest
year: 2024
period: Dec 2024 · Hack The Ridge 2024
role: Hackathon team of four · [YOUR ROLE: say which parts you built]
status: Prototype · hackathon project
summary: An eight-hour hackathon prototype that pairs an Arduino temperature monitor with a React dashboard that asks an AI model for neonatal care insights.
tags: Arduino GIGA, C++, React, TypeScript, Vite, Chart.js, Figma, LLM API
links: Devpost|https://devpost.com/software/carenest-q1d4si ; Dashboard code|https://github.com/aayanrahman/Hack-The-Ridge-2024 ; Arduino code|https://github.com/aayanrahman/Arduino-Code
order: 3
art: carenest
---

## Overview

CareNest was built in about eight hours at Hack The Ridge 2024 by a team of four. The pitch on Devpost is an affordable baby-warmer monitor: it tracks an infant's temperature in real time, and a companion dashboard turns a few numbers about the baby into AI-generated insights for caregivers in places where specialist help is thin.

What makes it interesting to look back on is that it is really two small programs that share a theme, not one tightly integrated system. This write-up walks through both halves, what the code actually does, and what I would fix first.

:::limit A prototype, not a medical device
CareNest is a hackathon prototype. It has not been clinically validated, the AI output is not medical advice, and nothing on this page should be used to make decisions about a baby's care.
:::

![The CareNest home page](/projects/carenest/home.png "The home page, as shown in the Devpost submission.")

## The problem

The team's starting point, per the Devpost, was the lack of affordable, accessible neonatal support in low-resource settings, and a wish to give both parents and healthcare providers something useful. That is a large problem, so the prototype narrows it to two modest questions:

- Can a cheap sensor setup show a baby's temperature continuously and make noise when it drifts too high?
- Can a caregiver type in a few measurements and get a structured second opinion quickly?

Neither question is answered clinically here. They are engineering questions about what can be wired up in a day.

## How it works

```flow
# The two halves of the prototype
Thermistor|analog pin A0 -> Arduino GIGA|reads once per second -> Display + buzzer|°C and °F, alert above 37.5 °C
Caregiver|types temperature, weight, age -> React dashboard|Chart.js trend + entry cards -> LLM API|structured prompt -> Diagnosis + recommendations|shown per entry
```

The top row lives on the Arduino GIGA with its display. The bottom row is a Vite + React + TypeScript single-page app. Between them there is, as far as the repositories show, a person typing a number. I come back to that below.

## The hardware

The Devpost lists an Elegoo starter kit and an Arduino GIGA. In the firmware, a thermistor is read on pin `A0`, a buzzer sits on pin 8, and the GIGA's display shows the current temperature in Celsius and Fahrenheit. When the reading passes 37.5 °C (99.5 °F) the screen turns red and the buzzer sounds.

![The temperature sensor hardware](/projects/carenest/hardware.png "The hardware: the temperature sensor.")

The core of the sketch, abridged:

```cpp title="hardware/code.cpp (abridged)"
int analogValue = analogRead(thermistorPin);
float temperatureC = BETA / (log((1025.0 * 10 / analogValue - 10) / 10) + BETA / 298.0) - 300.0;
float temperatureF = 1.8 * temperatureC + 32.0;

// ...draw the readings on the display...

if (temperatureC > 37.5 || temperatureF > 99.5) {
  display.setTextColor(RED, BG_COLOR);
  display.print("ALERT: High Temp!");
  digitalWrite(buzzPin, HIGH);
} else {
  digitalWrite(buzzPin, LOW);
}
delay(1000);
```

The conversion is the beta-parameter model for a thermistor, with `BETA` set to 3950. The constants in the formula (`1025`, `298`, `300`) are not the textbook values, and nothing in the repository says how they were chosen or whether the readings were checked against a reference thermometer.

:::placeholder How the sensor was calibrated
[FILL IN: was the output compared with a known thermometer? What accuracy did you see? A prototype that measures a baby's temperature should say this plainly.]
:::

### Reading the firmware back

Two details in the averaging code stand out. This comes from reading the code, not from running it.

```cpp title="hardware/code.cpp (abridged)"
int totalTempC = 0;                 // global accumulator is an int

totalTempC += temperatureC;         // float added to an int: the fraction is dropped each time
// ...the same two lines appear twice in loop(), so seconds climbs by 2 per pass...

if (seconds >= 60) {
  float avgTempCMin = totalTempC / 60;   // int / int: integer division
```

Because the accumulator is an `int`, every addition truncates the decimal part, so the running total drifts low. The final division is also integer division, so the "average" is a whole number. The duplicated block means the one-minute window closes after about 30 seconds. The instantaneous reading and the alert use the unrounded float, so the alert itself is not affected. The averages on screen are.

## The dashboard

The web app is React 18 with Vite and TypeScript, two routes (`/home` and `/dashboard`) and Chart.js for the line chart. A form takes temperature (°C), weight (lb) and age (weeks). Each submission becomes an entry: it is plotted on the chart and gets a card with a diagnosis and a set of recommendations.

![The analytics page](/projects/carenest/analytics.png "The analytics page.")

![The history page](/projects/carenest/history.png "The history page, showing past analytics.")

:::note Screenshots vs. the repository
The submission screenshots show Home, Analytics and History pages. The repository snapshot I read has just `/home` and `/dashboard`. The screenshots may come from a later or different version of the app. [CONFIRM]
:::

The nicest piece of the code is how it keeps the UI responsive while waiting for the model. The entry is added immediately with placeholder text, then patched when the response arrives:

```tsx title="src/Components/Dashboard.tsx (abridged)"
const addData = async (newData: Data) => {
  setData(prev => [...prev, {
    ...newData,
    advice: "Fetching diagnosis...",
    recommendations: "Fetching recommendations...",
  }]);

  try {
    const result = await getGeminiResponse({
      temperature: newData.temperature, weight: newData.weight, age: newData.age,
    });
    setData(prev => prev.map(e => e.id === newData.id
      ? { ...e, advice: result.diagnosis, recommendations: result.reasoning }
      : e));
  } catch {
    // mark the entry as failed instead of leaving it on "Fetching..."
  }
};
```

Matching on `id` (a timestamp) means several requests can be in flight and each response still lands on the right card.

## Talking to the model

The service layer builds a prompt from the three form fields, asks for a numbered two-part answer, and splits the reply on numbered list markers:

```ts title="src/services/api.ts (abridged)"
const prompt = `Act as a neonatal specialist. Analyze these clinical parameters for a preterm infant:
- Core Temperature: ${data.temperature}°C
- Current Weight: ${data.weight} lbs
- Postnatal Age: ${data.age} weeks
...
Format strictly as:
1. [Diagnosis]
2. [Reasoning]
Include only factual medical analysis, no disclaimers.`;

const parts = text.split(/\d+\.\s+/);   // split on "1. ", "2. "
```

Asking for a strict format and parsing it is a quick way to get structured output, and it is also fragile: any other "number, period, space" in the answer splits it in the wrong place. A JSON response schema would be sturdier.

The prompt also tells the model to leave out disclaimers. For a demo that is understandable. For anything beyond one, the safety framing has to live in the interface, not be left to the model.

:::note Which model?
The Devpost submission lists OpenAI. The repository snapshot calls Google's Gemini (`gemini-pro`) through `@google/generative-ai`, and its only commit is dated January 2025, after the December 2024 submission. The provider may have changed. [CONFIRM which one the hackathon demo used]
:::

## Where the two halves meet

In the code I read, the dashboard's temperature comes from the form, and nothing sends readings from the board to the app. The repository also contains a Firebase client configuration, but no component imports it, so entries live only in React state and disappear on refresh.

That is a normal state of affairs for an eight-hour build, and it clarifies what a second iteration would be about.

:::placeholder How the demo connected hardware and software
[FILL IN: how did the demo show the Arduino reading reaching the dashboard? Was it typed by hand, or was there a link that isn't in these repositories?]
:::

## Challenges

The Devpost names three. In its words, paraphrased:

- **Hardware:** getting the display to update the temperature in real time took several rounds of trial and error. The sketch clears and redraws regions of the screen on every loop.
- **Front end:** turning a polished Figma design into working code under time pressure.
- **Back end:** hooking up the LLM API was simple, but still had a learning curve.

:::placeholder Challenges in your own words
[FILL IN: what did you personally get stuck on, and how did you get unstuck?]
:::

## What we learned

From the Devpost: how to work with the Arduino GIGA and read technical documentation quickly, how to use Chart.js and an LLM API inside a full-stack app, and how to balance speed with clear communication in a small team.

:::placeholder Your part of the build
[FILL IN: which pieces did you work on (hardware, UI, prompt, design)? I couldn't verify individual contributions from the Devpost or the repositories, so none are claimed here.]
:::

## If this were picked up again

The Devpost's own list is solar power for off-grid use, folders to track trends over time, and predictive modelling. From reading the code, I would start with:

- **Connect the halves.** Send readings from the board to the dashboard so nobody types a temperature by hand.
- **Fix the arithmetic.** Use floats for the accumulator, divide by the real sample count, and remove the duplicated block.
- **Calibrate and document the sensor** against a reference thermometer.
- **Persist entries,** since the Firebase setup is already half there.
- **Move the safety framing into the interface,** and keep a clear "prototype, not a medical device" notice visible.
