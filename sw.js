/*
  service worker for mki3d.html
*/

var appName = 'mkisg';
var version = '0.25';
var currentCacheName= appName+'_'+version;

self.addEventListener('install', e => {
    e.waitUntil(
	caches.open(currentCacheName).then(cache =>
				       {
					   return fetch('files-to-cache.json').then(response => {
					       return response.json();
					   } ).then( files => {
					       console.log(files);
					       return cache.addAll(files);
					   } )
				       }).then( () => {
					   console.log("CACHED !!!");
				       })
    );

});

self.addEventListener('activate', e => {
    e.waitUntil(
	caches.keys().then( cacheNames =>
			    {
				console.log(cacheNames); // test
				let toDelete = cacheNames.filter(
				    name => name.localeCompare(currentCacheName) != 0 && name.includes(appName+'_')
					|| name.includes('pwa-assets') // stale names up to version 0.0.8
				);
				console.log(toDelete);  // test
				return Promise.all (
				    toDelete.map( cacheName  => caches.delete(cacheName) )
				);
			    }
			  )
    )
});


self.addEventListener('fetch', e => {
    e.respondWith(
	caches.match(e.request).then(response => {
	    return response || fetch(e.request);
	})
    );
});
