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


## Track is showing active state even though played in different context in artist page
 Expected: not active
 Example : Playing track A in playlist B, track A in its artist page shows active state
 Reason : Cannot hit play API with a request containing artist API and track offset since play API with offset only supported for album and playlist context
