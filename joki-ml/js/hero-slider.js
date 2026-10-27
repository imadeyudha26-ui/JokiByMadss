(function () {
  var IMAGE_DURATION = 4000; // lama foto tampil (ms)

  window.addEventListener('load', function () {
    var root = document.getElementById('heroSlider');
    if (!root) return;

    var slides = root.querySelectorAll('.hslide');
    var dotsBox = document.getElementById('hsDots');
    var current = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'hslider__dot';
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', function () { show(i); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll('.hslider__dot');

    function show(index) {
      clearTimeout(timer);
      slides[current].classList.remove('is-active');
      var oldVideo = slides[current].querySelector('video');
      if (oldVideo) { oldVideo.pause(); oldVideo.onended = null; }

      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });

      var video = slides[current].querySelector('video');
      if (video) {
        video.currentTime = 0;
        var p = video.play();
        if (p && p.catch) p.catch(function () { timer = setTimeout(next, IMAGE_DURATION); });
        video.onended = next;
      } else {
        timer = setTimeout(next, IMAGE_DURATION);
      }
    }

    function next() { show(current + 1); }

    document.getElementById('hsNext').addEventListener('click', next);
    document.getElementById('hsPrev').addEventListener('click', function () { show(current - 1); });

    show(0);
  });
})();