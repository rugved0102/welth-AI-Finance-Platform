import z from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"), // format string hoga aur min length 1 chahiye nahi to error de do "name is req" krke
    type: z.enum(["CURRENT","SAVINGS"]),
    balance: z.string().min(1, "Initial balance is required"),
    isDefault: z.boolean().default(false),
})