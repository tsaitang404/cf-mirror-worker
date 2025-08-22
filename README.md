# Cloudflare Worker 万能镜像代理

本项目实现了类似 nginx 的反向代理，支持 PyPI、CentOS、CentOS Stream 等常用镜像源，部署于 Cloudflare Workers。

## 主要功能
- HTTP/HTTPS 自动跳转
- 首页自定义 HTML，展示换源命令和使用说明
- 支持 PyPI 镜像代理：`/language/pypi/`
- 支持 CentOS 镜像代理：`/system/centos/`
- 支持 CentOS Stream 镜像代理：`/system/centos-stream/`
- 保留常用代理头部，支持 CORS

## 目录结构
```
cf-mirror-worker.js   # Worker 主代码
wrangler.toml         # Cloudflare Worker 配置
README.md             # 使用文档
```

## 部署方法
1. 安装 wrangler：
   ```sh
   npm install -g wrangler
   ```
2. 配置 wrangler.toml（已提供示例）
3. 部署 Worker：
   ```sh
   npx wrangler deploy
   ```

## 主要路径说明
- 首页：`https://mirror.tsaitang.workers.dev/`
- PyPI 镜像：`https://mirror.tsaitang.workers.dev/language/pypi/simple/pip/`
- CentOS 镜像：`https://mirror.tsaitang.workers.dev/system/centos/7.9.2009/os/x86_64/`
- CentOS Stream 镜像：`https://mirror.tsaitang.workers.dev/system/centos-stream/`

## 换源示例
### CentOS/RPM 换源
```sh
cd /etc/yum.repos.d/
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|baseurl=http://.*centos.org|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=https://mirrors.tsaitang.com/system/centos|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*
```

### pip 换源
```sh
pip install -i https://mirrors.tsaitang.com/language/pypi/ package_name
```

## 注意事项
- Cloudflare Worker 可能被部分源站（如 PyPI）限制，建议优先用于 CentOS 镜像等静态资源。
- 代理流量受 Cloudflare Worker 免费额度限制。
- 如需扩展其他镜像源，请在 `proxyMap` 中添加规则。

## 贡献与反馈
如有建议或问题，欢迎提交 Issue 或 PR。
