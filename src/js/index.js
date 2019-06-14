//上节课的
// function a(num) {
//     debugger;
//     num ++;
//     return num;
// }
// console.log(a(1));


//这个是主js文件, 在这个文件调用其它js代码   要自己敲敲敲敲敲敲敲敲敲敲敲敲


var root = window.player;
// console.log(root)   //{render: ƒ}

// var nowIndex = 0;    //索引封装了
var dataList;
var len;
var audio = root.audioManager;

var control;

var timer;
var duration = 0;


function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            // console.log(data);      
            len = data.length;  //当前信息的长度

            control = new root.controlIndex(len);

            dataList = data;    //给dataList全局变量赋data值, 让其它函数也能拿到数据
            root.render(data[0]);    //data[0]是对象, 第一条数据(初始化显示第一条)
            root.pro.renderAllTime(data[0].duration);

            audio.getAudio(data[0].audio);  //相当于root.audioManager.getAudio(src)

            duration = data[0].duration;
            bindEvent();
            bindTouchEvent();
        },
        error: function () {
            console.log("error")
        } //数据请求失败时做的事
    })
}


//点击向前向后按钮事件
function bindEvent() {

    //增加自定义事件play:change, 切歌，回调function
    $('body').on('play:change', function (e, index) {
        console.log('change');
        root.render(dataList[index]);
        root.pro.renderAllTime(dataList[index].duration);
        duration = dataList[index].duration;

        audio.getAudio(dataList[index].audio);
        if (audio.status == 'play') {
            // rotated(0);   //切歌从0开始转   这样只是传了个形参 
        
            audio.play();
            root.pro.start(0);
        } else {
            root.pro.update(0);
        }

        //切换的新歌曲的旋转片瞬间变成0deg，并且是没有过渡效果的
        $('.img-box').attr('data-deg', 0);

        $('.img-box').css({
            'transform': 'rotateZ(' + 0 + 'deg)',
            'transition': 'none'  
        })

    })

    $('.prev').on('click', function () {
        // 索引也封装一个函数
        // if (nowIndex == 0) {
        //     nowIndex = len - 1;
        // } else {
        //     nowIndex --;
        // }
        // var i = root.controlIndex.prev();

        //用getIndex优化代码后
        var i = control.prev();

        // 重复代码被上面自定义函数代替
        // root.render(dataList[i]);    // 重新渲染
        // audio.getAudio(dataList[i].audio);

        // 切换歌曲之后，如果当前状态是播放状态，让音频拿到切换的歌曲src后播放；可以W注释一下

        // if(audio.status == 'play') {         
        //     audio.play();
        // }

        $('body').trigger('play:change', i);    //trigger() 方法触发被选元素的指定事件类型

    });
    $('.next').on('click', function () {
        // 索引封装了
        // if (nowIndex == len - 1) {          // 2
        //     nowIndex = 0;
        // } else {
        //     nowIndex ++;
        // }
        //  var i = root.controlIndex.next();

        var i = control.next();

        // 重复代码被上面自定义函数代替
        // root.render(dataList[i]);    // 重新渲染
        // audio.getAudio(dataList[i].audio);

        // if(audio.status == 'play') {         
        //     audio.play();
        // }


        $('body').trigger('play:change', i);

    })
    $('.play').on('click', function () {
        // console.log(new audio());
        if (audio.status == 'pause') {
            audio.play();
            root.pro.start();

            var deg = $('.img-box').attr('data-deg');
            console.log(deg);   //打印0
            rotated(deg);   

        } else {
            audio.pause();
            root.pro.stop();
            clearInterval(timer);
        }
        $('.play').toggleClass('playing');
    })
}

//移动端没有鼠标，拖动事件用touch 和 mouse事件 类似
function bindTouchEvent() {
    var left = $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    $('.spot').on('touchstart', function (e) {
        root.pro.stop();
    }).on('touchmove', function (e) {
        console.log(e);
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        // console.log(per);

        if (per >= 0 && per < 1) {
            root.pro.update(per);   
        }

    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        var curTime = per * duration;

        //进度条长度限制
        if (per >= 0 && per < 1) {
            audio.playTo(curTime);
            audio.play();

            //防止拖动完播放又重新开始
            root.pro.start(per);

            //按钮也变化
            $('.play').addClass('playing');
        }        
    })
}

// 音频结束后触发的事件，自动跳转下一个音频
$(audio.audio).on('ended', function () {
    $('.next').trigger('click');   //自动触发
})


function rotated(deg) {
    clearInterval(timer);   //防止定时器叠加（防止暂停之后又往前转一下）
    // var deg = 0;
    deg = +deg;   //把字符串转换成数字
    timer = setInterval(function () {
        deg += 2;
        $('.img-box').attr('data-deg', deg);    

        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': 'all 1s ease-out'  //ease-out减速  ease-in加速缓冲不好
        });

    }, 200);
}


getData("../mock/data.json");





//接下来模块化开发：每个功能都封装一个只控制自己的js文件，并且对外暴露接口给其它模块使用

// 信息+图片渲染到页面上          封装一个
// 点击按钮                 直接实现
// 音频播放和暂停                 封装一个
// 前后切歌                      封装一个
// 图片旋转                 直接实现


// 列表切歌                    封装一个
// 进度条运动与拖拽             封装一个

