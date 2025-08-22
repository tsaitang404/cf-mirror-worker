addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const HTML = `
<html lang="zh-cn">
<head>
<style>
pre {
  background-color: #f6f8fa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  overflow: auto;
}
code.language-shell {
  color: #24292e;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 14px;
  line-height: 1.5;
}
.command-container {
  margin: 20px 0;
  border-left: 4px solid #0366d6;
  padding-left: 10px;
}
</style>
</head>
<body>
<h1>Cloudflare Worker 镜像代理 <span style="font-size:0.7em;">(Universal Mirror Proxy)</span></h1>
<p>本项目支持 PyPI、CentOS、CentOS Stream 等常用镜像源，部署于 Cloudflare Workers。<br>
<em>This project provides reverse proxy for PyPI, CentOS, CentOS Stream and more, powered by Cloudflare Workers.</em></p>
<hr>
<h3>常用路径 / Useful Paths</h3>
<ul>
  <li>PyPI 镜像 / PyPI Mirror: <a href="/language/pypi/simple/pip/">/language/pypi/simple/pip/</a></li>
  <li>NPM 镜像 / NPM Mirror: <a href="/language/npm/">/language/npm/</a></li>
  <li>Maven 镜像 / Maven Mirror: <a href="/language/maven/">/language/maven/</a></li>
  <li>Docker 镜像 / Docker Mirror: <a href="/container/docker/">/container/docker/</a></li>
  <li>CentOS 镜像 / CentOS Mirror: <a href="/system/centos/7.9.2009/os/x86_64/">/system/centos/7.9.2009/os/x86_64/</a></li>
  <li>CentOS Stream 镜像 / CentOS Stream Mirror: <a href="/system/centos-stream/">/system/centos-stream/</a></li>
  <li>Ubuntu 镜像 / Ubuntu Mirror: <a href="/system/ubuntu/">/system/ubuntu/</a></li>
  <li>Alpine 镜像 / Alpine Mirror: <a href="/system/alpine/">/system/alpine/</a></li>
</ul>
<h3>CentOS 换源命令 / CentOS Mirror Switch</h3>
<div class="command-container">
<pre><code class="language-shell"># 进入 yum 源目录 / Enter yum repo directory
cd /etc/yum.repos.d/
# 注释 mirrorlist / Comment out mirrorlist
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
# 替换 baseurl / Replace baseurl
sed -i 's|baseurl=http://.*centos.org|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=https://mirrors.tsaitang.com/system/centos|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*
</code></pre>
</div>

<h3>pip 源设置 / pip Mirror Config</h3>
<div class="command-container">
<pre><code class="language-shell"># 推荐长期配置 / Recommended for persistent use
pip config set global.index-url https://mirrors.tsaitang.com/language/pypi/
# 或写入 ~/.pip/pip.conf / Or add to ~/.pip/pip.conf
[global]
index-url = https://mirrors.tsaitang.com/language/pypi/
</code></pre>
</div>

<h3>临时使用 pip 镜像 / Temporary pip mirror</h3>
<div class="command-container">
<pre><code class="language-shell">pip install -i https://mirrors.tsaitang.com/language/pypi/ package_name
</code></pre>
</div>
<!-- 可引用外部 JS 示例 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.js"></script>
<script>
document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
});
</script>
<details><summary>使用指南 / Usage Guide</summary>
<h3>NPM 镜像使用方法 / How to use NPM Mirror</h3>
<div class="command-container">
<pre><code class="language-shell">npm config set registry https://mirrors.tsaitang.com/language/npm/
# 或者临时使用
npm install --registry=https://mirrors.tsaitang.com/language/npm/ 包名
</code></pre>
</div>

<h3>Maven 镜像使用方法 / How to use Maven Mirror</h3>
<div class="command-container">
<pre><code class="language-xml">&lt;mirror&gt;
  &lt;id&gt;mirror&lt;/id&gt;
  &lt;name&gt;maven mirror&lt;/name&gt;
  &lt;url&gt;https://mirrors.tsaitang.com/language/maven/&lt;/url&gt;
  &lt;mirrorOf&gt;central&lt;/mirrorOf&gt;
&lt;/mirror&gt;
</code></pre>
</div>

<h3>Docker 镜像使用方法 / How to use Docker Mirror</h3>
<div class="command-container">
<pre><code class="language-json">{
  "registry-mirrors": ["https://mirrors.tsaitang.com/container/docker/"]
}
</code></pre>
</div>

<h3>Ubuntu apt 配置 / Ubuntu apt Configuration</h3>
<div class="command-container">
<pre><code class="language-shell"># 替换 sources.list
sudo sed -i 's@http://.*archive.ubuntu.com@https://mirrors.tsaitang.com/system/ubuntu@g' /etc/apt/sources.list
sudo sed -i 's@http://.*security.ubuntu.com@https://mirrors.tsaitang.com/system/ubuntu@g' /etc/apt/sources.list
</code></pre>
</div>

<h3>Alpine apk 配置 / Alpine apk Configuration</h3>
<div class="command-container">
<pre><code class="language-shell"># 替换 repositories
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tsaitang.com\/system\/alpine/g' /etc/apk/repositories
</code></pre>
</div>

<h3>Debian apt 配置 / Debian apt Configuration</h3>
<div class="command-container">
<pre><code class="language-shell"># 替换 sources.list
sudo sed -i 's/deb.debian.org/mirrors.tsaitang.com\/system\/debian/g' /etc/apt/sources.list
</code></pre>
</div>
</details>
<hr>
<details><summary>FAQ / 常见问题</summary>
<ul>
  <li><strong>Q: 为什么有些镜像访问较慢或无法访问？</strong><br>
      A: 部分源站（如 PyPI, Docker Hub）可能限制 Worker 代理，建议优先用于静态资源镜像。</li>
  <li><strong>Q: 有使用限制吗？</strong><br>
      A: 代理流量受 Cloudflare Worker 免费额度限制（每天 100,000 请求）。</li>
  <li><strong>Q: 支持哪些镜像？</strong><br>
      A: 目前支持语言类（PyPI, NPM, Maven等）、系统类（CentOS, Ubuntu, Debian等）、容器类（Docker, GCR等）和工具类（Homebrew, Anaconda等）镜像。</li>
  <li><strong>Q: 如何添加新的镜像源？</strong><br>
      A: 在 <code>proxyMap</code> 数组中添加新规则，指定前缀路径和目标URL。</li>
  <li><strong>Q: 如何部署自己的镜像？</strong><br>
      A: 在 Cloudflare 上注册账号，创建 Worker，复制此代码并修改域名即可部署。</li>
  <li><strong>Q: 有SSL/TLS支持吗？</strong><br>
      A: 是的，所有请求都通过 Cloudflare 的 HTTPS 加密传输。</li>
  <li>For more details, see <a href="https://github.com/tsaitang404/cf-mirror-worker">GitHub</a>.</li>
</ul>
</details>
<small><a href="https://github.com/tsaitang404/cf-mirror-worker">GitHub</a></small>
</body></html>
`;

const proxyMap = [
  // 语言类镜像源
  { prefix: '/language/pypi/', target: 'https://pypi.org/simple', host: 'pypi.org', sni: true },
  { prefix: '/language/npm/', target: 'https://registry.npmjs.org', host: 'registry.npmjs.org', sni: true },
  { prefix: '/language/maven/', target: 'https://repo1.maven.org/maven2', host: 'repo1.maven.org', sni: true },
  { prefix: '/language/gradle/', target: 'https://services.gradle.org', host: 'services.gradle.org', sni: true },
  { prefix: '/language/composer/', target: 'https://packagist.org', host: 'packagist.org', sni: true },
  { prefix: '/language/cargo/', target: 'https://crates.io', host: 'crates.io', sni: true },
  { prefix: '/language/rubygems/', target: 'https://rubygems.org', host: 'rubygems.org', sni: true },
  
  // 系统类镜像源
  { prefix: '/system/centos/', target: 'http://vault.centos.org', host: 'vault.centos.org' },
  { prefix: '/system/centos-stream/', target: 'http://mirror.stream.centos.org', host: 'mirror.stream.centos.org' },
  { prefix: '/system/ubuntu/', target: 'http://archive.ubuntu.com', host: 'archive.ubuntu.com' },
  { prefix: '/system/debian/', target: 'http://deb.debian.org', host: 'deb.debian.org' },
  { prefix: '/system/alpine/', target: 'http://dl-cdn.alpinelinux.org', host: 'dl-cdn.alpinelinux.org' },
  { prefix: '/system/archlinux/', target: 'https://mirrors.edge.kernel.org/archlinux', host: 'mirrors.edge.kernel.org' },
  { prefix: '/system/fedora/', target: 'https://download.fedoraproject.org', host: 'download.fedoraproject.org', sni: true },
  
  // 容器/虚拟化类镜像
  { prefix: '/container/docker/', target: 'https://registry-1.docker.io', host: 'registry-1.docker.io', sni: true },
  { prefix: '/container/dockerhub/', target: 'https://hub.docker.com', host: 'hub.docker.com', sni: true },
  { prefix: '/container/gcr/', target: 'https://gcr.io', host: 'gcr.io', sni: true },
  { prefix: '/container/quay/', target: 'https://quay.io', host: 'quay.io', sni: true },
  { prefix: '/container/k8s/', target: 'https://k8s.gcr.io', host: 'k8s.gcr.io', sni: true },
  
  // 工具类镜像
  { prefix: '/tool/homebrew/', target: 'https://brew.sh', host: 'brew.sh', sni: true },
  { prefix: '/tool/anaconda/', target: 'https://repo.anaconda.com', host: 'repo.anaconda.com', sni: true },
  { prefix: '/tool/flutter/', target: 'https://storage.googleapis.com/flutter_infra_release', host: 'storage.googleapis.com', sni: true }
];

async function handleRequest(request) {
  const url = new URL(request.url);

  // HTTP 跳转到 HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }

  // 首页展示 HTML
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(HTML, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 代理分发
  for (const rule of proxyMap) {
    if (url.pathname.startsWith(rule.prefix)) {
      // 拼接目标 URL
      const targetUrl = rule.target + url.pathname.slice(rule.prefix.length) + url.search;
      return await proxy(request, targetUrl, rule);
    }
  }

  // 未匹配路径，返回 404
  const notFoundHTML = `<!DOCTYPE html><html><body><h2>404 Not Found</h2><p>路径未匹配任何镜像规则。</p></body></html>`;
  return new Response(notFoundHTML, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// 代理函数
async function proxy(request, target, extraHeaders = {}) {
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('Host', extraHeaders.host);
  reqHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
  // 追加 X-Forwarded-For
  const realIP = request.headers.get('CF-Connecting-IP') || '';
  const forwardedFor = request.headers.get('X-Forwarded-For') || '';
  reqHeaders.set('X-Forwarded-For', forwardedFor ? `${forwardedFor}, ${realIP}` : realIP);
  reqHeaders.set('X-Real-IP', realIP);
  reqHeaders.set('X-Forwarded-Proto', 'https');
  // SNI/Origin
  if (extraHeaders.sni) {
    reqHeaders.set('Origin', `https://${extraHeaders.host}`);
  }
  const init = {
    method: request.method,
    headers: reqHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    redirect: 'manual'
  };
  try {
    const response = await fetch(target, init);
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    // 读取 body 内容
    let body;
    // 尝试以 text 方式读取，二进制内容自动 fallback
    try {
      body = await response.text();
    } catch {
      body = await response.arrayBuffer();
    }
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (e) {
    // 可选：输出错误日志到控制台
    // console.error('Proxy Error:', e);
    return new Response('Proxy Error', { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
