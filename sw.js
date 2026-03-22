const CACHE = 'todo-calendar-v1';
const FILES = ['./todo.html', './manifest.json', './icon.svg', './sw.js'];

// 설치: 파일 캐시
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

// 활성화: 구버전 캐시 삭제
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 네트워크 요청: 캐시 우선
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// 알림 클릭 → 앱 열기 + 브리핑 표시
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const targetUrl = (e.notification.data && e.notification.data.url)
    ? e.notification.data.url
    : './todo.html?briefing=1';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // 이미 열린 탭이 있으면 포커스
      for (const client of list) {
        if (client.url.includes('todo.html') && 'focus' in client) {
          client.postMessage({ type: 'SHOW_BRIEFING' });
          return client.focus();
        }
      }
      // 없으면 새 탭으로 열기
      return clients.openWindow(targetUrl);
    })
  );
});

// 앱에서 보낸 메시지 처리
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
