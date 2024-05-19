# Known Bugs / Unimplemented Features

## Play Playlist when Webplayer and Spotify inactive (no active devices)

Returned a 404 Response

```json
{
  "error": {
    "status": 404,
    "message": "Player command failed: No active device found",
    "reason": "NO_ACTIVE_DEVICE"
  }
}
```

Possible Fix:  
Catch the error in `play()` function in [Playlist.tsx](./src/pages/Playlist/Playlist.tsx#L106)  
Then, show a modal / popup to display the error message
