import "server-only";
import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  const apiKey = process.env.HUME_API_KEY;
  const secretKey = process.env.HUME_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.error('Missing required environment variables: HUME_API_KEY and/or HUME_SECRET_KEY');
    return null;
  }

  try {
    const accessToken = await fetchAccessToken({
      apiKey,
      secretKey,
    });

    if (!accessToken || accessToken === "undefined") {
      console.error('Failed to obtain valid access token from Hume API');
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('Error fetching Hume access token:', error);
    return null;
  }
};
