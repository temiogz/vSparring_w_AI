export function filterResponse(text: string) {
  const wordsToRemove = ['VERBALIZER DEACTIVATED', 'AI:', 'AI', 'Response:'];
  const pattern = new RegExp(wordsToRemove.join('|'), 'gi');

  let filteredText = text.replace(pattern, '').trim();
  filteredText = filteredText.replace(/\*+/g, '').replace(/\s+/g, ' ');

  return filteredText.trim();
}
