$("#slider").roundSlider({
    radius: 150,
    value: 0,
    width: 4,
    circleShape: "half-bottom",
    lineCap: "round",
    mouseScrollAction: true,
    handleSize: "+16",
    showTooltip: false,
    sliderType: "min-range",
    animation: false
});



// end thay đổi thành range

// App
var playlist = $('.playlist')
var audio = document.querySelector('#audio')
var cd = document.querySelector('.player__cd-img')
var cdWidth = cd.offsetWidth
var cdImg = document.querySelector('.player__cd-img img')
var playBtn = $('.btn-play')
var pauseBtn = $('i.ti-control-pause')
var songName = document.querySelector('.player__info-song-name')
var singer = document.querySelector('.player__info-singer-name')
var btnVolume = $('.btn-volume')
var volumRange = document.querySelector('#volume')
var currentSong = document.querySelector('[data-name*="funnel-chart-percent"]')
app = {
    currentIndex: 0,
    isLoop: false,
    isVolume: false,
    songs: [
        {
            img: './img/song-1.jpg',
            singer: 'Patti',
            songName: 'Say you love me',
            path: './music/say-you-love-me.mp3'
        },
        {
            img: './img/song-2.jpg',
            singer: 'Jason Mraz',
            songName: 'I\'m yours',
            path: './music/im-yours.mp3'
        },
        {
            img: './img/song-3.jpg',
            singer: 'Enrique Iglesias',
            songName: 'Bailando',
            path: './music/bailando.mp3'
        },
        {
            img: './img/song-4.jpg',
            singer: 'Enrique Iglesias',
            songName: 'El perdon',
            path: './music/elperdon.mp3'
        },
        {
            img: './img/song-5.jpg',
            singer: 'The Marias',
            songName: 'Baby one more time',
            path: './music/baby-one-more-time.mp3'
        },
        {
            img: './img/song-6.jpg',
            singer: 'Sting',
            songName: 'Shape of my heart',
            path: './music/shape-of-my-heart.mp3'
        }
    ],
    render: function() {
        // playlist.html('<li>Nhựt</li>')
        var html = app.songs.map(function (v,i) {
            return `
            <li class="playlist-item ${i === app.currentIndex ? 'active' : ''}"  data-index='${i}'>
                <div class="playlist-item-info">
                    <h3 class="playlist-item-song-name">${v.songName}</h3>
                    <h4 class="playlist-item-singer-name">${v.singer}</h4>
                </div>
                <div class="playlist-item-play">
                    <div class="btn btn-play-2">
                        <i class="ti-control-play"></i>
                    </div>
                </div>
            </li>
            `
        })
        playlist.html(html)
    },
    handleEvent: function () {
        // click show playlist
        $('.player__hambur').click(function() {
            playlist.css('transform','translateX(0)')
        })

        playlist.click(function() {
            playlist.css('transform','translateX(-100%)')
        })
        
        // Cd quay
        var cd = document.querySelector('.player__cd-img')
        var cdRotate = cd.animate([{transform: 'rotate(360deg)'}], {duration: 10000, iterations: Infinity});
        cdRotate.pause()
        // click play
            $('.ti-control-play').click(function() {
                playBtn.addClass('active')
                audio.play()
                cdRotate.play()
            })
        // Khi click pause
        pauseBtn.click(function() {
            audio.pause()
            cdRotate.pause()
            playBtn.removeClass('active')
        })

        // Khi click thay đổi thanh range
        $("#slider").change(function() {
            var obj = $("#slider").data("roundSlider");
            var testvalue = obj.getValue(1);
            audio.currentTime = Math.floor((audio.duration/100)*testvalue)
        })
        
        // Khi thanh range thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                $("#slider").roundSlider({
                    value: (audio.currentTime/audio.duration)*100
                })
            }
        }
        // Chỉnh volume
        volumRange.onchange = function() {
            audio.volume = volumRange.value*0.01
        },
        volumRange.onblur = function() {
            audio.volume = volumRange.value*0.01
        }
        // bấm next 
        $('.btn-next').click(function() {
            app.nexSong()
            app.loadCurrentSong()
            audio.play()
            playBtn.addClass('active')
            app.render()
        })
        // bấm prev 
        $('.btn-prev').click(function() {
            app.prevSong()
            app.loadCurrentSong()
            audio.play()
            app.render()
        })
        // audio on ended
        audio.onended = function() {
            if(app.isLoop) {
                audio.loop = true
            }else {
                audio.loop = false
                app.nexSong()
                app.loadCurrentSong()
                audio.play()
            }
        }
        // bấm loop
        $('.player__cd-loop').click(function() {
            app.isLoop = !app.isLoop
            console.log(app.isLoop)
            if(app.isLoop) {
                audio.loop = true
                $('.player__cd-loop').addClass('active')
            }else {
                audio.loop = false
                $('.player__cd-loop').removeClass('active')
            }
        })
        // Khi click nhạc trong danh sách
        $('.playlist').click(function(e) {
            playlistItem = e.target.closest('.playlist-item:not(.active)')
            if(playlistItem) {
                app.currentIndex = Number(playlistItem.dataset.index)
                app.render()
                app.loadCurrentSong()
                audio.play()
                playBtn.addClass('active')
            }
        })
    },
    nexSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }  
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }  
    },
    loadCurrentSong: function () {
        var indexOf = app.songs[app.currentIndex]  
        audio.src = indexOf.path
        cdImg.src = indexOf.img
        songName.textContent = indexOf.songName
        singer.textContent = indexOf.singer
    },
    start: function() {
        this.render()
        this.handleEvent()
        this.loadCurrentSong()
        audio.volume = 0.2
    }
}

app.start()

