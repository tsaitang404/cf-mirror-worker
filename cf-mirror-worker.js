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
.mirror-section {
  margin: 20px 0;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 15px;
  background-color: #f6f8fa;
}
.mirror-section h3 {
  margin-top: 0;
  color: #0366d6;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 8px;
}
.mirror-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
.mirror-item {
  padding: 8px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
.mirror-item:hover {
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}
.footer {
  margin-top: 40px;
  padding: 20px 0 10px 0;
  text-align: center;
  color: #586069;
  font-size: 15px;
  background: none;
}
.footer-icons {
  margin-bottom: 10px;
}
.footer-icons img {
  vertical-align: middle;
  margin: 0 8px;
  height: 28px;
}
.footer a {
  color: #0366d6;
  text-decoration: none;
  margin: 0 8px;
  font-weight: 500;
}
.footer a:hover {
  text-decoration: underline;
}
</style>
</head>
<body>
<h1>众像归一 ———— 火狐の镜像代理 <span style="font-size:0.7em;"></span></h1>
<p>本项目支持语言包管理器、操作系统、容器工具等多种镜像源，部署于 Cloudflare Workers。<br>
<em>众生平等器，一切镜像源都得给我用cf拉平。</em></p>
<hr>
<h2>镜像源导航 / Mirror Navigation</h2>

<div class="mirror-section">
  <h3>语言包管理器 / Language Package Managers</h3>
  <div class="mirror-grid">
    <div class="mirror-item"><a href="/language/pypi/simple/pip/">PyPI (Python)</a></div>
    <div class="mirror-item"><a href="/language/npm/">NPM (Node.js)</a></div>
    <div class="mirror-item"><a href="/language/maven/">Maven (Java)</a></div>
    <div class="mirror-item"><a href="/language/gradle/">Gradle</a></div>
    <div class="mirror-item"><a href="/language/composer/">Composer (PHP)</a></div>
    <div class="mirror-item"><a href="/language/cargo/">Cargo (Rust)</a></div>
    <div class="mirror-item"><a href="/language/rubygems/">RubyGems</a></div>
    <div class="mirror-item"><a href="/language/cpan/">CPAN (Perl)</a></div>
    <div class="mirror-item"><a href="/language/ctan/">CTAN (TeX)</a></div>
    <div class="mirror-item"><a href="/language/julia/">Julia</a></div>
  </div>
</div>

<div class="mirror-section">
  <h3>操作系统 / Operating Systems</h3>
  <div class="mirror-grid">
    <div class="mirror-item"><a href="/system/centos/7.9.2009/os/x86_64/">CentOS</a></div>
    <div class="mirror-item"><a href="/system/centos-stream/">CentOS Stream</a></div>
    <div class="mirror-item"><a href="/system/ubuntu/">Ubuntu</a></div>
    <div class="mirror-item"><a href="/system/debian/">Debian</a></div>
    <div class="mirror-item"><a href="/system/alpine/">Alpine</a></div>
    <div class="mirror-item"><a href="/system/archlinux/">Arch Linux</a></div>
    <div class="mirror-item"><a href="/system/arch4edu/">Arch4edu</a></div>
    <div class="mirror-item"><a href="/system/blackarch/">BlackArch</a></div>
    <div class="mirror-item"><a href="/system/fedora/">Fedora</a></div>
    <div class="mirror-item"><a href="/system/opensuse/">openSUSE</a></div>
    <div class="mirror-item"><a href="/system/kali/">Kali Linux</a></div>
    <div class="mirror-item"><a href="/system/raspbian/">Raspbian</a></div>
    <div class="mirror-item"><a href="/system/gentoo/">Gentoo</a></div>
    <div class="mirror-item"><a href="/system/freebsd/">FreeBSD</a></div>
    <div class="mirror-item"><a href="/system/openbsd/">OpenBSD</a></div>
    <div class="mirror-item"><a href="/system/void/">Void Linux</a></div>
    <div class="mirror-item"><a href="/system/rocky/">Rocky Linux</a></div>
    <div class="mirror-item"><a href="/system/almalinux/">AlmaLinux</a></div>
  </div>
</div>

<div class="mirror-section">
  <h3>容器/虚拟化 / Containers & Virtualization</h3>
  <div class="mirror-grid">
    <div class="mirror-item"><a href="/container/docker/">Docker Registry</a></div>
    <div class="mirror-item"><a href="/container/dockerhub/">Docker Hub</a></div>
    <div class="mirror-item"><a href="/container/gcr/">Google Container Registry</a></div>
    <div class="mirror-item"><a href="/container/quay/">Quay.io</a></div>
    <div class="mirror-item"><a href="/container/k8s/">Kubernetes GCR</a></div>
    <div class="mirror-item"><a href="/container/ghcr/">GitHub Container Registry</a></div>
  </div>
</div>

<div class="mirror-section">
  <h3>工具 / Tools</h3>
  <div class="mirror-grid">
    <div class="mirror-item"><a href="/tool/homebrew/">Homebrew</a></div>
    <div class="mirror-item"><a href="/tool/anaconda/">Anaconda</a></div>
    <div class="mirror-item"><a href="/tool/flutter/">Flutter</a></div>
    <div class="mirror-item"><a href="/tool/winget/">WinGet</a></div>
    <div class="mirror-item"><a href="/tool/chocolatey/">Chocolatey</a></div>
    <div class="mirror-item"><a href="/tool/scoop/">Scoop</a></div>
    <div class="mirror-item"><a href="/tool/msys2/">MSYS2</a></div>
    <div class="mirror-item"><a href="/tool/cygwin/">Cygwin</a></div>
  </div>
</div>

<h3>镜像源使用指南 / Mirror Usage Guide</h3>
<!-- ...原有 details 内容省略... -->

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
<hr>
<details><summary>FAQ / 常见问题</summary>
<ul>
  <li><strong>Q: 为什么有些镜像访问较慢或无法访问？</strong><br>
      A: 部分源站（如 PyPI, Docker Hub）可能限制 Worker 代理，建议优先用于静态资源镜像。</li>
  <li><strong>Q: 有使用限制吗？</strong><br>
      A: 代理流量受 Cloudflare Worker 免费额度限制（每天 100,000 请求）。</li>
  <li><strong>Q: 支持哪些镜像？</strong><br>
      A: 就页面这些，有的可能还不能用。</li>
  <li><strong>Q: 如何添加新的镜像源？</strong><br>
      A: 博客评论或给我发邮件。</li>
  <li><strong>Q: 如何部署自己的镜像？</strong><br>
      A: 在 Cloudflare 上注册账号，创建 Worker，复制此代码并修改域名即可部署。</li>
  <li><strong>Q: 有SSL/TLS支持吗？</strong><br>
      A: 是的，所有请求都通过 Cloudflare 的 HTTPS 加密传输。</li>
  <li>For more details, see <a href="https://github.com/tsaitang404/cf-mirror-worker">GitHub</a>.</li>
</ul>
</details>

<div class="footer">
  <div class="footer-icons">
    <a href="https://github.com/tsaitang404/cf-mirror-worker" title="GitHub">
      <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg" alt="GitHub" style="height:28px;filter:grayscale(1);">
    </a>
    &nbsp&nbsp&nbsp&nbsp
    <a href="https://www.cloudflare.com/" title="Cloudflare">
      <img src="https://dash.cloudflare.com/favicon.ico" alt="Cloudflare" style="height:28px;background:#f6f8fa;border-radius:4px;">
    </a>
    &nbsp&nbsp&nbsp&nbsp&nbsp
    <a href="https://www.tsaitang.com" title="Cloudflare Dashboard">
      <img src="https://www.tsaitang.com/logo.webp" alt="CF Dash" style="height:28px;border-radius:4px;">
    </a>
  </div>
  <div>
    <a href="https://github.com/tsaitang404/cf-mirror-worker">GitHub</a> ·
    <a href="https://www.cloudflare.com/">Cloudflare</a> ·
    <a href="https://dash.cloudflare.com/">火狐夜话</a>
  </div>
  <div style="margin-top:8px;">
    <span style="margin-left:6px;">Powered by <a href="https://www.cloudflare.com/" target="_blank">Cloudflare</a> &amp; <a href="https://github.com/tsaitang404/cf-mirror-worker" target="_blank">cf-mirror-worker</a></span>
  </div>
</div>
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
  { prefix: '/language/cpan/', target: 'https://www.cpan.org', host: 'www.cpan.org', sni: true },
  { prefix: '/language/ctan/', target: 'https://ctan.org', host: 'ctan.org', sni: true },
  { prefix: '/language/julia/', target: 'https://pkg.julialang.org', host: 'pkg.julialang.org', sni: true },
  
  // 系统类镜像源
  { prefix: '/system/centos/', target: 'http://vault.centos.org', host: 'vault.centos.org' },
  { prefix: '/system/centos-stream/', target: 'http://mirror.stream.centos.org', host: 'mirror.stream.centos.org' },
  { prefix: '/system/ubuntu/', target: 'http://archive.ubuntu.com', host: 'archive.ubuntu.com' },
  { prefix: '/system/debian/', target: 'http://deb.debian.org', host: 'deb.debian.org' },
  { prefix: '/system/alpine/', target: 'http://dl-cdn.alpinelinux.org', host: 'dl-cdn.alpinelinux.org' },
  { prefix: '/system/archlinux/', target: 'https://mirrors.edge.kernel.org/archlinux', host: 'mirrors.edge.kernel.org' },
  { prefix: '/system/arch4edu/', target: 'https://mirrors.tuna.tsinghua.edu.cn/arch4edu', host: 'mirrors.tuna.tsinghua.edu.cn' },
  { prefix: '/system/blackarch/', target: 'https://mirrors.tuna.tsinghua.edu.cn/blackarch', host: 'mirrors.tuna.tsinghua.edu.cn' },
  { prefix: '/system/fedora/', target: 'https://download.fedoraproject.org', host: 'download.fedoraproject.org', sni: true },
  { prefix: '/system/opensuse/', target: 'http://download.opensuse.org', host: 'download.opensuse.org' },
  { prefix: '/system/kali/', target: 'http://http.kali.org', host: 'http.kali.org' },
  { prefix: '/system/raspbian/', target: 'http://archive.raspbian.org', host: 'archive.raspbian.org' },
  { prefix: '/system/gentoo/', target: 'https://gentoo.org/downloads', host: 'gentoo.org', sni: true },
  { prefix: '/system/freebsd/', target: 'https://download.freebsd.org', host: 'download.freebsd.org', sni: true },
  { prefix: '/system/openbsd/', target: 'https://cdn.openbsd.org', host: 'cdn.openbsd.org', sni: true },
  { prefix: '/system/void/', target: 'https://alpha.de.repo.voidlinux.org', host: 'alpha.de.repo.voidlinux.org', sni: true },
  { prefix: '/system/rocky/', target: 'https://download.rockylinux.org', host: 'download.rockylinux.org', sni: true },
  { prefix: '/system/almalinux/', target: 'https://repo.almalinux.org', host: 'repo.almalinux.org', sni: true },
  
  // 容器/虚拟化类镜像
  { prefix: '/container/docker/', target: 'https://registry-1.docker.io', host: 'registry-1.docker.io', sni: true },
  { prefix: '/container/dockerhub/', target: 'https://hub.docker.com', host: 'hub.docker.com', sni: true },
  { prefix: '/container/gcr/', target: 'https://gcr.io', host: 'gcr.io', sni: true },
  { prefix: '/container/quay/', target: 'https://quay.io', host: 'quay.io', sni: true },
  { prefix: '/container/k8s/', target: 'https://k8s.gcr.io', host: 'k8s.gcr.io', sni: true },
  { prefix: '/container/ghcr/', target: 'https://ghcr.io', host: 'ghcr.io', sni: true },
  
  // 工具类镜像
  { prefix: '/tool/homebrew/', target: 'https://brew.sh', host: 'brew.sh', sni: true },
  { prefix: '/tool/anaconda/', target: 'https://repo.anaconda.com', host: 'repo.anaconda.com', sni: true },
  { prefix: '/tool/flutter/', target: 'https://storage.googleapis.com/flutter_infra_release', host: 'storage.googleapis.com', sni: true },
  { prefix: '/tool/winget/', target: 'https://cdn.winget.microsoft.com', host: 'cdn.winget.microsoft.com', sni: true },
  { prefix: '/tool/chocolatey/', target: 'https://chocolatey.org', host: 'chocolatey.org', sni: true },
  { prefix: '/tool/scoop/', target: 'https://scoop.sh', host: 'scoop.sh', sni: true },
  { prefix: '/tool/msys2/', target: 'https://repo.msys2.org', host: 'repo.msys2.org', sni: true },
  { prefix: '/tool/cygwin/', target: 'https://cygwin.com', host: 'cygwin.com', sni: true }
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
