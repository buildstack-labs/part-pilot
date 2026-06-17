import { z } from "zod";

export const plateSchema = z.object({
  plate: z
    .string()
    .min(1, "נא להזין מספר לוחית")
    .refine(
      (val) => {
        const digits = val.trim().replace(/-/g, "");
        return /^[0-9]{7,8}$/.test(digits);
      },
      { message: "פורמט לוחית לא תקין (7–8 ספרות)" },
    ),
});

export type PlateFormValues = z.infer<typeof plateSchema>;
