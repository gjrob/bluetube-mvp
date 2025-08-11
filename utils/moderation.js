// utils/moderation.js - CRITICAL SAFETY MODERATION

// ZERO TOLERANCE - Instant permanent ban
const criticalTerms = [
  // Child safety terms
  'cp', 'csam', 'pedo', 'loli', 'underage', 'minor',
  'child', 'kid', 'teen', 'preteen', 'jailbait',
  // Sexual content
  'porn', 'xxx', 'nsfw', 'nude', 'naked', 'sex',
  'onlyfans', 'cam', 'webcam', 'dick', 'pussy', 'cock',
  // Violence/harm
  'rape', 'murder', 'kill', 'suicide', 'kys',
  // Drugs
  'cocaine', 'heroin', 'meth', 'drugs', 'dealer'
];

// Suspicious patterns that trigger review
const suspiciousPatterns = [
  /\b\d{1,2}\s*(y|yo|yr|year|m|mo|month)s?\s*(old|girl|boy)\b/gi, // Age mentions
  /DM|dm|Dm\s*me|private|telegram|whatsapp|snap/gi, // Trying to go off-platform
  /\$\d+\s*(for|4)\s*(pics?|vids?|content)/gi, // Selling content
];

// CRITICAL MODERATION FUNCTION
export async function criticalModerate(text, userId, streamId) {
  const lowerText = text.toLowerCase();
  
  // 1. CHECK FOR CRITICAL TERMS - INSTANT BAN
  for (const term of criticalTerms) {
    if (lowerText.includes(term)) {
      // IMMEDIATE ACTIONS:
      await banUser(userId, 'CRITICAL_VIOLATION', text);
      await notifyAuthorities(userId, text, streamId);
      await deleteAllUserContent(userId);
      
      return {
        blocked: true,
        banned: true,
        reason: 'CRITICAL_CONTENT_VIOLATION',
        reportFiled: true,
        action: 'USER_BANNED_AND_REPORTED'
      };
    }
  }
  
  // 2. CHECK SUSPICIOUS PATTERNS - FLAG FOR REVIEW
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      await flagForReview(userId, text, streamId);
      
      return {
        blocked: true,
        banned: false,
        reason: 'SUSPICIOUS_CONTENT',
        action: 'FLAGGED_FOR_REVIEW'
      };
    }
  }
  
  // 3. Regular moderation for spam/abuse
  return regularModeration(text, userId);
}

// BAN USER IMMEDIATELY
async function banUser(userId, reason, evidence) {
  // Update database
  await supabase.from('banned_users').insert({
    user_id: userId,
    reason: reason,
    evidence: evidence,
    banned_at: new Date(),
    permanent: true
  });
  
  // Revoke all access
  await supabase.auth.admin.deleteUser(userId);
  
  // Block IP
  await blockUserIP(userId);
  
  console.error(`CRITICAL: User ${userId} banned for ${reason}`);
}

// NOTIFY AUTHORITIES IF NEEDED
async function notifyAuthorities(userId, content, streamId) {
  // Log for legal compliance
  await supabase.from('critical_violations').insert({
    user_id: userId,
    content: content,
    stream_id: streamId,
    reported_at: new Date(),
    ip_address: await getUserIP(userId),
    action_taken: 'BANNED_AND_REPORTED'
  });
  
  // Send alert to admin
  await fetch('/api/admin/critical-alert', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      content,
      streamId,
      severity: 'CRITICAL'
    })
  });
}

// DELETE ALL USER CONTENT
async function deleteAllUserContent(userId) {
  // Remove from all tables
  await supabase.from('super_chats').delete().eq('user_id', userId);
  await supabase.from('messages').delete().eq('user_id', userId);
  await supabase.from('streams').delete().eq('pilot_id', userId);
}

// FLAG FOR MANUAL REVIEW
async function flagForReview(userId, content, streamId) {
  await supabase.from('review_queue').insert({
    user_id: userId,
    content: content,
    stream_id: streamId,
    flagged_at: new Date(),
    priority: 'HIGH'
  });
}

// Regular moderation for non-critical content
function regularModeration(text, userId) {
  const bannedWords = ['spam', 'scam', 'idiot', 'stupid'];
  let cleaned = text;
  
  bannedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '***');
  });
  
  return {
    blocked: false,
    banned: false,
    cleaned: cleaned,
    action: 'CLEANED'
  };
}

