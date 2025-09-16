const video = document.querySelector("#custom-video-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const audioMuteBtn = document.querySelector("#audio-mute-btn");
const audioMuteImg = document.querySelector("#audio-mute-img");
const playerContainer = document.querySelector(".media-player");
const likeImg = document.getElementById("like-img");
const likeBtn = document.getElementById("like-btn");
const progressBar = document.querySelector("#progress-bar-fill");
video.removeAttribute("controls");
// playPauseBtn.addEventListener("click", togglePlayPause);
video.addEventListener("timeupdate", updateProgressBar);
function togglePlayPause() {
	if (video.paused || video.ended) {
    video.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    video.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

//Toggle audio mute/unmute. Icons move between mute and high volume.
//The audience of music videos anticipates rapid sound adjustment, so the feedback of the state is crucial.
function toggleAudioMute() {
	video.muted = !video.muted;
	if (video.muted) {
    audioMuteImg.src = "https://img.icons8.com/ios-glyphs/50/mute--v1.png";
    audioMuteBtn.setAttribute("aria-pressed", "true");
    audioMuteBtn.title = "Unmute";
  } else {
    audioMuteImg.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
    audioMuteBtn.setAttribute("aria-pressed", "false");
    audioMuteBtn.title = "Mute";
  }
}
// Replay video from start. Replay button can be accessed when hidden, at the end of playback.
//This is appropriate when it comes to music videos in which people may repeat songs repeatedly.
function replayVideo() {
  video.currentTime = 0;       // jump to start
  video.play();                // play again
  playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png"; // update play icon
  document.getElementById("replay-btn"); // hide replay button again
}

// Skip controls: go to the beginning or the end of the track.
//Music videos are known to rewatch favorite parts.
video.addEventListener("ended", function() {
  document.getElementById("replay-btn");
  playPauseImg.src = "https://img.icons8.com/ios-glyphs/50/replay.png"; // reset play icon
});
function skipToStart() {
  video.currentTime = 0;  // jump to beginning
}
function skipToEnd() {
  if (video.duration) {
    video.currentTime = video.duration - 0.1; // jump just before the end
    video.pause(); // stop playback at the end
	playPauseImg.src = "https://img.icons8.com/ios-glyphs/50/replay.png";	
  }
// Use rewind and forwards with 10 seconds each to navigate.
//This reflects the expectations of the user in YouTube.
}function rewind10() {
  // subtract 10 seconds, clamp at 0
  video.currentTime = Math.max(0, video.currentTime - 10);
}
function forward10() {
  if (video.duration) {
    // add 10 seconds, clamp at video duration
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }
}
//Fullscreen enhances immersion which is specifically applicable to music videos.
function goFullscreen() {
	if (playerContainer.requestFullscreen) {
    playerContainer.requestFullscreen();
  }
}

//Heart (Like) button: additional interactive element selected in music video context.
//Switches between an outline and filled heart, imitating the social platforms.
//Gives direct visual feedback and more interaction.
function toggleLike() {
	const isLiked = likeBtn.getAttribute("data-liked") === "true";
	if (isLiked) {
    // if already liked, unlike it
    likeImg.src = "https://img.icons8.com/ios/50/hearts--v1.png"; // empty heart
    likeBtn.setAttribute("data-liked", "false");
  } else {
    // if not liked, set liked state
    likeImg.src = "https://img.icons8.com/color/48/hearts.png"; // filled heart
    likeBtn.setAttribute("data-liked", "true");
  }
}
function updateProgressBar() {
  const value = (video.currentTime / video.duration) * 100;
  progressBar.style.width = value + "%";
}
