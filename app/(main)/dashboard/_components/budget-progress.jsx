import React, { useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
const BudgetProgress = ({initialBudget, currentExpenses}) => {
  
    const [isEditing, setIsEditing] = useState(false)
    const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "")

    const percentUsed = initialBudget? (currentExpenses/initialBudget.amount)*100:0;
  
    return (
    <div>
      <Card>
  <CardHeader>
    <CardTitle>Monthly Budget (Default Account)</CardTitle>
    <div>
        {isEditing?<div>
            <Input
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="w-32"
            placeholder="Enter amount"
            autoFocus
            />
            <Button variant="ghost" size="icon" onClick={handleUpdateBudget}>
                <Check/>
            </Button>
            <Button>
                <X/>
            </Button>
        </div>: <></>}
    </div>
    <CardDescription>Card Description</CardDescription>
    <CardAction>Card Action</CardAction>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
</Card>
    </div>
  )
}

export default BudgetProgress
