from pathlib import Path
from PIL import Image
import numpy as np


# ============================================================
# 1. CHANGE THIS PATH
# ============================================================

DATASET_ROOT = Path(r"C:\Users\depka\Desktop\sem5\SIH\AI4Shipwrecks.zip")


# ============================================================
# 2. DATASET FOLDERS
# ============================================================

TRAIN_IMAGES = DATASET_ROOT / "train" / "images"
TRAIN_LABELS = DATASET_ROOT / "train" / "labels"

TEST_IMAGES = DATASET_ROOT / "test" / "images"
TEST_LABELS = DATASET_ROOT / "test" / "labels"


# ============================================================
# 3. FIND IMAGE/LABEL PAIRS
# ============================================================

def find_pairs(image_folder, label_folder):

    image_files = sorted(image_folder.glob("*.png"))

    pairs = []

    for image_path in image_files:

        label_path = label_folder / image_path.name

        if label_path.exists():
            pairs.append((image_path, label_path))

    return pairs


# ============================================================
# 4. ANALYZE LABEL
# ============================================================

def analyze_label(label_path):

    label = np.array(Image.open(label_path))

    # If image has multiple channels, use first channel
    if label.ndim == 3:
        label = label[:, :, 0]

    unique_values = np.unique(label)

    target_pixels = np.count_nonzero(label)

    total_pixels = label.size

    target_percentage = (
        target_pixels / total_pixels
    ) * 100

    return (
        label.shape,
        unique_values,
        target_pixels,
        target_percentage
    )


# ============================================================
# 5. CHECK DATASET
# ============================================================

def check_dataset(name, image_folder, label_folder):

    print("\n" + "=" * 60)
    print(f"{name} DATASET")
    print("=" * 60)

    if not image_folder.exists():
        print(f"ERROR: Image folder not found:")
        print(image_folder)
        return

    if not label_folder.exists():
        print(f"ERROR: Label folder not found:")
        print(label_folder)
        return

    pairs = find_pairs(image_folder, label_folder)

    image_count = len(list(image_folder.glob("*.png")))
    label_count = len(list(label_folder.glob("*.png")))

    print(f"Images found : {image_count}")
    print(f"Labels found : {label_count}")
    print(f"Matched pairs: {len(pairs)}")

    if len(pairs) == 0:
        print("\nNo matching image/label pairs found.")
        return

    # --------------------------------------------------------
    # Check first few pairs
    # --------------------------------------------------------

    print("\nChecking first 5 image/label pairs:\n")

    for image_path, label_path in pairs[:5]:

        image = Image.open(image_path)
        label = Image.open(label_path)

        image_size = image.size
        label_size = label.size

        print(f"Image : {image_path.name}")
        print(f"  Image size : {image_size}")
        print(f"  Label size : {label_size}")

        if image_size == label_size:
            print("  ✓ Sizes match")
        else:
            print("  ✗ SIZE MISMATCH")

        (
            mask_shape,
            unique_values,
            target_pixels,
            target_percentage
        ) = analyze_label(label_path)

        print(f"  Label values : {unique_values}")
        print(f"  Target pixels: {target_pixels}")
        print(f"  Target area  : {target_percentage:.4f}%")
        print()


# ============================================================
# 6. RUN CHECK
# ============================================================

if __name__ == "__main__":

    print("AI4Shipwrecks Dataset Checker")
    print("--------------------------------")

    check_dataset(
        "TRAIN",
        TRAIN_IMAGES,
        TRAIN_LABELS
    )

    check_dataset(
        "TEST",
        TEST_IMAGES,
        TEST_LABELS
    )

    print("\nDataset check complete.")