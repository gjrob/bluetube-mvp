// utils/moderation.js
const bannedWords = ['scam', 'spam', 'hate', 'porn'];

export function cleanMessage(text) {
  let filtered = text;
  bannedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
}

// In your chat component:
const sendMessage = (message) => {
  const clean = cleanMessage(message);
  // Send clean message
};