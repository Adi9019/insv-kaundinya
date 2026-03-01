export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.REPLICATE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Missing prediction id' });
  }

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.detail || 'Poll error' });
    }

    return res.status(200).json({
      status: data.status,
      output: data.output,
      error: data.error
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
