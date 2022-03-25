# vue-url-replace-loader

> webpack url 替换工具 (前缀替换)
> support webpack 4.x (deprecated)

## usage

> 默认参数配置
```
DEFAULT_OPTIONS = {
    prefix: '', // url前缀 | String
    skip: undefined, // 忽略检查的文件
      // 参数: Array<Regexp>| (source: string) => boolean
      // 注意: 传入数组时, 只要有一项匹配到,即跳出替换
    replace: undefined // 自定义替换方法
      // 参数 (url: string) => string | 返回替换好的url
}
```
### vue使用示例
```
// 在 vue.config.js 中,加入如下规则
/** webpack配置 */
exports.configureWebpack = {
    module: {
        rules: [
            {
                test: /\.less$/i, // 匹配规则
                use: [
                    {
                        loader: 'url-replace-loader',
                        options: {
                            prefix: 'http://cdn.com'
                        }
                    }
                ]
            }
        ]
    }
}

```


### 基础配置

      ```
      /** webpack配置 */
      exports.configureWebpack = {
          module: {
              rules: [
                  {
                      test: /\.less$/i,
                      use: [
                          'less-loader',
                          {
                              loader: path.resolve('plugins/url-prefix-loader.js'),
                              options: {
                                  prefix: 'http://www.jiaoyihu.com'
                              }
                          }
                      ]
                  }
              ]
          }
      }
      ```

### 自定义替换方法
    ```
      {
          loader: path.resolve('plugins/url-prefix-loader.js'),
          options: {
            replace(path) {
                return `http://cdn` + path
            }
          }
      }
    ```
### 自定义忽略文件
    ```
      // 如,在文件头加上 `// @skip` 注释, 匹配到就跳过
      {
          loader: path.resolve('plugins/url-prefix-loader.js'),
          options: {
            skip:[/\/\/ @skip/]
          }
      }
      // 或者自定义匹配方法
      {
          loader: path.resolve('plugins/url-prefix-loader.js'),
          options: {
            skip:(source) => /\/\/ @skip/.test(source)
          }
      }
    ```
