// UI release policy, not authentication. Draft assets are not secret.
export function courseIsVisible(track, hostname) {
  if (track === 'programming' || track === 'ai') return false;
  return track === 'network' || track === 'python';
}
