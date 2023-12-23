(function () {
  const burgerMenu = document.querySelector(".header__burger");
  const nav = document.querySelector(".header__nav");

  burgerMenu.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
})();
