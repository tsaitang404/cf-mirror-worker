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
  <li>CentOS 镜像 / CentOS Mirror: <a href="/system/centos/7.9.2009/os/x86_64/">/system/centos/7.9.2009/os/x86_64/</a></li>
  <li>CentOS Stream 镜像 / CentOS Stream Mirror: <a href="/system/centos-stream/">/system/centos-stream/</a></li>
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
<hr>
<details><summary>FAQ / 常见问题</summary>
<ul>
  <li>部分源站（如 PyPI）可能限制 Worker 代理，建议优先用于 CentOS 镜像等静态资源。</li>
  <li>代理流量受 Cloudflare Worker 免费额度限制。</li>
  <li>如需扩展其他镜像源，请在 <code>proxyMap</code> 中添加规则。</li>
  <li>For more details, see <a href="https://github.com/tsaitang404/cf-mirror-worker">GitHub</a>.</li>
</ul>
</details>
<small><a href="https://github.com/tsaitang404/cf-mirror-worker">GitHub</a></small>
</body></html>
`;

const proxyMap = [
  { prefix: '/language/pypi/', target: 'https://pypi.org/simple', host: 'pypi.org', sni: true },
  { prefix: '/system/centos/', target: 'http://vault.centos.org', host: 'vault.centos.org' },
  { prefix: '/system/centos-stream/', target: 'http://mirror.stream.centos.org', host: 'mirror.stream.centos.org' }
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
