"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ImagePlus } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiClientError } from "@/lib/api";
import { EXPERIENCE_CATEGORIES, ExperienceCategory } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700";
const labelClass = "mb-1.5 block text-xs font-medium text-ink-500";

function AddExperienceForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState<ExperienceCategory>("Adventure");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("1");
  const [availableFrom, setAvailableFrom] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [tags, setTags] = useState("");
  const [highlights, setHighlights] = useState("");
  const [included, setIncluded] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateImage = (i: number, value: string) => {
    setImages((prev) => prev.map((img, idx) => (idx === i ? value : img)));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanImages = images.map((i) => i.trim()).filter(Boolean);
    if (cleanImages.length === 0) {
      setError("Add at least one image URL so travelers can see the experience.");
      return;
    }

    setLoading(true);
    try {
      const { experience } = await apiFetch<{ experience: { _id: string } }>("/experiences", {
        method: "POST",
        body: {
          title: title.trim(),
          shortDescription: shortDescription.trim(),
          fullDescription: fullDescription.trim(),
          images: cleanImages,
          price: Number(price),
          currency: "USD",
          location: { city: city.trim(), country: country.trim() },
          category,
          durationDays: Number(durationDays),
          availableFrom,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          highlights: highlights.split("\n").map((t) => t.trim()).filter(Boolean),
          included: included.split("\n").map((t) => t.trim()).filter(Boolean),
        },
      });
      router.push(`/experiences/${experience._id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not create experience.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page max-w-2xl py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
        Add an experience
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        List a trip you host. It will appear in Explore immediately and in your Manage Listings.
      </p>

      <form onSubmit={submit} className="card mt-8 space-y-5 p-6">
        <div>
          <label className={labelClass}>Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Sunrise Kayak Tour of Halong Bay" />
        </div>

        <div>
          <label className={labelClass}>Short description</label>
          <input
            required
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className={inputClass}
            placeholder="One sentence that sells the experience (max 220 chars)"
            maxLength={220}
          />
        </div>

        <div>
          <label className={labelClass}>Full description</label>
          <textarea
            required
            rows={5}
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            className={inputClass}
            placeholder="Describe the itinerary, what makes it worth booking, and what to expect."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as ExperienceCategory)} className={inputClass}>
              {EXPERIENCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Price per person (USD)</label>
            <input required type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="120" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>City</label>
            <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Halong Bay" />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} placeholder="Vietnam" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Duration (days)</label>
            <input required type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Available from</label>
            <input required type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Image URLs</label>
          <div className="space-y-2">
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImagePlus size={16} className="shrink-0 text-ink-400" />
                <input
                  value={img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  className={inputClass}
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {images.length > 1 && (
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} aria-label="Remove image">
                    <X size={16} className="text-ink-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setImages((prev) => [...prev, ""])}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
          >
            <Plus size={13} /> Add another image
          </button>
        </div>

        <div>
          <label className={labelClass}>Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} placeholder="kayaking, sunrise, islands" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Highlights (one per line)</label>
            <textarea rows={3} value={highlights} onChange={(e) => setHighlights(e.target.value)} className={inputClass} placeholder={"Sunrise departure\nSmall group of 8"} />
          </div>
          <div>
            <label className={labelClass}>What&apos;s included (one per line)</label>
            <textarea rows={3} value={included} onChange={(e) => setIncluded(e.target.value)} className={inputClass} placeholder={"Kayak & gear\nLocal guide\nLunch"} />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Publishing..." : "Add Experience"}
        </Button>
      </form>
    </div>
  );
}

export default function AddExperiencePage() {
  return (
    <RequireAuth>
      <AddExperienceForm />
    </RequireAuth>
  );
}
