// OTHER MISC. FUNCTIONS
export const helper = {
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  toBoolean(str) {
    return str === "true";
  },

  checkScreenWidth(inputWidth) {
    const screenWidth = window.innerWidth;

    if (screenWidth < inputWidth) {
      return true;
    } else {
      return false;
    }
  },
};
