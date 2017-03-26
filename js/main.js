document.addEventListener('DOMContentLoaded', function () {
    axios.get('/header.html')
        .then(function (res) {
            document.getElementById('header').innerHTML = res.data;

            var last_known_scroll_position = 0;
            var ticking = false;
            var header = document.getElementById('header');
            var parallax = document.getElementById('parallax');
            var profile = document.getElementById('profile');

            function checkScroll(scroll_pos) {
                if (scroll_pos < header.clientHeight) {
                    parallax.style.transform = 'translateY(' + scroll_pos*0.5 + 'px)';
                    profile.style.transform = 'translateY(' + scroll_pos*0.4 + 'px)';
                    profile.style.opacity =  1 -(scroll_pos/header.clientHeight);
                }
            }
            window.addEventListener('scroll', function (e) {
                last_known_scroll_position = window.scrollY;
                if (!ticking) {
                    window.requestAnimationFrame(function () {
                        checkScroll(last_known_scroll_position);
                        ticking = false;
                    });
                }
                ticking = true;
            });

        });
    axios.get('/content.html')
        .then(function (res) {
            document.getElementById('content').innerHTML = res.data;
        });
    axios.get('/footer.html')
        .then(function (res) {
            document.getElementById('footer').innerHTML = res.data;
        });


});