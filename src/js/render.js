// 实现页面渲染 img+info+like-btn


// 封闭作用域,避免和其它模块变量冲突
(function ($, root) {   //$代表window.Zepto，root代表window.player

    // function jQuery() {

    // } 
    // window.$ = window.jQuery = jQuery;  
    //这种方式暴露jQuery，引用$相当于调用jQuery（这里暴露在自定义的window属性上,window.Zepto）

    // function render () {
    //     console.log('render');
    // }    
    // root.render = render;   //给player新增属性即render


    function renderImg(src) {
        var img = new Image();
        img.src = src;
        img.onload = function () {
            $('.img-box img').attr('src', src)
            root.blurImg(img, $('body'));
        }
    }

    function renderInfo(info) {
        // var str =''
        var str = '<div class="song-name">'+ info.song +'</div>\
        <div class="singer-name">'+ info.singer +'</div>\
        <div class="ablum-name">'+ info.album +'</div>';

        $('.song-info').html(str);
    }

    function renderIsLike(like) {
        if(like) {
            $('.like').addClass('liking');
        }else {
            $('.like').removeClass('liking');
        }
    }

    //暴露执行上面三个函数
    root.render = function (data) {
        console.log(data);
        renderImg(data.image);
        renderInfo(data);
        renderIsLike(data.isLike);
    }



})(window.Zepto, window.player || (window.player = {}));





// window.$ 一般是用了某个库，其中的自定义对象名字叫$，现在最常见的是jQuery

//前面参数表中的$是函数的形式参数，最后的括号是调用函数，以window.Zepto为实际参数传入。

//Zepto无法知晓全局域下的$这个变量是否已被占用，但在Zepto内部又想用$作为简写，所以干脆把Zepto传进来(就不用每次都去全局下找！！！！！)，并用$作参数名，就不必担心外部变量$指向什么东西了

//window.player || (window.player = {}) 是容错处理，如果有window.player就取这个，没有就在window上创建player空对象，再把接口暴露出去


// window = {
//     player: {

//     }
// }