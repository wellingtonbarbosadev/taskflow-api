import z from "zod";

const envSchema = z.object({
  PORT: z.string(),
});

const env = envSchema.parse(process.env);

export { env };
