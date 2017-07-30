let app;

window.addEventListener('resize', function(){
    app.window_width = window.innerWidth;
});

document.addEventListener('DOMContentLoaded', function () {

    let _lock = 4;

    axios.get('/header.html')
    .then(function (res) {
        document.getElementById('header').innerHTML = res.data;

        let last_known_scroll_position = 0;
        let ticking = false;
        let header = document.getElementById('header');
        let parallax = document.getElementById('parallax');
        let profile = document.getElementById('profile');
        let notification_area = document.getElementById('notification_area');

        function checkScroll(scroll_pos) {
            if(header.clientHeight == 0) {
                header = document.getElementById('header');
                parallax = document.getElementById('parallax');
                profile = document.getElementById('profile');
                notification_area = document.getElementById('notification_area');
            }

            if (scroll_pos < header.clientHeight) {
                parallax.style.transform = 'translateY(' + scroll_pos*0.5 + 'px)';
                profile.style.transform = 'translateY(' + scroll_pos*0.4 + 'px)';
                profile.style.opacity =  1 -(scroll_pos/header.clientHeight);



            } 

            if(scroll_pos > header.clientHeight + 250) {
                if(notification_area.classList.contains('not-visible')){
                    notification_area.classList.remove('not-visible');
                }
            } else {
                if(!notification_area.classList.contains('not-visible')){
                    notification_area.classList.add('not-visible');
                }
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

    loadContent('/resume.html', 'resume');
    loadContent('/footer.html', 'footer');
    loadContent('/content.html', 'content');

    function loadContent(url,id){
        axios.get(url)
        .then(function (res) {
            document.getElementById(id).innerHTML = res.data;

            _lock--;
            if(_lock == 0){
                initialize_app();
            }
        });
    }

    function initialize_app(){

        console.log('[imadx.github.io] initializing app...')

        let skillComponent = Vue.component('skill-component', {
            template: '\
                <div class="skill-component-div" :title="\'Relative skill measure for \' + skill + \' as of upwork.com\'" @mouseover="animate(1000)">\
                    <svg viewBox="0 0 200 200">\
                        <circle fill="none" stroke="#eee" stroke-width="10" cx="100"  cy="100" r="85"/>\
                        <path :id="skill" fill="none" stroke="#00a859" stroke-width="20" :d="arc_d"/>\
                    </svg>\
                    <img :src="getImageSource(image)" :width="image_width" :height="image_height" :alt="skill">\
                    <span class="score">{{score}}<small>/5.00</small></span>\
                    <span class="ranking" :class="formatRanking(ranking)" :title="ranking + \' as of upWork.com\' ">{{ranking}}</span>\
                    <span class="date">{{date}}</span>\
                </div>\
            ',
            props: ['skill', 'image', 'imagewidth', 'imageheight', 'score', 'ranking', 'date'],
            data: function(){
                return {
                    arc_d : this.describeArc(100, 100, 85, 0, 360*(this.score/5.0)),
                    image_height: undefined,
                    image_width: undefined,

                    animating: false,
                    _random: 0
                }
            },
            methods: {
                getImageSource: function(_img){
                    return '/img/icons/' + _img;
                },
                formatRanking: function(_ranking_txt){
                    return _ranking_txt.replace(' ', '').replace('Top', 'class').replace('%','');
                },
                animate: function(_duration) {

                    if(this.animating){
                        return;
                    }
                    this._random = Math.floor(Math.random()*8);
                    this.animating = true;
                    let vm = this;
                    let start = performance.now();

                    requestAnimationFrame(function animate(time) {
                        let timeFraction = (time - start) / _duration;
                        if (timeFraction > 1) timeFraction = 1;

                        let progress = vm.timingFunction(timeFraction);
                        vm.setAnimations(progress);

                        if (timeFraction < 1) {
                          requestAnimationFrame(animate);
                        } else {
                            vm.animating = false;
                        }

                    });
                },
                setAnimations: function(_progress){
                    let _score = this.score;
                    let _angle = 360 * (_score * ((1.05-Math.abs(_progress-0.5)/10))/5.0);
                    if(_angle > 359) _angle = 359;

                    this.arc_d = this.describeArc(100, 100, 85, 0, _angle);
                },
                timingFunction: function(t){
                    let _ret = (1-t) * (1-t) * (1-t) * Math.sin(t*(this._random + 3));
                    return _ret;
                },

                // arc drawing methods are an adapted variation of https://stackoverflow.com/a/24569190/4513747
                polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
                    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

                    return {
                        x: centerX + (radius * Math.cos(angleInRadians)),
                        y: centerY + (radius * Math.sin(angleInRadians))
                    };
                },
                // arc drawing methods are an adapted variation of https://stackoverflow.com/a/24569190/4513747
                describeArc: function(x, y, radius, startAngle, endAngle){
                    let start = this.polarToCartesian(x, y, radius, endAngle);
                    let end = this.polarToCartesian(x, y, radius, startAngle);

                    let arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

                    let d = [
                        "M", start.x, start.y, 
                        "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
                    ].join(" ");

                    return d;       
                }
            },
            mounted: function(){

                console.log('[imadx.github.io] skill-component created...', this.skill)

                if(this.imagewidth >= this.imageheight) {
                    this.image_width = 80;
                } else {
                    this.image_height = 70;
                }
            }
        })
        app = new Vue({
            el: '#app',
            components: [skillComponent],
            data: {
                visible_resume: true,
                resume_downloaded: false,
                projects_hidden: true,

                window_width: window.innerWidth,

                competitions: [],
                projects: [],
                skills_list: {},
                skills_tested_list: [],
                skills_preferred: [],
                experience: []

            },
            methods: {
                showResume: function(){
                    console.log('[imadx.github.io] switching to resume...')
                    this.visible_resume = true;
                },
                hideResume: function(){
                    console.log('[imadx.github.io] switching to homepage...')
                    this.visible_resume = false;
                },
                showHiddenProjects: function(){
                    this.projects_hidden = false;
                },
                hideHiddenProjects: function(_hidden){
                    if(_hidden){
                        this.projects_hidden = true;
                    }
                },
                setDownloaded: function(){
                    console.log('[imadx.github.io] cv downloaded..')
                    this.resume_downloaded = true;
                },
                getAllData: function(){

                    let vm = this;

                    vm.getEntity('/data/data_competitions.json', 'competitions');
                    vm.getEntity('/data/data_projects.json', 'projects');
                    vm.getEntity('/data/data_skills_list.json', 'skills_list');
                    vm.getEntity('/data/data_skills_tested_list.json', 'skills_tested_list');
                    vm.getEntity('/data/data_skills_preferred.json', 'skills_preferred');
                    vm.getEntity('/data/data_experience.json', 'experience');

                },
                getEntity: function(_url, _local_var){
                    let vm = this;

                    axios.get(_url).then(function(res){
                        vm[_local_var] = res.data;
                    }).catch(function(err){
                        console.error('[imadx.github.io] error in retrieving data.')
                        console.error(err);
                    });

                },
                isCompactTimeline: function(){
                    return this.window_width<980;
                },
                isTooCompactTimeline: function(){
                    return this.window_width<768;
                }
            },
            computed: {
                filtered_projects: function(){
                    let _projects = this.projects;

                    if(!this.projects_hidden){
                        return _projects;
                    }

                    return _projects.filter(_proj => !_proj.hidden);
                }
            },
            watch: {
            },
            created: function(){
                this.getAllData();
            }
        })
            
    }

});