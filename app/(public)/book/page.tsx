import type { Metadata } from "next";
import { Suspense } from "react";
import BookingWizard from "@/components/public/BookingWizard";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your mehndi appointment with Taslima in just a few steps. Choose your service, date, and time.",
};

export default function BookPage() {
  return (
    <div className="section">
      <div className="container-base">
        <div className="text-center mb-8">
          <h1 className="section-title">Book Your Appointment</h1>
          <p className="section-subtitle mx-auto">
            Complete your booking in just a few steps. We&apos;ll confirm within a few hours.
          </p>
        </div>
        <Suspense fallback={
          <div className="max-w-lg mx-auto">
            <div className="skeleton h-96 rounded-2xl" />
          </div>
        }>
          <BookingWizard />
        </Suspense>
      </div>
    </div>
  );
}
