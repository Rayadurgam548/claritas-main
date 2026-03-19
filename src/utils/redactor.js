const redact = (text) => {
  if (!text) return text;

  // Redact Emails
  let redacted = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED EMAIL]');

  // Redact Phone numbers (basic international and US formats)
  redacted = redacted.replace(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g, '[REDACTED PHONE]');

  // Redact SSN (US)
  redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED SSN]');

  // Redact Basic Credit Cards
  redacted = redacted.replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED CARD]');

  return redacted;
};

module.exports = { redact };
