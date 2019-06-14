(function ($, root) {

    // 渲染左右两块时间 进度条运动

    var duration = 0;
    var frameId = null;
    var startTime = null;
    var lastPer = 0;


    // 渲染总时间
    function renderAllTime(time) {  // time 是 dataList[index].duration
        duration = time;    
        time = formatTime(time);
        lastPer = 0;    // 切换歌曲时初始化
        console.log(time);
        // duration = time; 
        // 不要写在这里,下面的requestAnimationFrame(frame)要用,写在这的话duration变成00:00格式了
        $('.all-time').html(time);
        
    }

    //格式化：将 秒 ---》 分：秒
    function formatTime (t) {
        //t为总秒数

        t = Math.round(t);          // per是百分比，会很长；要取整 
        var m = Math.floor(t / 60); // 分钟
        var s = t - m * 60;         // 剩下的秒数

        //判断分和秒是否为两位数
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        return m + ':' + s;
    }

    // 开始计时函数     
    function start (p) {
        lastPer = p === undefined ? lastPer : p;    
        //判断p是否存在即是否拖动，不存在就取lastPer，按点击暂停的进度为基准
        //存在就取传过来的p，用拖动的进度为基准

        // 存储当前点击播放时候的时间戳
        startTime = new Date().getTime();

        // getTime() 返回的是毫秒数,如果要显示日期,需要进行格式化
        function frame () {
            var curTime = new Date().getTime();
            var per = lastPer + (curTime - startTime) / (duration * 1000);  
            //当前歌曲总进度 = 上一段的进度 + 当前段的进度

            console.log(per);   

            //想象长度  
            update(per);

            //隔1秒钟会不准失真，用h5的requestAnimationFrame
            frameId = requestAnimationFrame(frame);   

        }
        frame();
    }


    // (curTime - startTime) / (duration * 1000)这个是小数来着呀；
    // 0 ---> 3   lastPer = 3s   per = 3
    // 4 ---> 9   lastPer = 5s   per = 5
    // 9 ---> 13  lastPer = 4s   per = 4


    // 停止计时函数
    function stop () {
        cancelAnimationFrame(frameId);

        // 保存点击暂停后的进度
        var curTime = new Date().getTime();
        var per = (curTime - startTime) / (duration * 1000);
        lastPer += per;  // 保存到全局上
    
    }


    // 更新当前时间 + 更新进度条
    // 变动的时间占总时间 和 进度条占宽度总的 百分比是一样的
    function update(per) {
        var curTime = per * duration;   
        //duration总秒数的几分之几，就是当前时间  0.65*253=164.45太长了要取整

        curTime = formatTime(curTime); 

        var translateX = (per - 1) * 100 + '%';     //负值  传0时 -100%
        $('.pro-top').css({
            transform: 'translateX('+ translateX +')',
        })

        $('.cur-time').html(curTime);
    }

    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update
    } 

})(window.Zepto, window.player || (window.player = {}))
