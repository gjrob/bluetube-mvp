// User & Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  isFounder?: boolean;
}

// Stream Data
export interface Stream {
  id: string;
  title: string;
  pilotName: string;
  isLive: boolean;
  viewerCount: number;
  rtmpUrl?: string;
  startTime?: string;
}

// Super Chat (CRITICAL - Money involved!)
export interface SuperChat {
  id: string;
  username: string;
  message: string;
  amount: number;        // Always in cents (5000 = $50.00)
  timestamp: string;
  streamId: string;
  paymentIntentId: string;
  type: 'super_chat';
}

export interface RegularChat {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  streamId: string;
  userId?: string;
  type: 'regular';
}

export type ChatMessage = SuperChat | RegularChat;

// Payment Processing
export interface PaymentRequest {
  amount: number;          // In cents
  username: string;
  message: string;
  streamId: string;
  userEmail?: string;
}

export interface PaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// NFT Types
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url?: string;
  attributes: NFTAttribute[];
  external_url: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMintRequest {
  streamId: string;
  timestamp: number;
  description: string;
  pilotName: string;
  location?: string;
  aircraftType?: string;
  mintPrice: string;        // In ETH
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Socket Events
export interface SocketEvents {
  'join-stream': (streamId: string) => void;
  'chat-message': (message: RegularChat) => void;
  'super-chat': (superChat: SuperChat) => void;
  'viewer-count': (count: number) => void;
}