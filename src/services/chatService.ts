// interface ChatMessage {
//   uid: string;
//   message: string;
// }

interface ChatResponse {
  // Add the expected response structure from your API
  message: string;
  // Add other fields your API returns
}

export const chatService = {
  async sendMessage(uid: string, message: string): Promise<ChatResponse> {
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
};