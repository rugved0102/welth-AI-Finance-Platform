import { serve } from "inngest/next"
import {inngest} from "@/lib/inngest/client"
import { checkBudgetAlerts } from "./functions"

// Create and API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        // your functions will be passed here later!
        checkBudgetAlerts
    ],
})