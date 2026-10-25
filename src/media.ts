import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';
// Store bounded reference previews locally, never full camera originals.
export async function referencePhoto(asset: ImagePickerAsset) {
  const context = ImageManipulator.manipulate(asset.uri);
  try {
    context.resize(asset.height > asset.width ? { height: 760 } : { width: 760 });
    const image = await context.renderAsync();
    try {
      const result = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.6,
        base64: true,
      });
      if (!result.base64 || result.base64.length > 599970)
        throw Error('This photo is too large. Choose a smaller image.');
      return `data:image/jpeg;base64,${result.base64}`;
    } finally {
      image.release();
    }
  } finally {
    context.release();
  }
}
