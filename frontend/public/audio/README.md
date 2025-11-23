# Audio Files for Polegion - Chapter Narration

This directory contains audio narration files for all chapters across the 5 castles in Polegion.

## Directory Structure

```
audio/
├── whoosh.mp3                    # Carousel transition sound
├── castle1/                      # Euclidean Spire
│   ├── chapter1/
│   ├── chapter2/
│   └── chapter3/
├── castle2/                      # Polygon Citadel
│   ├── chapter1/
│   ├── chapter2/
│   ├── chapter3/
│   └── chapter4/
├── castle3/                      # Circle Sanctuary
│   ├── chapter1/
│   ├── chapter2/
│   └── chapter3/
├── castle4/                      # Coordinate Fortress
│   ├── chapter1/
│   ├── chapter2/
│   ├── chapter3/
│   └── chapter4/
└── castle5/                      # Arcane Observatory
    ├── chapter1/
    ├── chapter2/
    ├── chapter3/
    └── chapter4/
```

## File Naming Convention

Each chapter folder contains audio files organized by scene:

### Format: `{scene}_{index}.mp3`

**Scenes:**
- `opening` - Introduction dialogue for the chapter
- `lesson` - Educational content and concept explanations
- `minigame` - Instructions and encouragement during gameplay

**Examples:**
- `opening_0.mp3` - First opening dialogue line
- `lesson_5.mp3` - Sixth lesson dialogue line (0-indexed)
- `minigame_2.mp3` - Third minigame dialogue line

## Audio File Count by Chapter

### Castle 1 - Euclidean Spire
- **Chapter 1:** Opening: 4, Lesson: 6, Minigame: 3
- **Chapter 2:** Opening: 6, Lesson: 8, Minigame: 3
- **Chapter 3:** Opening: 6, Lesson: 20, Minigame: 3

### Castle 2 - Polygon Citadel
- **Chapter 1:** Opening: 4, Lesson: 8, Minigame: 3
- **Chapter 2:** Opening: 4, Lesson: 7, Minigame: 3
- **Chapter 3:** Opening: 4, Lesson: 6, Minigame: 3
- **Chapter 4:** Opening: 4, Lesson: 6, Minigame: 3

### Castle 3 - Circle Sanctuary
- **Chapter 1:** Opening: 4, Lesson: 8, Minigame: 3
- **Chapter 2:** Opening: 4, Lesson: 7, Minigame: 3
- **Chapter 3:** Opening: 4, Lesson: 8, Minigame: 3

### Castle 4 - Coordinate Fortress
- **Chapter 1:** Opening: 4, Lesson: 7, Minigame: 3
- **Chapter 2:** Opening: 4, Lesson: 7, Minigame: 3
- **Chapter 3:** Opening: 4, Lesson: 9, Minigame: 3
- **Chapter 4:** Opening: 4, Lesson: 10, Minigame: 3

### Castle 5 - Arcane Observatory
- **Chapter 1:** Opening: 5, Lesson: 8, Minigame: 3
- **Chapter 2:** Opening: 4, Lesson: 9, Minigame: 3
- **Chapter 3:** Opening: 5, Lesson: 9, Minigame: 3
- **Chapter 4:** Opening: 5, Lesson: 11, Minigame: 3

## Audio Specifications

**Recommended Format:**
- Format: MP3
- Sample Rate: 44.1kHz
- Bit Rate: 128-192 kbps
- Channels: Mono or Stereo
- Duration: Varies by dialogue length (typically 2-10 seconds per line)

## Implementation

The audio system is integrated into the chapter framework:

1. **Audio Hook:** `frontend/hooks/chapters/useChapterAudio.ts`
   - Handles audio playback with mute controls
   - Gracefully handles missing files (audio is optional)

2. **Chapter Base:** `frontend/components/chapters/ChapterPageBase.tsx`
   - Automatically plays audio for each dialogue message
   - Maps dialogue index to corresponding audio file

3. **Chapter Constants:** `frontend/constants/chapters/castle{X}/chapter{Y}.ts`
   - Each chapter exports a `CHAPTER{Y}_NARRATION` object
   - Contains arrays of audio paths for each scene

## Adding Audio Files

1. Create audio files following the naming convention
2. Place files in the appropriate castle/chapter folder
3. The system will automatically play them when dialogue appears
4. Missing files won't cause errors - audio is optional

## Voice Acting Guidelines

- **Archim (Castle 1):** Wise, patient mentor voice
- **Sylvan (Castle 2):** Mystical, ethereal tone
- **Marina (Castle 3):** Calm, flowing like water
- **Vex (Castle 4):** Precise, mathematical clarity
- **Astron (Castle 5):** Ancient, cosmic wisdom

## Testing

1. Enable audio in the chapter (unmute button in top bar)
2. Navigate through dialogue to hear narration
3. Check browser console for any audio loading messages
4. Missing files will show optional warnings but won't break gameplay

## Status

✅ Folder structure created
✅ Audio integration complete
⏳ Audio files need to be recorded and added

---

**Note:** All audio files are optional. The game will function perfectly without them, but they greatly enhance the learning experience.
