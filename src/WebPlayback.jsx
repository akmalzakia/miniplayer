import axios from 'axios';
import React, { useState, useEffect } from 'react';

const track = {
  name: "",
  album: {
    images: [
      { url: "" }
    ]
  },
  artists: [
    { name: "" }
  ]
}

function WebPlayback({client_id, onTokenRefreshed}) {
  const [currentPlayer, setPlayer] = useState(null)

  const [is_paused, setPaused] = useState(false)
  const [is_active, setActive] = useState(false)
  const [current_track, setTrack] = useState(track)

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js"
    script.async = true;

    const  fetchRefreshToken = async () => {
      const refreshToken = localStorage.getItem('refresh_token')
      const url = "https://accounts.spotify.com/api/token";
      let accessToken = ''
      await axios.post(url, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        accessToken = res.data.access_token
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        onTokenRefreshed(accessToken)
      }).catch(err => {
        console.log("error refresh :", err)
      })
      return accessToken
    }

    document.body.appendChild(script)

    function onSDKReady() {
      if (currentPlayer) return

      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { 
          cb(fetchRefreshToken());
         },
        volume: 0.5
      });

      setPlayer(player)

      function onDeviceOnline(device_id) {
        console.log('Ready with device ID', device_id)
      }

      function onDeviceOffline(device_id) {
        console.log('Device ID has gone offline', device_id)
      }

      function onStateChange(state) {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        console.log("state : ", state)

        player.getCurrentState().then(state => {
          (!state) ? setActive(false) : setActive(true)
        });
      }

      player.addListener('ready', onDeviceOnline)
      player.addListener('not_ready', onDeviceOffline)
      player.addListener('player_state_changed', onStateChange);
      player.connect()
    }

    window.onSpotifyWebPlaybackSDKReady = onSDKReady
    return () => {
      window.onSpotifyWebPlaybackSDKReady = null
    }
  }, [])

  if (!is_active) {
    return (
      <>
        <div className='container'>
          <div className='main-wrapper'>
            <b>Instances not active. Transfer your playback using your Spotify app</b>
          </div>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <img src={current_track.album.images[0].url}
              className='now-playing__cover'></img>
            <div className='now-playing__side'>
              <div className='now-playing__name'>
                {current_track.name}
              </div>
              <div className='now-playing__artist'>
                {current_track.artists[0].name}
              </div>

              <button className='btn-spotify' onClick={() => { currentPlayer.previousTrack() }}>
                &lt;&lt;
              </button>
              <button className='btn-spotify' onClick={() => { currentPlayer.togglePlay() }}>
                {is_paused ? "PLAY" : "PAUSE"}
              </button>
              <button className='btn-spotify' onClick={() => { currentPlayer.nextTrack() }}>
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }


}

export default WebPlayback