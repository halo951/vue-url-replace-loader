const loaderUtils = require('loader-utils')

const DEFAULT_OPTIONS = {
    prefix: '', // url前缀, 如果设置了replace方法, 忽略prefix
    skip: undefined, // 忽略检查的文件,可用[Regexp], (source) => boolean 判断
    replace: undefined // 自定义替换方法,格式 (url) => string
}

/**
 * 替换css中url
 * @param {string} content
 * @param {function} replacePathFactory
 */
const replacePathInCSS = (content, replacePathFactory) => {
    const hasQuote = /^\s*('|")/
    return content.replace(/(url\()(\s*'|\s*")([^']+?)('|")(\))/gi, (substring, start, quote1, path, quote2, last) => {
        let ret = replacePathFactory(path)
        if (hasQuote.test(ret) && hasQuote.test(quote1)) quote1 = quote2 = ''
        return (start + quote1 + ret + quote2 + last).replace(/(\w)(\/2)(\w)/g, '$1/$3')
    })
}
/**
 * 默认替换路径方法
 * @param {*} path
 */
const defaultReplacePathFactory = (prefix) => {
    return (path) => {
        if (prefix && !/^(\/\/|:\/\/|http)/.test(path)) {
            const replacedUrl = `${prefix.replace(/\/$/, '')}/${path.replace(/^[./|/]/, '')}`
            return replacedUrl
        }
        return path
    }
}
/**
 * 源码替换工具
 * @param {*} source
 * @param {*} options
 */
const handler = (source, options) => {
    // merge options
    const { prefix, skip, replace } = { ...DEFAULT_OPTIONS, ...options }
    // 检查必要参数
    if (!prefix) return source
    // 忽略替换的文件
    if (skip) {
        if (typeof skip === 'function' && skip(source)) return source
        if (skip instanceof Array && skip.find((rule) => rule.test(source))) return source
    }
    // 获取url替换方法
    const replaceFactory = replace || defaultReplacePathFactory(prefix)
    // 替换url
    source = replacePathInCSS(source, replaceFactory)
    // 返回结果
    return source
}

/**
 * @description webpack url前缀替换loader
 *
 * @author Libin
 * @date 2020-10-14 19:55
 * - 注意
 * 不晓得webpack获取文件名是怎么获取的,所以对于需要忽略替换的文件,要在文件内加入标识,并匹配
 * - 参考资料
 * https://github.com/a951055/miniprogram-ts-develop-frame/blob/master/tasks/builder/plugins/uglify-less-plugin.js
 * https://github.com/DevRickSon/css-url-prefix-loader
 */
module.exports = function(source, map) {
    this.cacheable()
    const options = loaderUtils.getOptions(this)
    source = handler(source, options)
    this.callback(null, source, map)
}
