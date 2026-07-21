document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".banner-btn");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.classList.add("hover");
    });

    button.addEventListener("mouseleave", () => {
      button.classList.remove("hover");
    });
  });
});
