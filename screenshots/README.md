# Screenshots Folder

Drop screenshots here for sharing with Claude Code.

## 🚀 Automated Mode (Recommended)

Start the file watcher to automatically process screenshots as you drop them:

```bash
# Start watching (run this in a separate terminal):
./scripts/watch-screenshots.sh
```

**What it does:**
- Watches for new image files in this folder
- Saves original to `screenshots/original/` (never deleted)
- Creates resized version in `screenshots/resized/` (max 2000px wide)
- Renames files with timestamps: `screenshot-2026-01-23-145523.png`
- All screenshots are processed, even if they don't need resizing

**Folder Structure:**
```
screenshots/
├── original/          # Full-size originals (preserved forever)
├── resized/          # Resized versions (max 2000px wide)
└── README.md
```

**Usage:**
1. Start the watcher script
2. Drop screenshots into the `screenshots/` folder root
3. Files are instantly processed:
   - Original → `original/screenshot-TIMESTAMP.png`
   - Resized → `resized/screenshot-TIMESTAMP.png`
4. Press Ctrl+C to stop watching

## 📦 Batch Mode (Manual)

Process all existing images at once:

```bash
./scripts/resize-screenshots.sh
```

This will process all images in the screenshots root folder and organize them into `original/` and `resized/` subdirectories.

## Supported Formats
- PNG, JPG/JPEG, GIF

## Manual Resize (Alternative)

```bash
sips --resampleWidth 2000 screenshots/your-image.png
```
