import { io, Socket } from 'socket.io-client';

export interface NotificationData {
  id?: string;
  _id?: string;
  type: 'successful_extraction' | 'failed_scan' | 'forwarding_error';
  title: string;
  message: string;
  isRead?: boolean;
  metadata?: {
    invoiceCount?: number;
    errorMessage?: string;
    recipientEmail?: string;
    scanId?: string;
  };
  createdAt: string;
}

export interface NotificationCountData {
  count: number;
}

export type NotificationHandler = (notification: NotificationData) => void;
export type NotificationCountHandler = (data: NotificationCountData) => void;

export class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private notificationHandlers: Set<NotificationHandler> = new Set();
  private notificationCountHandlers: Set<NotificationCountHandler> = new Set();

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_APP_API_URL || 'https://api.smartle.eu/';
    
    this.socket = io(backendUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Connected to notification server');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from notification server');
    });

    this.socket.on('notification', (notification: NotificationData) => {
      console.log('📨 Received notification:', notification);
      this.notificationHandlers.forEach(handler => handler(notification));
    });

    this.socket.on('notification_count', (data: NotificationCountData) => {
      console.log('📊 Received notification count:', data);
      this.notificationCountHandlers.forEach(handler => handler(data));
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
    });
  }

  public onNotification(handler: NotificationHandler): () => void {
    this.notificationHandlers.add(handler);
    return () => {
      this.notificationHandlers.delete(handler);
    };
  }

  public onNotificationCount(handler: NotificationCountHandler): () => void {
    this.notificationCountHandlers.add(handler);
    return () => {
      this.notificationCountHandlers.delete(handler);
    };
  }

  public acknowledgeNotification(notificationId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('notification_acknowledged', { notificationId });
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
} 