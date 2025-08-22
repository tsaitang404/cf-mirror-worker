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
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // pypi 代理
  if (url.pathname.startsWith('/language/pypi/')) {
    const target = 'https://pypi.org/simple' + url.pathname.replace('/language/pypi', '');
    return proxy(request, target, { host: 'pypi.org' });
  }

  // centos 代理
  if (url.pathname.startsWith('/system/centos/')) {
    const target = 'http://vault.centos.org' + url.pathname.replace('/system/centos', '');
    return proxy(request, target, { host: 'vault.centos.org' });
  }

  // centos-stream 代理
  if (url.pathname.startsWith('/system/centos-stream/')) {
    const target = 'http://mirror.stream.centos.org' + url.pathname.replace('/system/centos-stream', '');
    return proxy(request, target, { host: 'mirror.stream.centos.org' });
  }

  // 其他路径 404
  return new Response('Not found', { status: 404 });
}

// 代理函数
async function proxy(request, target, extraHeaders = {}) {
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('Host', extraHeaders.host);
  reqHeaders.set('X-Real-IP', request.headers.get('CF-Connecting-IP') || '');
  reqHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
  reqHeaders.set('X-Forwarded-Proto', 'https');

  // pypi 需要 SNI
  if (extraHeaders.host === 'pypi.org') {
    reqHeaders.set('Origin', 'https://pypi.org');
  }

  const init = {
    method: request.method,
    headers: reqHeaders,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    redirect: 'manual'
  };

  return fetch(target, init);
}
