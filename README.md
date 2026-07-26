# Deadline Rescue

Deadline Rescue is an AI-powered assignment planning app for students who are close to a deadline and do not know what to do first. The app turns assignment requirements, available hours, progress, energy level, and biggest worry into a realistic rescue plan.

## Real Problem

Students often lose marks not because they do not care, but because they panic near the deadline and work in the wrong order. This app helps students focus on the tasks that affect grading first: core functionality, deployment, README/reporting, screenshots, and final submission checks.

## Live Deployed URL

Add your deployed link here after publishing:

https://your-vercel-project-url.vercel.app

## Features

- Assignment detail form for title, requirements, deadline, timezone, available hours, progress, energy, and biggest worry.
- AI-generated rescue plan with priorities, work order, time blocks, AI feature advice, and final submission checklist.
- Smart fallback planning if the AI key is not configured yet, so the app still works during testing.
- One-click copy button for saving the generated plan.
- Sample project loader for quickly testing the final project scenario.
- Responsive design that works on laptop and mobile screens.

## AI Feature

The AI feature is the Rescue Plan Generator. It sends the student's assignment context to Gemini and asks for a short, practical plan that protects the highest-grade tasks first.

### System Prompt

```text
You are Deadline Rescue, a focused AI planning coach for students.

Your job is to turn an urgent assignment into a realistic rescue plan.
Be practical, calm, and specific. Do not shame the student.
Prioritize the work that affects grading first.
Always include:
1. Rescue Summary
2. Work Order
3. Time Blocks
4. AI Feature Advice
5. Final Submission Checklist

Use short markdown headings starting with ## and bullet points starting with -.
Keep the plan under 450 words.
```

## Tools, Services, and Models

- HTML, CSS, and JavaScript for the frontend.
- Node.js for local development.
- Vercel serverless functions for the AI endpoint.
- Google Gemini 1.5 Flash for AI planning.
- GitHub for the public repository.
- Vercel for live deployment.

## Screenshots

### Home Screen

![Home screen](assets/screenshots/01-home.png)

### Generated Rescue Plan

![Generated rescue plan](assets/screenshots/02-generated-plan.png)

### Mobile View

![Mobile view](assets/screenshots/03-mobile.png)

## How to Run Locally

1. Install Node.js.
2. Clone the repository.
3. Open the project folder.
4. Run:

```bash
npm start
```

5. Open:

```text
http://localhost:3000
```

## Environment Variables

To enable the real AI model, add this environment variable in Vercel:

```text
GEMINI_API_KEY=your_google_gemini_api_key
```

Never commit API keys to GitHub.

## Deployment

1. Push this project to a public GitHub repository.
2. Import the repository into Vercel.
3. Add `GEMINI_API_KEY` in Vercel project settings.
4. Deploy the app.
5. Open the live URL in an incognito window to confirm it works.

## Final Submission

Submit only the public GitHub repository link on the portal. The README should include the final live URL and screenshots before submission.

