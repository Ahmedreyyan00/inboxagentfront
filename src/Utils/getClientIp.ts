/**
 * Fetches the client's real IP address from ipify API
 * @returns Promise<string> The client's IP address or 'unknown' if fetch fails
 */
export async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      console.error('Failed to fetch IP from ipify:', response.statusText);
      return 'unknown';
    }
    
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.error('Error fetching client IP:', error);
    return 'unknown';
  }
}

