import z from "zod";

export const projectSchema = z.object({
    name: z.string().min(1, "Project name is Required").max(100, "Project Name must be atmost 100 characters"),
    key: z.string().min(2, "Key must be atleast 2 charavters long...").max(50, "Key must be atmost 50 characters"),
    description: z.string().max(500, "Description must be less than 500 characters").optional()
})