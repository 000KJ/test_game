type AssetModule = { default: string };

// Vite: eagerly collect all image asset URLs under src/assets
const assetModules = import.meta.glob<AssetModule>(
  "./assets/**/*.{png,jpg,jpeg,webp,gif,svg}",
  { eager: true },
);

export const APP_IMAGE_URLS = Object.values(assetModules)
  .map((m) => m.default)
  .filter(Boolean);

