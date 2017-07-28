
document.addEventListener('DOMContentLoaded', function () {

    var _lock = 4;

    axios.get('/header.html')
        .then(function (res) {
            document.getElementById('header').innerHTML = res.data;

            var last_known_scroll_position = 0;
            var ticking = false;
            var header = document.getElementById('header');
            var parallax = document.getElementById('parallax');
            var profile = document.getElementById('profile');

            function checkScroll(scroll_pos) {
                if(header.clientHeight == 0) {
                    header = document.getElementById('header');
                    parallax = document.getElementById('parallax');
                    profile = document.getElementById('profile');
                }

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

            _lock--;
            if(_lock == 0){
                initialize_app();
            }

        });
    axios.get('/content.html')
        .then(function (res) {
            document.getElementById('content').innerHTML = res.data;

            _lock--;
            if(_lock == 0){
                initialize_app();
            }
        });
    axios.get('/footer.html')
        .then(function (res) {
            document.getElementById('footer').innerHTML = res.data;

            _lock--;
            if(_lock == 0){
                initialize_app();
            }
        });
    axios.get('/resume.html')
        .then(function (res) {
            document.getElementById('resume').innerHTML = res.data;

            _lock--;
            if(_lock == 0){
                initialize_app();
            }
        });

    function initialize_app(){
        console.log('[imadx.github.io] initializing app...')
        var app = new Vue({
            el: '#app',
            data: {
                visible_resume: true,
            },
            methods: {
                showResume: function(){
                    console.log('[imadx.github.io] switching to resume...')
                    this.visible_resume = true;
                },
                hideResume: function(){
                    console.log('[imadx.github.io] switching to homepage...')
                    this.visible_resume = false;
                }
            },
            watch: {
            }
        })
            
    }

});