import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
      // Show a notification to the user here if desired
    },
    updated(registration) {
      console.log('New content is available; please refresh.')
      document.dispatchEvent(
        new CustomEvent('swUpdated', { detail: registration })
      )
      // Show a notification to the user that there's an update
      // This event can be handled in App.vue to show a refresh notification
      window.location.reload(true)
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    }
  })
}