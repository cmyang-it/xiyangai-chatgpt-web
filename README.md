# ChatGPT Web
💡**声明**
- 此项目发布于 [GitHub](https://github.com/cmyang-it/xiyangai-chatgpt-web) 和 [Gitee](https://gitee.com/cmyang-it/xiyangai-chatgpt-web)，基于 MIT 协议，免费且作为开源学习使用。并且没有任何形式的卖号、付费服务、讨论群、讨论组等行为。谨防受骗。
- 本开源是在 [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web) 基础上做二次开发；去除了 access_token 调用网页逆向接口。
- 体验地址：https://chat.xiyangai.cn
- 如果项目对您有用，请您给个`⭐`


![Dall-e-3绘图](https://easyimage.cmyang.cn/i/2024/07/16/yyptni.webp)

## 支持功能
- [x] 原 chatgpt web 功能排除了 access_token 逆向ChatGPT接口
- [x] chatgpt web 支持自定义api key
- [X] dall-e-2 dall-e-3 画图
- [X] chatgpt 前端选择模型（openai,gemini pro,claude,混元,月之暗面等等聚合API支持的模型）
- [X] chatgpt 前端支持自定义max tokens
- [X] 支持one-api部署聊天 https://chat.xiyangai.cn/#/?settings={%22key%22:%22sk-abc%22}

## 个人部署
- [x] 只部署支持openai模型和dalle2/3绘画的服务或者部署一个one-api服务
- [x] 选择一个合适的中转商支持多种模型渠道（`openai` `gemini pro` `claude` `混元` `豆包` `通义` `千帆` `月之暗面` 等）
- [x] 中转商推荐 https://api.xiyangai.cn, `一个key` 和 `api接口` 地址，可同时支持 `openai` `gemini pro` `claude` `混元` `豆包` `通义` `千帆` `月之暗面`

![多模型对话](https://easyimage.cmyang.cn/i/2024/07/16/yyaxaj.webp)

## env 变量
| 环境变量 | 说明                           | 默认值                    |docker部署|
| --- |------------------------------|------------------------| --- |
| API_BASE_URL | API 接口地址（可选）                 | https://api.openai.com | ✅ |
| API_KEY | API 密钥（可选）                   | sk-xxxxx               | ✅ |
| API_MODELS | 模型以 `,` 隔开（可选）               | gpt-3.5-turbo          | ✅ |
| API_DISABLE_DEBUG | API调用Debug日志打印，可选            |                        | ✅ |
| AUTH_SECRET_KEY | 访问权限密钥，可选                    |                        | ✅ |
| TIMEOUT_MS | 超时，单位毫秒，可选                   |            100000            | ✅ |
| MAX_REQUEST_PER_HOUR | 每小时最大请求次数，可选，默认无限            |                        | ✅ |
| SOCKS_PROXY_HOST | 和 `SOCKS_PROXY_PORT` 一起时生效，可选 |                        | ✅ |
| SOCKS_PROXY_PORT | 和 `SOCKS_PROXY_HOST` 一起时生效，可选 |                        | ✅ |
| SOCKS_PROXY_USERNAME | 代理用户名，可选                     |                        | ✅ |
| SOCKS_PROXY_PASSWORD | 代理密码，可选                      |                        | ✅ |
| HTTPS_PROXY | 支持 `http`，`https`, `socks5`，可选     |                        | ✅ |

## Docker 部署
- docker run
```bash
docker build -t chatgptweb:latest .  OR docker pull xiyangai/chatgpt-web:latest

docker run -it -d -p 3002:3002 --name chatgptweb --restart=always -e API_BASE_URL=https://api.xiyangai.cn -e API_KEY=sk-xxxxxxx -e API_MODELS=gpt-3.5-turbo,gpt-4-turbo,gpt-4o,gemini-pro,claude-2.0,hunyuan-pro,Doubao-pro,qwen-pro xiyangai/chatgpt-web:latest
```

- docker compose

[DockerHub地址](https://hub.docker.com/repository/docker/xiyangai/chatgpt-web/general)

```bash
version: '3'

services:
  app:
    image: xiyangai/chatgpt-web # 总是使用 latest ,更新时重新 pull 该 tag 镜像即可
    ports:
      - 3002:3002
    environment:
      # 可选
      API_KEY: sk-xxx
      # API接口地址，可选，聚合API接口地址或默认的openai接口地址
      API_BASE_URL: xxx
      # API模型，可选, 使用聚合API时，API支持的对话模型都可
      API_MODELS: gpt-3.5-turbo,gpt-4o,gpt-4-turbo,claude-2.0,gemini-pro
      # 访问权限密钥，可选
      AUTH_SECRET_KEY: xxx
      # 每小时最大请求次数，可选，默认无限
      MAX_REQUEST_PER_HOUR: 0
      # 超时，单位毫秒，可选
      TIMEOUT_MS: 60000
      # Socks代理，可选，和 SOCKS_PROXY_PORT 一起时生效
      SOCKS_PROXY_HOST: xxx
      # Socks代理端口，可选，和 SOCKS_PROXY_HOST 一起时生效
      SOCKS_PROXY_PORT: xxx
      # HTTPS 代理，可选，支持 http，https，socks5
      HTTPS_PROXY: http://xxx:7890
```
![对话模型选择](https://easyimage.cmyang.cn/i/2024/07/16/yyuizi.webp)

## 更多展示
- Dall-e-2
![dall-e-2 show](https://easyimage.cmyang.cn/i/2024/07/16/yyy2vn.webp)
- Dall-e-3
![dall-e-3 show](https://easyimage.cmyang.cn/i/2024/07/16/yz9nx8.webp)
- phone

![手机端模型选择](https://easyimage.cmyang.cn/i/2024/07/16/yzck7t.webp)
![手机端模型选择](https://easyimage.cmyang.cn/i/2024/07/16/yzg4sx.webp)
![手机端模型选择](https://easyimage.cmyang.cn/i/2024/07/16/yzhrqq.webp)

## 最后
如果项目对您有用，请给个 `star` 谢谢！
