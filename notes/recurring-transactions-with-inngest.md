# Recurring Transactions with Inngest

## Key Components

### Trigger Function (`triggerRecurringTransactions`)
- **Runs daily at midnight** (`cron: "0 0 * * *"`) .
- **Finds all recurring transactions that are due** (`lastProcessed = null` or `nextRecurringDate <= today`) .
- **Emits events**: `transaction.recurring.process` .
- **Acts as a dispatcher, not processor** .

### Processor Function (`processRecurringTransaction`)
- **Listens for transaction.recurring.process events** .
- **Throttled**: max 10 transactions per user per minute .
- **For each event**:
  - Fetch transaction + account .
  - If due → create a new normal transaction (with today’s date) .
  - Update account balance (+ or – based on type) .
  - Update recurring template with `lastProcessed` and new `nextRecurringDate` .
- **Uses `db.$transaction` → atomic updates** .

### Helpers
- `isTransactionDue()` → checks if recurring transaction is due .
- `calculateNextRecurringDate()` → adds 1 day/week/month/year based on interval .

## Flow

- **Scheduler (CRON)** → Finds due recurring transactions .
- **Emits events per transaction** .
- **Worker (Processor)** → Executes events:
  - Creates new transaction .
  - Adjusts balance .
  - Reschedules next occurrence .

## Key Points to Remember

- **Decoupling** → Scheduler just emits events, processor does the heavy lifting .
- **Throttling** → Prevents overload per user (10/min) .
- **Atomic DB ops** → Ensures no inconsistent balances .
- **Intervals supported** → DAILY, WEEKLY, MONTHLY, YEARLY .
- **Scalable** → Multiple processors can handle events in parallel .

## FAQ

- **Why use events?**
  - Decouples scheduling from processing, improves scalability .
- **Why throttle?**
  - To avoid spamming one user or overloading DB .
- **Why Prisma `$transaction`?**
  - Ensures data consistency between transaction + account balance .
