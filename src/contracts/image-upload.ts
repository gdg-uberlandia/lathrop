export const IMAGE_UPLOAD_TARGETS = {
  speakers: ["photo"],
  missions: ["image"],
  companies: ["logo", "stamp"],
  tags: ["image"],
  raffles: ["image"],
  sponsors: ["logo"],
} as const;

export type ImageUploadFolder = keyof typeof IMAGE_UPLOAD_TARGETS;
export type ImageUploadVariant<TFolder extends ImageUploadFolder> =
  (typeof IMAGE_UPLOAD_TARGETS)[TFolder][number];

export type ImageUploadTarget<TFolder extends ImageUploadFolder> = {
  folder: TFolder;
  entityId: string;
  variant: ImageUploadVariant<TFolder>;
};
