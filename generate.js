export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.REPLICATE_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { image_data, motion_bucket_id } = req.body;

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '3f0457e4619daac51203dedb472816fd4af51f3d',
        input: {
          input_image: image_data,
          fps_id: 8,
          motion_bucket_id: motion_bucket_id || 127,
          cond_aug: 0.02,
          decoding_t: 14,
          video_length: '14_frames_with_svd',
          sizing_strategy: 'maintain_aspect_ratio',
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.detail || 'Replicate API error' });
    }

    return res.status(200).json({ id: data.id, status: data.status });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
