import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './output.css'

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'development') {
    // Unregister any existing service workers in development
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => reg.unregister());
      console.log('🛠️ Service Workers unregistered in development');
    });
  } else {
    // Register service worker in production
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('✅ Service Worker registered:', reg))
        .catch(err => console.log('❌ Service Worker registration failed:', err));
    });
  }
}
