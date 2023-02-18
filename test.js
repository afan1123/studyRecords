function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timerTimeout(() => {
      fn();
    }, delay);
  };
}

function throttle(fn, delay) {
  let timer = null;
  return;
}
