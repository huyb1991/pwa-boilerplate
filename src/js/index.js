const divInstall = document.getElementById('installContainer');
const btnInstall = document.getElementById('btnInstall');
const btnClose = document.getElementById('btnClose');
const documentBody = document.getElementsByTagName('body')[0];

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt', event);
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Remove the 'hidden' class from the install button container
  toggleInstall();
});

const toggleInstall = () => {
  // Install container
  if (divInstall.classList.contains('hidden')) {
    divInstall.classList.remove('hidden');
  } else {
    divInstall.classList.add('hidden');
  }

  // Body
  if (documentBody.classList.contains('app-with-install-bar')) {
    documentBody.classList.remove('app-with-install-bar');
  } else {
    documentBody.classList.add('app-with-install-bar');
  }
}

if (btnClose) {
  btnClose.addEventListener('click', () => {
    toggleInstall();
  })
}

if (btnInstall) {
  btnInstall.addEventListener('click', () => {
    console.log('👍', 'btnInstall-clicked');
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    promptEvent.userChoice.then((result) => {
      console.log('👍', 'userChoice', result);
      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
      window.deferredPrompt = null;
      // Hide the install button.
      toggleInstall();
    });
  });
}

window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
});

/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}