# Example Project Folder

Add these files before opening your PR:

- `project.json`
- `demo.mp4` (5-7 seconds, looping clip)
- `thumbnail.jpg` (screenshot)
- Your source files

You can generate the MP4 clip with FFmpeg:

```bash
ffmpeg -i recording.mp4 -t 7 -an -movflags +faststart demo.mp4
```
