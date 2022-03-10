export type ClientOptions = {
  ssl?: boolean;
  host?: string;
  port?: number;
  path?: string;
  apiKey?: string;
};

export const defaultOptions: ClientOptions = {
  ssl: false,
  host: 'localhost',
  port: 14037,
  path: '/',
  apiKey: '',
};

type RPCResponseError = {
  message: string;
  code: number;
};

type RPCResponse<T> = {
  result: T;
  error?: RPCResponseError;
};

class RPCError extends Error {
  code: number;
  constructor({ message, code }: RPCResponseError) {
    super(message);
    this.code = code;
  }
}

export class Client {
  constructor(private options: ClientOptions = defaultOptions) {}

  private getHeaders() {
    const { apiKey } = this.options;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Basic ${btoa(`x:${apiKey}`)}`;
    }

    return headers;
  }

  private getBaseUrl() {
    const { ssl, host, port, path } = this.options;
    const proto = ssl ? 'https' : 'http';

    return `${proto}://${host}:${port}${path}`;
  }

  private async fetch<T>(
    url: string = '/',
    method = 'GET',
    data?: Object
  ): Promise<T> {
    const base = this.getBaseUrl();
    const options: any = {
      headers: this.getHeaders(),
      method,
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${base}${url}`, options);

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json as any);
    }

    if (json.error) {
      throw new Error(json.error.message);
    }

    return json as T;
  }

  async get<T>(url: string): Promise<T> {
    return this.fetch<T>(url);
  }

  async post<T>(url: string, data?: Object): Promise<T> {
    return this.fetch<T>(url, 'POST', data);
  }

  async put<T>(url: string, data?: Object): Promise<T> {
    return this.fetch<T>(url, 'PUT', data);
  }

  async delete<T>(url: string, data?: Object): Promise<T> {
    return this.fetch<T>(url, 'DELETE', data);
  }

  async execute<T = Object>(method: string, params: any[] = []): Promise<T> {
    const { ssl, host, port, path } = this.options;
    const proto = ssl ? 'https' : 'http';

    const url = `${proto}://${host}:${port}${path}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        method,
        params,
      }),
    });

    try {
      const json = (await response.json()) as RPCResponse<T>;

      if (!response.ok) {
        throw new Error(json as any);
      }

      if (json.error) {
        throw new RPCError(json.error);
      }

      return json.result;
    } catch (e) {
      throw new Error(await response.text());
    }
  }
}
