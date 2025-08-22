addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const HTML = `
<html><body>
<h1>Hello, Here is my mirror proxy!</h1><br>
<hr>
<h4>CentOSx/RPM换源</h4>
cd /etc/yum.repos.d/<br>
sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-*<br>
sed -i 's|baseurl=http://.*centos.org|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*<br>
sed -i 's|#baseurl=https://mirrors.tsaitang.com/system/centos|baseurl=https://mirrors.tsaitang.com/system/centos|g' /etc/yum.repos.d/CentOS-*<br>
<br>
<h4>pip源</h4>
pip install -i  https://mirrors.tsaitang.com/language/pypi/ package_name
<h4>万能反代</h4>
https://p.aketer.me/url
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
        target = rule.target + url.pathname.replace(rule.prefix, '');
      }
      return proxy(request, target, rule);
    }
  }

  // 其他路径 404
  return new Response('Not found', { status: 404 });
}

// 代理函数
async function proxy(request, target, extraHeaders = {}) {
  // ...existing code...
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
    // ...existing code...
    // 添加 CORS 头部
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
