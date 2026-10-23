/* GitHub Pages 포트폴리오 방문 기록기: 사용자 IP, 이메일 등은 수집하지 않습니다. */
(function () {
  const config = window.ANALYTICS_CONFIG;
  if (!config || !/^https:\/\/.+\.supabase\.co$/.test(config.supabaseUrl) ||
      !config.supabaseKey || config.supabaseKey.includes('YOUR_')) return;
  // 관리자 대시보드는 제외
  if (location.pathname.replace(/\/+$/, '').endsWith('/admin')) return;
  // 브라우저 추적 거부 설정 존중
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
  let visitorId;
  try {
    visitorId = localStorage.getItem('portfolio_anonymous_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('portfolio_anonymous_id', visitorId);
    }
  } catch (_) {
    visitorId = crypto.randomUUID();
  }
  let referrer = '직접 방문';
  try {
    if (document.referrer) {
      const u = new URL(document.referrer);
      if (u.hostname !== location.hostname) referrer = u.hostname.slice(0, 120);
    }
  } catch (_) { /* ignore */ }
  const payload = {
    p_visitor: visitorId,
    p_path: (location.pathname || '/').slice(0, 200),
    p_referrer: referrer
  };
  // anon key는 공개 가능한 클라이언트 키. 실제 데이터 권한은 SQL 함수에서 제한합니다.
  fetch(`${config.supabaseUrl}/rest/v1/rpc/record_visit`, {
    method: 'POST',
    headers: { 'apikey': config.supabaseKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {});
})();
