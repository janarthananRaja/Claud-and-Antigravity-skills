export class ApiClientService {
  async post<T>(endpoint: string, data: any): Promise<{ data: T; status: number }> {
    // Shared destination API client
    return { data: { success: true, ...data } as any, status: 200 };
  }

  async get<T>(endpoint: string): Promise<{ data: T; status: number }> {
    return { data: {} as any, status: 200 };
  }
}
