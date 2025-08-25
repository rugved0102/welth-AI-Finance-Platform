# Welth Email + Inngest + Resend Setup

This project uses **React Email** for building templates, **Resend** for sending them, and **Inngest** for scheduling background jobs (like budget alerts).

---

## ⚙️ Setup

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd welth
   npm install
   ```

2. **Environment Variables**  
   Create a `.env.local` file and add:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   DATABASE_URL=your_prisma_database_url_here
   ```

3. **Database (Prisma)**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

---

## 📝 Email Templates

- Templates live in the `/emails` folder.  
- Example: `MonthlyReport.jsx` or `BudgetAlert.jsx`.  
- Built using [`@react-email/components`](https://react.email/docs/components).  
- Each file should export a **default React component**.  
- You can provide sample data for preview with `Component.defaultProps`.

Example:

```jsx
import { Html, Text } from "@react-email/components";

export default function BudgetAlert({ userName, data }) {
  return (
    <Html>
      <Text>
        Hello {userName}, you’ve used {data.percentageUsed}% of your budget.
      </Text>
    </Html>
  );
}

BudgetAlert.defaultProps = {
  userName: "John Doe",
  data: { percentageUsed: 85, budgetAmount: 4000, totalExpenses: 3400 }
};
```

---

## 👀 Previewing Emails

Run the preview server:

```bash
npm run email
```

- Opens React Email Preview Server (usually at `http://localhost:3000`).  
- You’ll see a sidebar with all templates in `/emails`.  
- Click one to preview with your dummy data.

---

## 📤 Sending Emails (Resend)

We use [Resend](https://resend.com) to send the templates.

Server action: `/server/send-email.js`

```js
"use server";
import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "Finance App <onboarding@resend.dev>", // replace in production
    to,
    subject,
    react,
  });
}
```

Usage:

```js
import BudgetAlert from "@/emails/BudgetAlert";
import { sendEmail } from "@/server/send-email";

await sendEmail({
  to: "user@example.com",
  subject: "Your Budget Alert",
  react: BudgetAlert({
    userName: "Jane Doe",
    data: { percentageUsed: 90 }
  }),
});
```

---

## ⏱️ Scheduled Jobs (Inngest)

We use [Inngest](https://www.inngest.com/) to schedule background jobs.

### Client: `/lib/inngest/client.js`
```js
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "welth",
  name: "Welth",
});
```

### Function: `/lib/inngest/functions.js`
```js
import { inngest } from "./client";
import { db } from "../prisma";
import { sendEmail } from "../server/send-email";
import EmailTemplate from "@/emails/template";

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts", retries: 2 }, // retry twice
  { cron: "0 */6 * * *" }, // every 6 hours
  async ({ step }) => {
    const budgets = await db.budget.findMany({ include: { user: true } });

    for (const budget of budgets) {
      const expenses = await db.transaction.aggregate({
        where: { userId: budget.userId, type: "EXPENSE" },
        _sum: { amount: true },
      });

      const totalExpenses = expenses._sum.amount?.toNumber() || 0;
      const percentageUsed = (totalExpenses / budget.amount) * 100;

      if (percentageUsed >= 80) {
        await sendEmail({
          to: budget.user.email,
          subject: "Budget Alert",
          react: EmailTemplate({
            userName: budget.user.name,
            type: "budget-alert",
            data: {
              budgetAmount: budget.amount,
              totalExpenses,
              percentageUsed,
            },
          }),
        });
      }
    }
  }
);
```

### API Route: `/app/api/inngest/route.js`
```js
import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlerts } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [checkBudgetAlerts],
});
```

---

## 🚀 Running Locally

1. Start Next.js dev server:
   ```bash
   npm run dev
   ```

2. In another terminal, start Inngest Dev Server:
   ```bash
   npx inngest-cli@latest dev
   ```

   - Connects to your Next.js `/api/inngest` endpoint.
   - Lets you test cron jobs and trigger functions locally.

3. Preview emails at:
   ```bash
   npm run email
   ```

---

## 🛠️ Notes

- `onboarding@resend.dev` can only be used for testing.  
  → For production, [verify your own domain](https://resend.com/docs/production/domains).  
- Numbers in emails should be formatted nicely (`Number(value).toFixed(2)`).  
- Budget alerts currently trigger once per month at 80%.  
  → You can extend logic to also alert at 90% and 100%.  

---

## 🔗 How It All Connects

1. **React Email** → design and preview emails in `/emails`.  
2. **Resend** → actually send the email templates.  
3. **Inngest** → schedule background jobs (e.g. check budgets every 6 hours).  
4. **Next.js API Route** (`/api/inngest`) → exposes your Inngest functions to the Inngest Dev Server and production runtime.  

✅ With this setup:
- You **design emails** in `/emails` with live preview.  
- You **send emails** with Resend (`sendEmail`).  
- You **schedule jobs** with Inngest (`checkBudgetAlerts`).  
- You **serve functions** through Next.js at `/api/inngest`.  
