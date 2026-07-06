import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select a time"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  venue: z.string().optional(),
  guests: z.number().min(1).max(50).optional(),
  notes: z.string().max(500).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  message: z.string().min(10, "Review must be at least 10 characters").max(500),
  rating: z.number().min(1).max(5),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  durationMin: z.number().min(15, "Duration must be at least 15 minutes"),
  category: z.enum(["Bridal", "Arabic", "Party", "Kids"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const availabilitySchema = z.object({
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  blockedDate: z.string().optional(),
  isBlocked: z.boolean().default(false),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
