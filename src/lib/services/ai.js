import axios from "axios";

const MUAPI_BASE = "https://api.muapi.ai/api/v1";
const MUAPI_KEY = process.env.MUAPI_API_KEY;

export const aiService = {
  async generateProductShot({ imageUrl, category, aspectRatio = "1:1" }) {
    const response = await axios.post(
      `${MUAPI_BASE}/product-shot`,
      {
        image_url: imageUrl,
        category,
        aspect_ratio: aspectRatio,
      },
      {
        headers: {
          Authorization: `Bearer ${MUAPI_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
    return response.data;
  },

  async checkProductShotStatus(requestId) {
    const response = await axios.get(
      `${MUAPI_BASE}/product-shot/status/${requestId}`,
      {
        headers: { Authorization: `Bearer ${MUAPI_KEY}` },
        timeout: 15000,
      }
    );
    return response.data;
  },

  creditCost: 65,
};
