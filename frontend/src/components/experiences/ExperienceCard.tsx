import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { Experience } from "@/lib/types";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link
      href={`/experiences/${experience._id}`}
      className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={experience.images[0]}
          alt={experience.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="brand" className="bg-white/90 shadow-sm dark:bg-ink-950/80">
            {experience.category}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-1.5 text-xs text-ink-500">
          <MapPin size={12} />
          {experience.location.city}, {experience.location.country}
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-ink-900 dark:text-ink-50">
          {experience.title}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink-500 dark:text-ink-400">
          {experience.shortDescription}
        </p>
        <div className="flex items-center justify-between pt-1.5">
          <Rating value={experience.rating} count={experience.reviewCount} />
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Clock size={12} /> {experience.durationDays}d
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
          <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            ${experience.price}
            <span className="text-xs font-normal text-ink-400"> / person</span>
          </span>
          <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
