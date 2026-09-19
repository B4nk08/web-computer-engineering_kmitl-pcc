"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { activityPhotos, type ActivityItem } from "../types";
import { ActivityLightbox } from "./activity-lightbox";

const THUMB_MAX = 4;

function PhotoPane({
  photos,
  alt,
  onOpen,
}: {
  photos: string[];
  alt: string;
  onOpen: (index: number) => void;
}) {
  const hero = photos[0];
  const thumbs = photos.slice(1, 1 + THUMB_MAX);
  const extra = photos.length - 1 - thumbs.length;

  return (
    <div className="relative min-h-[240px] min-w-0 bg-[var(--surface)] md:min-h-[320px]">
      <button
        type="button"
        onClick={() => onOpen(0)}
        className="absolute inset-0"
        aria-label={`ดูรูป ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero} alt={alt} className="h-full w-full object-cover" />
      </button>

      {thumbs.length > 0 ? (
        <div className="absolute inset-x-0 bottom-0 z-10 flex gap-1.5 p-3">
          {thumbs.map((src, i) => {
            const photoIndex = i + 1;
            const isLast = i === thumbs.length - 1 && extra > 0;
            return (
              <button
                key={`${src}-${photoIndex}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(photoIndex);
                }}
                className="relative size-14 overflow-hidden rounded-lg ring-2 ring-white/90 sm:size-16"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {isLast ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                    +{extra}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ActivityCard({
  item,
  reverse,
}: {
  item: ActivityItem;
  reverse?: boolean;
}) {
  const photos = activityPhotos(item);
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const hasPhotos = photos.length > 0;

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
        <div
          className={cn(
            hasPhotos && "grid md:grid-cols-2",
            hasPhotos && reverse && "md:[&>:first-child]:order-2",
          )}
        >
          {hasPhotos ? (
            <PhotoPane
              photos={photos}
              alt={item.title}
              onOpen={setViewIndex}
            />
          ) : null}

          <div className="flex min-w-0 flex-col justify-center px-6 py-7 sm:px-8 sm:py-10">
            {item.date ? (
              <p className="text-xs font-medium text-[var(--ink-soft)]">{item.date}</p>
            ) : null}
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
              {item.title}
            </h2>
            {item.description ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--ink-soft)]">
                {item.description}
              </p>
            ) : null}
            {item.googlePhotosUrl ? (
              <a
                href={item.googlePhotosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--navy-950)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--navy-900)]"
              >
                ดูอัลบั้มรูป
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>
      </article>

      {viewIndex !== null ? (
        <ActivityLightbox
          photos={photos}
          index={viewIndex}
          title={item.title}
          albumHref={item.googlePhotosUrl || undefined}
          onClose={() => setViewIndex(null)}
          onIndexChange={setViewIndex}
        />
      ) : null}
    </>
  );
}
