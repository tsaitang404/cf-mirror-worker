# Cloudflare Worker 万能镜像代理

本项目实现了类似 nginx 的反向代理，支持多种语言包管理器、系统镜像和工具镜像，部署于 Cloudflare Workers。

## 主要功能
- HTTP/HTTPS 自动跳转
- 首页自定义 HTML，展示换源命令和使用说明
- 语言类镜像：PyPI, NPM, Maven, Gradle, Composer, Cargo, RubyGems
- 系统类镜像：CentOS, CentOS Stream, Ubuntu, Debian, Alpine, Archlinux, Fedora
- 容器类镜像：Docker, DockerHub, GCR, Quay, Kubernetes
- 工具类镜像：Homebrew, Anaconda, Flutter
- 保留常用代理头部，支持 CORS
- 代码块语法高亮显示

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
- NPM 镜像：`https://mirror.tsaitang.workers.dev/language/npm/`
- Maven 镜像：`https://mirror.tsaitang.workers.dev/language/maven/`
- Docker 镜像：`https://mirror.tsaitang.workers.dev/container/docker/`
- CentOS 镜像：`https://mirror.tsaitang.workers.dev/system/centos/7.9.2009/os/x86_64/`
- Ubuntu 镜像：`https://mirror.tsaitang.workers.dev/system/ubuntu/`
- Alpine 镜像：`https://mirror.tsaitang.workers.dev/system/alpine/`

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
# 临时使用
pip install -i https://mirrors.tsaitang.com/language/pypi/simple/ package_name

# 设为默认
pip config set global.index-url https://mirrors.tsaitang.com/language/pypi/simple/
```

### npm 换源
```sh
# 设置registry
npm config set registry https://mirrors.tsaitang.com/language/npm/

# 临时使用
npm install --registry=https://mirrors.tsaitang.com/language/npm/ package_name
```

### Docker 镜像配置
```json
# /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirrors.tsaitang.com/container/docker/"]
}
```

### Ubuntu apt 配置
```sh
# 替换 sources.list
sudo sed -i 's@http://.*archive.ubuntu.com@https://mirrors.tsaitang.com/system/ubuntu@g' /etc/apt/sources.list
sudo sed -i 's@http://.*security.ubuntu.com@https://mirrors.tsaitang.com/system/ubuntu@g' /etc/apt/sources.list
```

## 注意事项
- Cloudflare Worker 可能被部分源站（如 PyPI, Docker Hub）限制，建议优先用于静态资源镜像。
- 代理流量受 Cloudflare Worker 免费额度限制（每天 100,000 请求）。
- 所有请求都通过 Cloudflare 的 HTTPS 加密传输，确保安全。
- 如需扩展其他镜像源，请在 `proxyMap` 中添加规则。
- 优先使用 SNI（Server Name Indication）以提高与目标服务器的兼容性。
- 部分源站会检查 Origin 和 Referer，worker 已配置相应头信息。

## 自定义部署
如果要部署自己的镜像代理，请注意以下事项：
1. 修改 HTML 模板中的域名为你自己的域名
2. 根据需要调整 proxyMap 中的镜像源配置
3. 考虑调整 worker 的资源限制，以适应更高的流量需求

## 技术细节
- 使用 Cloudflare Worker 实现 HTTP 请求的转发与响应处理
- 添加适当的代理头信息（X-Forwarded-For, X-Real-IP 等）
- 支持 SNI 以解决部分源站的 TLS 握手问题
- 实现灵活的路由匹配规则，支持自定义路径前缀
- 使用 highlight.js 提供代码块语法高亮

## 贡献与反馈
如有建议或问题，欢迎提交 Issue 或 PR。也欢迎添加更多镜像源支持和改进代码。
