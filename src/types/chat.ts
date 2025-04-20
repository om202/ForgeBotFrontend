export interface Message {
  from: 'user' | 'bot';
  text: string;
}

export interface ChatResponse {
  message: string;
  // Add other fields from your API response
}

export interface ChatRequest {
  uid: string;
  message: string;
}