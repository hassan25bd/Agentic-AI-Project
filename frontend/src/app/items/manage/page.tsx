"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Trash2, Plus, Star } from "lucide-react";
import { useState } from "react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { apiFetch } from "@/lib/api";
import { Experience } from "@/lib/types";
import { Button, LinkButton } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

function ManageListings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["experiences", "mine"],
    queryFn: () => apiFetch<{ items: Experience[] }>("/experiences/mine"),
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiFetch(`/experiences/${id}`, { method: "DELETE" });
      queryClient.setQueryData<{ items: Experience[] } | undefined>(["experiences", "mine"], (prev) =>
        prev ? { items: prev.items.filter((e) => e._id !== id) } : prev
      );
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
            Manage listings
          </h1>
          <p className="mt-2 text-sm text-ink-500">Experiences you host on Voyager.</p>
        </div>
        <LinkButton href="/items/add" variant="accent">
          <Plus size={15} /> Add experience
        </LinkButton>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <p className="font-medium text-ink-700 dark:text-ink-200">You haven&apos;t listed any experiences yet.</p>
          <LinkButton href="/items/add">Add your first experience</LinkButton>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.items.map((exp) => (
            <div key={exp._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl sm:w-28">
                <Image src={exp.images[0]} alt={exp.title} fill className="object-cover" sizes="112px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold text-ink-900 dark:text-ink-50">
                  {exp.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {exp.location.city}, {exp.location.country} · {exp.category}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-ink-500">
                  <span className="font-semibold text-ink-800 dark:text-ink-100">${exp.price}</span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-accent-500 text-accent-500" />
                    {exp.rating > 0 ? exp.rating.toFixed(1) : "New"} ({exp.reviewCount})
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/experiences/${exp._id}`}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-ink-200 px-3.5 text-xs font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-900"
                >
                  <Eye size={14} /> View
                </Link>
                {confirmId === exp._id ? (
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="danger" disabled={deletingId === exp._id} onClick={() => handleDelete(exp._id)}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(exp._id)}
                    className="flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-3.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageListingsPage() {
  return (
    <RequireAuth>
      <ManageListings />
    </RequireAuth>
  );
}
