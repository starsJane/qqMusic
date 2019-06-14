(function ($, root) {
    function Control(len) {    //看到构造函数（首字母一般大写）就要想到原型链
        // this --> Control

        //有两个属性
        
        this.index = 0;

        this.len = len;

    }

    //面向对象继承
    Control.prototype = {
        prev: function () {
            // if (this.index == 0) {
            //     this.index = len - 1;
            // } else {
            //     this.index --;
            // }
            // return this.index;

            return this.getIndex(-1);   //索引由getIndex()决定
        },
        next: function () {
            // if (this.index == len -1) {
            //     this.index = 0;
            // } else {
            //     this.index ++;
            // }
            // return this.index;

            return this.getIndex(1);  
        },

        
        // 上面的if else 可以用这种方法
        // 计算改变后的索引

        getIndex: function (val) {
            //当前对应索引
            var index = this.index; 
            //数据总长度
            var len = this.len;
            var curIndex = (index + val + len) % len;
            this.index = curIndex;

            // (0 + -1 + 3) % 3 = 2   一开始点prev
            // (2 + -1 + 3) % 3 = 1
            // (0 + 1 + 3) % 3 = 1    一开始点next
            

            //返回改变后的索引
            return curIndex;
        }

    }

    // root.controlIndex = new Control();  //别忘了暴露接口
    root.controlIndex = Control;  //暴露构造函数（用getIndex优化后）


})(window.Zepto, window.player || (window.player = {}))


// 打印以下：
// root.controlIndex   打印出来是对象

// root.controlIndex.prev()   2
// root.controlIndex.prev()   1
// root.controlIndex.prev()   0
// root.controlIndex.next()   1
// root.controlIndex.next()   2
// root.controlIndex.next()   0