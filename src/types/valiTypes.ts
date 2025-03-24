import * as v from 'valibot';

export const contactSchema = v.object({
    name: v.pipe(v.string(), v.minLength(2), v.maxLength(50)),
    email: v.pipe(v.string(), v.email()), 
    phone_number: v.pipe(v.string(), v.minLength(9), v.maxLength(15)),
    message: v.pipe(v.string(), v.minLength(10), v.maxLength(500)),
    link: v.optional(v.string()), 
    status: v.optional(v.union([
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ])),
  });