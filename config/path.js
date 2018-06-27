module.exports =
{
    build: {
        html: './build/',
        fonts: './build/fonts/',
        img: './build/images/',
        content: './build/images/content/',
        js: './build/js/',
        css: './build/css/'
    },
    src: {
        html: './src/*.pug',
        layout: './src/assets/**/*.pug',
        blocks: ['./src/library/**/*.pug', './src/modules/**/*.pug'],
        fonts: './src/assets/fonts/*.*',
        img: ['./src/library/**/assets/*.*', './src/modules/**/assets/*.*'],
        content: './src/modules/**/assets/content/*.*',
        js: ['./src/assets/**/*.js', './src/library/**/*.js', './src/modules/**/*.js'],
        plugins: './src/externals/**/*.js',
        scss: ['./src/assets/**/_*.scss', './src/library/**/_*.scss', './src/modules/**/_*.scss'],
        css: './src/externals/_*.scss',
        sprite: './src/assets/symbols/*.svg',
        include: './src/assets/templates/*.html'
    },
    watch: {
        html: './src/*.pug',
        blocks: ['./src/library/**/*.pug', './src/modules/**/*.pug'],
        scss: './src/**/_*.scss',
        js: './src/**/*.js'
    },
    replace: {
        build:'./build/',
        src:'./src/',
        temp: './src/temp/',
        pug: './src/temp/blocks'
    },
    clean: './build'
};