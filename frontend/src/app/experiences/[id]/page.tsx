"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, CalendarDays, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useExperience } from "@/lib/hooks/useExperiences";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { SaveButton } from "@/components/experiences/SaveButton";
import { ReviewForm } from "@/components/experiences/ReviewForm";
import { ReviewList } from "@/components/experiences/ReviewList";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { useAuth } from "@/lib/auth-context";
import { Experience } from "@/lib/types";

export default function ExperienceDetailsPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useExperience(params.id);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) return <DetailsSkeleton />;

  if (error || !data) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-lg font-medium text-ink-700 dark:text-ink-200">Experience not found.</p>
        <Link href="/explore" className="mt-3 inline-block text-sm text-brand-700 hover:underline">
          Back to explore
        </Link>
      </div>
    );
  }

  const { experience, reviews, related } = data;
  const host = typeof experience.host === "object" ? experience.host : null;
  const alreadyReviewed = reviews.some((r) => r.user._id === user?.id);
  const images = experience.images;

  return (
    <div className="container-page py-8">
      <nav className="mb-4 text-sm text-ink-500">
        <Link href="/explore" className="hover:text-brand-700">
          Explore
        </Link>{" "}
        / <span className="text-ink-700 dark:text-ink-300">{experience.title}</span>
      </nav>

      {/* Gallery */}
      <div className="relative mb-6 h-64 w-full overflow-hidden rounded-3xl sm:h-96">
        <Image
          src={images[activeImage]}
          alt={experience.title}
          fill
          priority
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveImage((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeImage ? "w-6 bg-white" : "w-1.5 bg-white/60"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Badge tone="brand">{experience.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
            {experience.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} /> {experience.location.city}, {experience.location.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> {experience.durationDays} day{experience.durationDays > 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} /> From{" "}
              {new Date(experience.availableFrom).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <Rating value={experience.rating} count={experience.reviewCount} />
          </div>

          {/* Overview */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
              Overview
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {experience.fullDescription}
            </p>
            {experience.highlights.length > 0 && (
              <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {experience.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand-600" /> {h}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Key info */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
              Key information
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoTile label="Price" value={`$${experience.price}`} />
              <InfoTile label="Duration" value={`${experience.durationDays} day(s)`} />
              <InfoTile label="Category" value={experience.category} />
              <InfoTile label="Rating" value={experience.rating > 0 ? experience.rating.toFixed(1) : "New"} />
            </div>
            {experience.included.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-ink-800 dark:text-ink-100">What&apos;s included</p>
                <div className="flex flex-wrap gap-2">
                  {experience.included.map((item) => (
                    <Badge key={item} tone="neutral">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {experience.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.tags.map((tag) => (
                  <span key={tag} className="text-xs text-ink-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
              Reviews ({experience.reviewCount})
            </h2>
            <div className="mt-3 mb-5">
              <ReviewForm
                experienceId={experience._id}
                alreadyReviewed={alreadyReviewed}
                onSubmitted={() =>
                  queryClient.invalidateQueries({ queryKey: ["experience", experience._id] })
                }
              />
            </div>
            <ReviewList reviews={reviews} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="card p-5">
            <p className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
              ${experience.price}
              <span className="text-sm font-normal text-ink-400"> / person</span>
            </p>
            <p className="mt-1 text-xs text-ink-500">
              {experience.durationDays} day experience · {experience.currency}
            </p>
            <SaveButton experienceId={experience._id} className="mt-4 w-full" />
            {host && (
              <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4 dark:border-ink-800">
                <Image
                  src={host.avatarUrl}
                  alt={host.name}
                  width={40}
                  height={40}
                  unoptimized
                  className="rounded-full bg-ink-100"
                />
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{host.name}</p>
                  <p className="text-xs text-ink-500">Local host</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Related experiences
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp as Experience} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-3.5 text-center">
      <p className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">{value}</p>
      <p className="mt-0.5 text-xs text-ink-500">{label}</p>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="container-page py-8">
      <Skeleton className="mb-6 h-64 w-full sm:h-96" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="mt-3 h-4 w-1/3" />
      <Skeleton className="mt-6 h-32 w-full" />
    </div>
  );
}
