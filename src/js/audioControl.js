

// 音频播放和暂停   切歌

(function ($, root) {
    // play  pause  getAudio
    function AudioManager () {  // 构造函数的开头 一般是大写  

        // h5要复习

        this.audio = new Audio();  // 创建一个音频对象  h5复习
        // this.src = src;            // 路径
        this.status = 'pause';     // audio的默认状态 暂停  status别写错了
    };

    AudioManager.prototype = {
        play: function () {
            this.audio.play();
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio: function (src) {
            console.log(src);
            this.audio.src = src;
            // 加载音频
            this.audio.load();      
        },
        //音乐跳转到当前播放时间
        playTo: function (time) {
            this.audio.currentTime = time;  //audio.currentTime当前播放时间
        }   
    }

    root.audioManager = new AudioManager();    //把对象暴露出来，原型链的方法也可以获取到


})(window.Zepto, window.player || (window.player = {}))


