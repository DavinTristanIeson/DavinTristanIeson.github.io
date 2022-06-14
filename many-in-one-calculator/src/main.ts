import App from './UI/App.svelte';

// Not used until I can setup a PWA
// function registerServiceWorker () {
// 	if ('serviceWorker' in navigator) {
// 	  	navigator.serviceWorker.register("/sw.js",).then(
// 			(registration)=>{console.log("[Service Worker] Registration successful",registration.scope)}
// 		).catch((error)=>{
// 			console.error(`[Service Worker] Registration failed: ${error}`);
// 		});
// 	} else {
// 		console.error("[Service Worker] Failed to register; your browser doesn't support service workers.")
// 	}
// };
  
// window.addEventListener("load",registerServiceWorker);

const app = new App({
	target: document.body,
});

export default app;