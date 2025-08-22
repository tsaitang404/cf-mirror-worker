addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const HTML = `
<html><body>
<h1>Cloudflare Worker 镜像代理</h1>
<hr>
<h3>常用路径</h3>
<ul>
  <li>PyPI 镜像：<a href="/language/pypi/simple/pip/">/language/pypi/simple/pip/</a></li>
  <li>CentOS 镜像：<a href="/system/centos/7.9.2009/os/x86_64/">/system/centos/7.9.2009/os/x86_64/</a></li>
  <li>CentOS Stream 镜像：<a href="/system/centos-stream/">/system/centos-stream/</a></li>
</ul>
<h3>CentOS 换源命令</h3>
<pre><code>cd /etc/yum.repos.d/
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*
sed -i 's|baseurl=http://.*centos.org|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*
sed -i 's|#baseurl=https://mirrors.tsaitang.com/system/centos|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*
</code></pre>
<h3>pip 源设置</h3>
<pre><code>pip config set global.index-url https://mirrors.tsaitang.com/language/pypi/
</code></pre>
<h3>临时使用 pip 镜像</h3>
<pre><code>pip install -i https://mirrors.tsaitang.com/language/pypi/ package_name
</code></pre>
<hr>
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

  // 首页
  if (url.pathname === '/') {
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
      let target;
      if (rule.prefix === '/language/pypi/') {
        // 保证 /language/pypi/ 代理到 https://pypi.org/simple/ 后面追加完整路径
        target = rule.target + '/' + url.pathname.replace(rule.prefix, '');
      } else {
        // 其他代理，始终保证路径前有 /
        let subPath = url.pathname.replace(rule.prefix, '');
        if (!subPath.startsWith('/')) subPath = '/' + subPath;
        target = rule.target + subPath;
      }
      return proxy(request, target, rule);
    }
  }

  // 其他路径 404
  return new Response('Not found', { status: 404 });
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
    return new Response(await response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (e) {
    return new Response('Proxy Error', { status: 502, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
