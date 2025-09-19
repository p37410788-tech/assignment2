let video;
let playPauseBtn;
let playPauseImg;
let audioMuteBtn;
let audioMuteImg;
let playerContainer;
let likeImg;
let likeBtn;
let progressBar;

function init() {
  video = document.querySelector("#custom-video-player");
  playPauseBtn = document.querySelector("#play-pause-btn");
  playPauseImg = document.querySelector("#play-pause-img");
  audioMuteBtn = document.querySelector("#audio-mute-btn");
  audioMuteImg = document.querySelector("#audio-mute-img");
  playerContainer = document.querySelector(".media-player");
  likeImg = document.getElementById("like-img");
  likeBtn = document.getElementById("like-btn");
  progressBar = document.querySelector("#progress-bar-fill");

  if (video) {
    // Remove native controls (we use custom UI). Guarded to avoid errors.
    try {
      video.removeAttribute("controls");
    } catch (e) {
      // older browsers or odd environments may throw; ignore safely
      console.warn("Could not remove native controls:", e);
    }

    // Update progress periodically
    video.addEventListener("timeupdate", updateProgressBar);

    // keep UI in sync with native play/pause events
    video.addEventListener("play", () => {
      if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    });
    video.addEventListener("pause", () => {
      if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
    });

    // ensure replay button appears when ended (if you show it)
    video.addEventListener("ended", function () {
      const replayBtn = document.getElementById("replay-btn");
      if (replayBtn) replayBtn.style.display = "inline-block";
      if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/50/replay.png"; // reset play icon
    });
  }

  initPlaylist();
  initComments();
}

function togglePlayPause() {
	if (!video) return;
	if (video.paused || video.ended) {
    video.play();
    if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    video.pause();
    if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

//Toggle audio mute/unmute. Icons move between mute and high volume.
//The audience of music videos anticipates rapid sound adjustment, so the feedback of the state is crucial.
function toggleAudioMute() {
	if (!video) return;
	video.muted = !video.muted;
	if (video.muted) {
    if (audioMuteImg) audioMuteImg.src = "https://img.icons8.com/ios-glyphs/50/mute--v1.png";
    if (audioMuteBtn) audioMuteBtn.setAttribute("aria-pressed", "true");
    if (audioMuteBtn) audioMuteBtn.title = "Unmute";
  } else {
    if (audioMuteImg) audioMuteImg.src = "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
    if (audioMuteBtn) audioMuteBtn.setAttribute("aria-pressed", "false");
    if (audioMuteBtn) audioMuteBtn.title = "Mute";
  }
}
// Replay video from start. Replay button can be accessed when hidden, at the end of playback.
//This is appropriate when it comes to music videos in which people may repeat songs repeatedly.
function replayVideo() {
  if (!video) return;
  video.currentTime = 0;       // jump to start
  video.play();                // play again
  if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png"; // update play icon
  const replayBtn = document.getElementById("replay-btn");
  if (replayBtn) replayBtn.style.display = "none"; // hide replay button again
}

// Skip controls: go to the beginning or the end of the track.
//Music videos are known to rewatch favorite parts.
function skipToStart() {
  if (!video) return;
  video.currentTime = 0;  // jump to beginning
}
function skipToEnd() {
  if (!video || !video.duration) return;
  video.currentTime = video.duration - 0.1; // jump just before the end
  video.pause(); // stop playback at the end
  if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/50/replay.png";	
}
function rewind10() {
  if (!video) return;
  // subtract 10 seconds, clamp at 0
  video.currentTime = Math.max(0, video.currentTime - 10);
}
function forward10() {
  if (!video || !video.duration) return;
  // add 10 seconds, clamp at video duration
  video.currentTime = Math.min(video.duration, video.currentTime + 10);
}
//Fullscreen enhances immersion which is specifically applicable to music videos.
function goFullscreen() {
	if (playerContainer && playerContainer.requestFullscreen) {
    playerContainer.requestFullscreen();
  }
}

//Heart (Like) button: additional interactive element selected in music video context.
//Switches between an outline and filled heart, imitating the social platforms.
//Gives direct visual feedback and more interaction.
function toggleLike() {
	if (!likeBtn) return;
	const isLiked = likeBtn.getAttribute("data-liked") === "true";
	if (isLiked) {
    // if already liked, unlike it
    if (likeImg) likeImg.src = "https://img.icons8.com/ios/50/hearts--v1.png"; // empty heart
    likeBtn.setAttribute("data-liked", "false");
  } else {
    // if not liked, set liked state
    if (likeImg) likeImg.src = "https://img.icons8.com/color/48/hearts.png"; // filled heart
    likeBtn.setAttribute("data-liked", "true");
  }
}

function updateProgressBar() {
  if (!video || !progressBar || !video.duration || isNaN(video.duration)) return;
  const value = (video.currentTime / video.duration) * 100;
  progressBar.style.width = value + "%";
}

/* -------------------------
   Playlist Feature (added)
   -------------------------
   Allows users to switch between music videos easily.
   Each list item updates the <video> source and plays automatically.
*/
function initPlaylist() {
  const playlist = document.getElementById("playlist");
  if (!playlist) return;
  const playlistItems = playlist.querySelectorAll("li");
  playlistItems.forEach((item) => {
    item.addEventListener("click", function () {
      // reset active states
      playlistItems.forEach((el) => el.classList.remove("active"));
      this.classList.add("active");

      // load new video source
      const newSrc = this.getAttribute("data-src");
      const srcElem = video ? video.querySelector("source") : null;
      if (srcElem && newSrc) {
        srcElem.src = newSrc;
        video.load();
        video.play().catch(()=>{}); // play may be blocked until user gesture in some browsers; swallow the error
        if (playPauseImg) playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
      }
    });
  });
}

function initComments() {
  const commentForm = document.getElementById("comment-form");
  const commentList = document.getElementById("comment-list");
  if (!commentForm || !commentList) return;

  commentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const commentInput = document.getElementById("comment-text");
    if (!usernameInput || !commentInput) return;

    const username = usernameInput.value.trim();
    const commentText = commentInput.value.trim();

    if (username && commentText) {
      const newComment = document.createElement("li");
      // simple sanitization to avoid raw HTML injection
      const safeName = escapeHtml(username);
      const safeText = escapeHtml(commentText).replace(/\n/g,'<br>');
      newComment.innerHTML = `<strong>${safeName}:</strong> ${safeText}`;
      commentList.appendChild(newComment);

      // reset form
      commentForm.reset();
    }
  });
}

function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


const progressContainer = document.getElementById("progress-bar");

if (progressContainer) {
  let isDragging = false;

  function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1);
    if (video && video.duration) {
      video.currentTime = percentage * video.duration;
    }
  }

  progressContainer.addEventListener("click", (e) => {
    seek(e);
  });

  progressContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    seek(e);
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      seek(e);
    }
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
}
document.addEventListener("DOMContentLoaded", init);