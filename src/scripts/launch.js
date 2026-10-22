// Écran de lancement, à chaque chargement de l'accueil comme dans Kauri. Inséré par ce
// script seul, jamais par le HTML, pour qu'une page sans JS ne reste jamais masquée.
(function () {
  var LEAVE_AT_MS = 2000;
  var FADE_MS = 260;
  var root = document.documentElement;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var template = document.getElementById('launch-template');
  if (!template) return;
  document.body.prepend(template.content.cloneNode(true));
  var launch = document.getElementById('launch');
  root.setAttribute('data-launch', 'playing');

  var timer = window.setTimeout(function () { leave(false); }, LEAVE_AT_MS);

  function onKey(event) {
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') leave(true);
  }

  function leave(skipped) {
    if (!launch) return;
    window.clearTimeout(timer);
    window.removeEventListener('keydown', onKey);
    // Passé : la cascade du contenu démarre tout de suite au lieu d'attendre la fin du tracé.
    if (skipped) root.setAttribute('data-launch', 'skipped');
    var leaving = launch;
    launch = null;
    leaving.classList.add('is-leaving');
    window.setTimeout(function () { leaving.remove(); }, skipped ? 0 : FADE_MS);
  }

  launch.addEventListener('click', function () { leave(true); });
  window.addEventListener('keydown', onKey);
})();
