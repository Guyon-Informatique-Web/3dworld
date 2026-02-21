// Upload d'images produit vers Supabase Storage
// Drag & drop, apercu, reordonnancement et suppression des images
// Bucket : product-images (public)

"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

/** URL de base du bucket Supabase Storage */
const STORAGE_BASE_URL =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images`;

/** Taille maximale d'un fichier (5 Mo) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Types MIME acceptes */
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadProps {
  /** Liste des URLs d'images actuelles */
  images: string[];
  /** Callback quand la liste d'images change */
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  // Index de l'image en cours de drag pour le reordonnancement
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Valide un fichier avant upload :
   * - type MIME autorise
   * - taille <= 5 Mo
   */
  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Type de fichier non supporte : ${file.type}. Utilisez JPEG, PNG ou WebP.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);
      return `Fichier trop volumineux (${sizeMb} Mo). Maximum : 5 Mo.`;
    }
    return null;
  }

  /**
   * Upload un fichier vers Supabase Storage.
   * Retourne l'URL publique du fichier.
   */
  async function uploadFile(file: File): Promise<string> {
    const supabase = createClient();

    // Generer un nom unique pour eviter les collisions
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const uniqueName = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(uniqueName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Erreur d'upload : ${uploadError.message}`);
    }

    return `${STORAGE_BASE_URL}/${uniqueName}`;
  }

  /**
   * Traite les fichiers selectionnes ou deposses :
   * valide, upload et met a jour la liste.
   */
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (fileArray.length === 0) return;

      setError(null);
      setUploading(true);

      try {
        const newUrls: string[] = [];

        for (const file of fileArray) {
          // Validation
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            continue;
          }

          // Upload
          const url = await uploadFile(file);
          newUrls.push(url);
        }

        if (newUrls.length > 0) {
          onChange([...images, ...newUrls]);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erreur lors de l'upload.";
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [images, onChange]
  );

  /** Gestion du drop de fichiers */
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);

    // Si on est en mode reordonnancement, ne pas traiter comme un upload
    if (dragIndex !== null) return;

    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  /** Gestion du drag over (style visuel) */
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (dragIndex === null) {
      setDragOver(true);
    }
  }

  /** Gestion du drag leave */
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
  }

  /** Ouverture du selecteur de fichiers */
  function handleClick() {
    fileInputRef.current?.click();
  }

  /** Gestion de la selection de fichiers via input */
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reinitialiser l'input pour permettre de re-selectionner le meme fichier
      e.target.value = "";
    }
  }

  /** Supprime une image de la liste et du storage */
  async function handleRemove(index: number) {
    const url = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    // Suppression du fichier dans Supabase Storage (best effort)
    try {
      const supabase = createClient();
      // Extraire le chemin du fichier depuis l'URL
      const path = url.replace(`${STORAGE_BASE_URL}/`, "");
      await supabase.storage.from("product-images").remove([path]);
    } catch {
      // On ne bloque pas l'interface si la suppression echoue
      console.warn("Impossible de supprimer le fichier du storage.");
    }
  }

  // --- Reordonnancement par drag & drop ---

  /** Debut du drag d'une image existante */
  function handleImageDragStart(index: number) {
    setDragIndex(index);
  }

  /** Survol d'une image lors du drag */
  function handleImageDragOver(e: React.DragEvent<HTMLDivElement>, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    // Reordonner les images
    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onChange(newImages);
    setDragIndex(index);
  }

  /** Fin du drag */
  function handleImageDragEnd() {
    setDragIndex(null);
  }

  return (
    <div className="space-y-3">
      {/* Zone de drag & drop / clic pour selectionner */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {/* Icone upload */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-2 text-text-light"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>

        {uploading ? (
          <p className="text-sm font-medium text-primary">
            Upload en cours...
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-text">
              Glissez vos images ici ou cliquez pour parcourir
            </p>
            <p className="mt-1 text-xs text-text-light">
              JPEG, PNG ou WebP - 5 Mo maximum par fichier
            </p>
          </>
        )}

        {/* Input file cache */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Apercu des images uploadees */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-text-light">
            {images.length} image{images.length > 1 ? "s" : ""} -
            Glissez pour reordonner (la premiere = image principale)
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((url, index) => (
              <div
                key={url}
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragEnd={handleImageDragEnd}
                className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border-2 transition-all ${
                  dragIndex === index
                    ? "border-primary opacity-50"
                    : index === 0
                      ? "border-primary"
                      : "border-gray-200"
                } ${dragIndex !== null && dragIndex !== index ? "hover:border-primary/50" : ""}`}
              >
                <Image
                  src={url}
                  alt={`Image produit ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />

                {/* Badge image principale */}
                {index === 0 && (
                  <div className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Principale
                  </div>
                )}

                {/* Bouton supprimer */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  title="Supprimer cette image"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
