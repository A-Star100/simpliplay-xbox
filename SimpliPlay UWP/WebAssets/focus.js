document.addEventListener('DOMContentLoaded', () => {
document.addEventListener("keydown", function(e) {
    const focused = document.activeElement;
    if (e.key === "Enter") {
      if (focused) {
        // focus
        if (focused.tagName === "BUTTON") {
          e.preventDefault();
          focused.click()
        }
        // find highlighted btn and focus
        else {
          e.preventDefault();
          focused.focus();
          focused.click();
        }
      }
    }
    if (focused.type === "range") {
      //e.preventDefault();
      focused.focus()
    }
  });
const seekSlider = document.getElementById('seekBar');
const video = document.getElementById('mediaPlayer');
seekSlider.addEventListener('keydown', (e) => {  
    // override player.js slide
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.stopPropagation(); // try to stop any moves in focus
        
        // seek by ourselves
        if (e.key === 'ArrowLeft') { 
            video.currentTime -= 5; 
        } else { 
            video.currentTime += 5; 
        }
        
        e.preventDefault(); // try and preventDefault to stop browser
    }
});
});