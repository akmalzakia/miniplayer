# Important

To access the website, you need to be registered to Spotify and the website dashboard.
For anyone that want to access the website, please contact me at zakiasmara11@gmail.com.


# Known Bugs / Unimplemented Features

## [SOLVED] Play Playlist when Webplayer and Spotify inactive (no active devices)

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

Expected : not active

Example : Playing track A in playlist B, track A in its artist page shows active state

Reason : Cannot hit play API with a request containing artist API and track offset since play API with offset only supported for album and playlist context

## [Web API bug] Song search results sometimes contains duplicated items

Expected : Items returned from the API should be unique

Reason : Same query, different results. The API fetched from the app have different results from the api fetched in the official web api documentation / postman, even though both have the same url.

Example: When inspecting the network activity in the browser, Song X that should have been in a query with offset of 40 and limit of 20 was returned earlier in a query with offset of 20 and limit of 20. Song X replaced song B in the first query, making song B unavailable. Meanwhile, fetching the first query in postman or spotify api docs returned the actual response with song B available.

This bug caused the app to raise a duplicate key error when rendering track list. Current workaround is to append uuid to the item id to make the key unique
