module.exports = function apiKeyAuth(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  const expected = process.env.CERT_API_KEY;
  if (!expected) {
    console.warn('CERT_API_KEY not set, rejecting request for safety');
    return res.status(403).json({ error: 'API key not configured' });
  }
  if (!key || key !== expected) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
};
