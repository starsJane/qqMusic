
var gulp = require("gulp");

//gulp中插件应用    下载插件--->取到插件--->应用插件
//压缩html  image   js

var htmlClean = require("gulp-htmlclean");    //取插件 压缩html
var imageMin = require("gulp-imagemin");    //压缩图片
var uglify = require("gulp-uglify")         //压缩js

//去掉js中的调试语句    console.log()  还有一些 debugger调试语句 
var debug = require("gulp-strip-debug");

//将less装换成css
var less = require("gulp-less");
//压缩css
var cleanCss = require("gulp-clean-css");
//给有css3的添加前缀    依赖两个插件postcss   autoprofixer   这里前缀是-webkit-transform，同时transform留在压缩的css文件夹里
var postCss = require("gulp-postCss");
var autoprefixer = require("autoprefixer");


//开启服务器
var connect = require("gulp-connect");


//判断当前环境变量，开发环境不压缩，生产环境时压缩
var devMod = process.env.NODE_ENV == "development";
// $ export NODE_ENV=development	设置环境变量为开发环境
console.log(devMod);


//以变量形式存 src 和 dist文件，好修改
var folder = {
    src : "src/",
    dist: "dist/"
}

gulp.task("html", function () {
    var page = gulp.src(folder.src + "html/*")  //取src文件夹下的html文件夹下的所有文件
        .pipe(connect.reload());    //文件有变化时重新刷新(改变dist文件的内容，实际上不会在浏览器刷新)
        if(!devMod) {   
            page.pipe(htmlClean())
        }//判断是否为开发环境
        //.pipe(htmlClean())          //对文件流进行处理，在输出文件前压缩下
        page.pipe(gulp.dest(folder.dist + "html/"))    //输出文件到 dist/html/
})
gulp.task("image", function () {
    gulp.src(folder.src + "image/*")  
        .pipe(imageMin())      
        .pipe(gulp.dest(folder.dist + "image/")) 
})
gulp.task("css", function () {
    var page = gulp.src(folder.src + "css/*")  
        .pipe(connect.reload())     //文件有变化时重新刷新
        .pipe(less())   //将less转化成css
        .pipe(postCss([autoprefixer()]))  //给css3属性添加前缀
        if(!devMod) {
            page.pipe(cleanCss())   //压缩css
        } 
        page.pipe(gulp.dest(folder.dist + "css/"))  
})
gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")  
        .pipe(connect.reload())     //文件有变化时重新刷新
        
        if(!devMod) {
            page.pipe(debug())  //去掉调试语句
                .pipe(uglify()) //压缩
        }        
        page.pipe(gulp.dest(folder.dist + "js/")) //输出
})


//开启服务器任务
gulp.task("server", function () {
    connect.server({
        port: "8888",      //修改端口号，防止冲突
        livereload: true     //自动刷新  
    });
})

//监视文件， 实现自动刷新， 执行相应的创建的任务
gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"])  //回调函数"html"
    gulp.watch(folder.src + "css/*", ["css"]) 
    gulp.watch(folder.src + "js/*", ["js"]) 
    //在文件变动后执行的一个或者多个通过 gulp.task() 创建的 task 的名字
})

gulp.task("default", ["html", "css", "js", "image", "server", "watch"]); //回调
//包含任务列表的数组，这些任务会在当前任务default默认任务运行之前完成。
// Starting 'html'...
// Finished 'html' after 20 ms
// .....
// Starting 'default'...
// Finished 'default' after 150 μs



//创建任务
// gulp.task('default', function() {   //default是默认任务名，一进来就会运行
//     console.log(123);
//     // 将默认的任务代码放在这
// });


//less--->自动添加css3前缀--->压缩--->css文件       一次in一次out，只有头和尾是文件，中间过程是流

// 四个api
// gulp.src()       输出（Emits）符合所提供的匹配模式（glob）或者匹配模式的数组（array of globs）的文件。
// gulp.dest()      现的任能被 pipe 进来，并且将会写文件。并且重新输出（emits）所有数据，因此可以将它 pipe 到多个文件夹。如果某文件夹不存在，将会自动创建它。
// gulp.task()      定义一个使用 Orchestrator 实务（task）
// gulp.watch()     监视文件，并且可以在文件发生改动时候做一些事情。



// 如果想用模块化开发，最好用Webpack做前端自动化构建工具
// gulp缺点：配置目录来打包，会把目录下面的所有文件都打包
// 不管有没有被引用，webpack则是根据依赖的


//项目代码少 可以用gulp
//项目代码多 用webpack   主要用这个