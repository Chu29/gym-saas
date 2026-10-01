const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type WindowWithClerk = Window & {
  Clerk?: {
    session?: {
      getToken: () => Promise<string | null>;
    };
  };
};

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach Clerk session token if running on client side
  if (typeof window !== 'undefined') {
    try {
      const clerkWindow = window as unknown as WindowWithClerk;
      const token = await clerkWindow.Clerk?.session?.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Session token lookup failed; proceed with unauthenticated request
    }
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorData: unknown;
    try {
      errorData = await res.json();
    } catch {
      errorData = null;
    }
    throw new ApiError(
      res.status,
      (errorData as { message?: string })?.message || 'API request failed',
      errorData,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
