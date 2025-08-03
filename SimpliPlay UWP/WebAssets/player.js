document.addEventListener('DOMContentLoaded', () => {

    const dialogOverlay = document.getElementById('dialogOverlay');
    const chooseFileBtn = document.getElementById('chooseFileBtn');
    const enterUrlBtn = document.getElementById('enterUrlBtn');
    const fileInput = document.getElementById('fileInput');
    const mediaPlayer = document.getElementById('mediaPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const seekBar = document.getElementById('seekBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const volumeBar = document.getElementById('volumeBar');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const autoplayCheckbox = document.getElementById('autoplayCheckbox');
    const loopCheckbox = document.getElementById('loopCheckbox');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const urlDialogOverlay = document.getElementById('urlDialogOverlay');
    const settingsDialogOverlay = document.getElementById('settingsDialogOverlay');
    const urlInput = document.getElementById('urlInput');
    const submitUrlBtn = document.getElementById('submitUrlBtn');
    const cancelUrlBtn = document.getElementById('cancelUrlBtn');
    const ccBtn = document.getElementById('ccBtn'); // CC button
    const volumeBtn = document.getElementById("volumeBtn")
    const subtitlesOverlay = document.getElementById('subtitlesOverlay');
    const subtitlesInput = document.getElementById('subtitlesInput');
    const submitSubtitlesBtn = document.getElementById('submitSubtitlesBtn');
    const cancelSubtitlesBtn = document.getElementById('cancelSubtitlesBtn');
    const customControls = document.getElementById('customControls');
    let hls = null
    let player = null

    // Update media volume when the slider is moved
  volumeBar.addEventListener("input", function () {
    mediaPlayer.volume = volumeBar.value;
  });

  // Sync slider with media volume (in case it's changed programmatically)
  mediaPlayer.addEventListener("volumechange", function () {
    volumeBar.value = mediaPlayer.volume;
    if (mediaPlayer.muted || mediaPlayer.volume === 0) {
      volumeBtn.textContent = "🔇";
    } else {
      volumeBtn.textContent = "🔊";
    }
  });

// Function to add subtitles dynamically (e.g., after URL input)
function addSubtitles(url) {
  // Remove any existing subtitle tracks
  const existingTracks = mediaPlayer.getElementsByTagName('track');
  for (let track of existingTracks) {
    track.remove();
  }

  // Create a new track for subtitles
  const track = document.createElement('track');
  track.kind = 'subtitles';
  track.label = 'English';
  track.srclang = 'en';
  track.src = url;

  // Append the new track
  mediaPlayer.appendChild(track);

  // Optionally, enable subtitles by default
  track.track.mode = 'showing'; // Enable subtitles by default
}

// Handle submit subtitle URL
function clearSubtitles() {
  const tracks = mediaPlayer.getElementsByTagName('track');
  for (let i = tracks.length - 1; i >= 0; i--) {
    tracks[i].remove();
  }
}

// Use this function when a new video is loaded

submitSubtitlesBtn.addEventListener('click', () => {
  const subtitleUrl = subtitlesInput.value;
  if (subtitleUrl) {
    addSubtitles(subtitleUrl);
    subtitlesOverlay.style.display = 'none';
    subtitlesInput.value = '';
  }
});



    let autoplayEnabled = true;
    let loopEnabled = false;

    // Handle submit URL button in custom dialog
submitUrlBtn.addEventListener('click', () => {
  let url = urlInput.value;

  // Check if URL is a valid URL and doesn't contain "http" or "https"
  if (url && !url.startsWith('http') && !url.startsWith('https')) {
    // Assuming it's a URL and needs the protocol added
    url = 'http://' + url;  // You can also choose 'https://' if preferred
  }
  

  if (url) {
    clearSubtitles();
    if (hls !== null) {
      hls.destroy()
      hls = null
    }
    if (player !== null) {
      player.reset()
      player = null
    }
    if (url.toLowerCase().endsWith('.m3u8') || url.toLowerCase().endsWith('.m3u')) {
      // HLS stream
      if (Hls.isSupported()) {
        mediaPlayer.style.display = 'flex'; // Hide the native video player
        hls = new Hls();
        mediaPlayer.pause();
        hls.loadSource(url);
        hls.attachMedia(mediaPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          if (autoplayCheckbox.checked) {
            mediaPlayer.play();
          }
          urlInput.value = "";
          customControls.style.display = 'flex';
        });
      } else {
        alert("Your device doesn't support HLS.");
        customControls.style.display = 'flex';
        urlInput.value = "";
      }
    } else if (url.toLowerCase().endsWith('.mpd')) {
      mediaPlayer.style.display = 'flex'; // Hide the native video player
      mediaPlayer.pause();
      player = dashjs.MediaPlayer().create();
      // MPEG-DASH stream
      player.initialize(mediaPlayer, url, true);
      customControls.style.display = 'flex';
      urlInput.value = "";
      if (autoplayCheckbox.checked) {
        mediaPlayer.play();
      }
    } else {
      mediaPlayer.style.display = 'flex'; // Hide the native video player
      mediaPlayer.pause();
      mediaPlayer.src = url;
      customControls.style.display = 'flex';
      urlInput.value = "";
      if (autoplayCheckbox.checked) {
        mediaPlayer.play();
      }
    }
    urlDialogOverlay.style.display = 'none';
    dialogOverlay.style.display = 'none';
  }
});



    // Handle CC button to show subtitle modal
    ccBtn.addEventListener('click', () => {
      subtitlesOverlay.style.display = 'block';
    });



    // Handle cancel subtitle modal
    cancelSubtitlesBtn.addEventListener('click', () => {
      subtitlesOverlay.style.display = 'none';
    });


    // Show the dialog on page load
    window.onload = function () {
      dialogOverlay.style.display = 'block';
    };



    // Handle "Choose a File" button
    chooseFileBtn.addEventListener('click', () => {
      fileInput.click();
    });

    mediaPlayer.addEventListener("volumechange", function () {
      if (mediaPlayer.muted) {
        volumeBtn.textContent = "🔇"
      } else if (mediaPlayer.volume === 0) {
        volumeBtn.textContent = "🔊"
      }
    });
    


   
    let previousObjectURL = null; // Store the last Object URL

    fileInput.addEventListener('change', (event) => {
      if (hls !== null) {
        hls.destroy()
        hls = null
      }
      if (player !== null) {
        player.reset()
        player = null
      }
        const file = event.target.files[0];
        if (!file) return;
    
        clearSubtitles(); // Remove any previously loaded subtitles
    
        // Revoke the previous Object URL if it exists
        if (previousObjectURL) {
            URL.revokeObjectURL(previousObjectURL);
        }
    
        // Create a new Object URL for the selected file
        const fileURL = URL.createObjectURL(file);
        mediaPlayer.src = fileURL;
        mediaPlayer.load();
        if (autoplayCheckbox.checked) {
        mediaPlayer.play();
        }
    
        // Store the new Object URL for future cleanup
        previousObjectURL = fileURL;
    
        // Hide dialog after selecting a file
        dialogOverlay.style.display = 'none';
    });
    

    // Handle "Enter a URL" button
    enterUrlBtn.addEventListener('click', () => {
      urlDialogOverlay.style.display = 'block';
    });

    // Handle cancel button in URL dialog
    cancelUrlBtn.addEventListener('click', () => {
      urlDialogOverlay.style.display = 'none';
    });

    // Handle custom play/pause button
playPauseBtn.addEventListener('click', () => {
  if (mediaPlayer.paused) {
    mediaPlayer.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    mediaPlayer.pause();
    playPauseBtn.textContent = 'Play';
  }
});

// Sync button with the video player when it is paused manually
mediaPlayer.addEventListener('pause', () => {
  playPauseBtn.textContent = 'Play';
});

// Sync button with the video player when it is played
mediaPlayer.addEventListener('play', () => {
  playPauseBtn.textContent = 'Pause';
});

// Volume button toggling mute/unmute
volumeBtn.addEventListener('click', () => {
  if (mediaPlayer.muted || mediaPlayer.volume == 0) {
    mediaPlayer.muted = false;
    volumeBtn.textContent = '🔊'; // Unmute icon
  } else {
    mediaPlayer.muted = true;
    volumeBtn.textContent = '🔇'; // Mute icon
  }
});


// Handle URL input on Enter key
urlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitUrlBtn.click();
  }
});

// Handle Subtitles input on Enter key
subtitlesInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitSubtitlesBtn.click();
  }
});

// Handle URL submission


    // Update seek bar and time display
    mediaPlayer.addEventListener('timeupdate', () => {
      seekBar.max = mediaPlayer.duration || 0;
      seekBar.value = mediaPlayer.currentTime;
      const current = formatTime(mediaPlayer.currentTime);
      const total = formatTime(mediaPlayer.duration);
      timeDisplay.textContent = `${current} / ${total}`;
    });

    // Seek media
    seekBar.addEventListener('input', () => {
      mediaPlayer.currentTime = seekBar.value;
    });

    // Handle volume
    volumeBar.addEventListener('input', () => {
      mediaPlayer.volume = volumeBar.value;
      if (volumeBar.value == 0 || mediaPlayer.volume == 0) {
        volumeBtn.textContent = "🔇";
      } else {
        volumeBtn.textContent = "🔊";
      }
    });

    // Show settings panel
    settingsBtn.addEventListener('click', () => {
      settingsDialogOverlay.style.display = 'block';
      settingsPanel.style.display = 'block';
    });

    saveSettingsBtn.addEventListener('click', () => {
      autoplayEnabled = autoplayCheckbox.checked;
      loopEnabled = loopCheckbox.checked;
      mediaPlayer.autoplay = autoplayEnabled;
      mediaPlayer.loop = loopEnabled;
      
      const controlsEnabled = document.getElementById('controlsCheckbox').checked;
      const colorsEnabled = document.getElementById('colorsCheckbox').checked;
      mediaPlayer.controls = controlsEnabled;
      if (colorsEnabled) {
        mediaPlayer.style.filter = "contrast(1.1) saturate(1.15) brightness(1.03)";
      } else {
        mediaPlayer.style.filter = "";
      }

      settingsPanel.style.display = 'none';
      settingsDialogOverlay.style.display = 'none';
    });
    

// End of first event listener for DOM content loaded

    // Format time
    function formatTime(time) {
      const minutes = Math.floor(time / 60) || 0;
      const seconds = Math.floor(time % 60) || 0;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    const showDialogBtn = document.getElementById('showDialogBtn');
    const hideDialogBtn = document.getElementById('hideDialogBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // Show dialog
    showDialogBtn.addEventListener('click', () => {
      dialogOverlay.style.display = 'block';
    });

    // Hide dialog
    hideDialogBtn.addEventListener('click', () => {
      dialogOverlay.style.display = 'none';
    });

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        mediaPlayer.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });


// End of code and second event listener for DOM content loaded

});
