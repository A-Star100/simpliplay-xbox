      document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      const focused = document.activeElement;
      
      if (focused) {
        // If focus is on a button, just click it
        if (focused.tagName === "BUTTON") {
          focused.click();
          e.preventDefault();
        }
        // If focus is on a text input or checkbox, find the highlighted button and click it
        else if (focused.tagName === "INPUT") {
          // You can define which button to click here.
          // For example, the button with id="myButton"
          focused.focus();
        }
      }
    }
  });
