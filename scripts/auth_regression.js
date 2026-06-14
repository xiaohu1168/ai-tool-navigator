// Lightweight Node script to test admin auth flows
// Usage: node scripts/auth_regression.js

const base = process.env.BASE_URL || 'http://localhost:3000';
const creds = { username: 'admin', password: 'heyaihub2026' };

async function run() {
  try {
    console.log('POST /api/auth/login ->');
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(creds),
      redirect: 'manual',
    });

    console.log('login status:', loginRes.status);
    let setCookie = loginRes.headers.get('set-cookie');
    if (!setCookie) {
      try { setCookie = loginRes.headers.raw && loginRes.headers.raw()['set-cookie'] && loginRes.headers.raw()['set-cookie'].join('; '); } catch (e) {}
    }
    console.log('set-cookie:', setCookie || '<none>');

    const cookieValue = setCookie ? setCookie.split(';')[0] : '';

    console.log('\nGET /api/admin-submissions (no cookie) ->');
    const unauth = await fetch(`${base}/api/admin-submissions`, { method: 'GET', redirect: 'manual' });
    console.log('status:', unauth.status);
    try { const text = await unauth.text(); console.log('body:', text.slice(0,1000)); } catch(e){}

    console.log('\nGET /api/admin-submissions (with cookie) ->');
    const auth = await fetch(`${base}/api/admin-submissions`, { method: 'GET', headers: { cookie: cookieValue }, redirect: 'manual' });
    console.log('status:', auth.status);
    try { const text = await auth.text(); console.log('body:', text.slice(0,1000)); } catch(e){}

    console.log('\nGET /admin (no cookie) ->');
    const adminNo = await fetch(`${base}/admin`, { method: 'GET', redirect: 'manual' });
    console.log('status:', adminNo.status, 'location:', adminNo.headers.get('location') || '<none>');

    console.log('\nGET /admin (with cookie) ->');
    const adminAuth = await fetch(`${base}/admin`, { method: 'GET', headers: { cookie: cookieValue }, redirect: 'manual' });
    console.log('status:', adminAuth.status, 'location:', adminAuth.headers.get('location') || '<none>');
    const adminText = await adminAuth.text();
    console.log('admin body snippet:', adminText.slice(0,1000));

    console.log('\nSummary:');
    console.log('login_set_cookie_present:', !!setCookie);
    console.log('unauth_admin_submissions_status:', unauth.status);
    console.log('auth_admin_submissions_status:', auth.status);
    console.log('admin_no_cookie_status:', adminNo.status);
    console.log('admin_with_cookie_status:', adminAuth.status);

    process.exit((!setCookie || auth.status === 401 || adminAuth.status === 401) ? 2 : 0);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(3);
  }
}

run();
