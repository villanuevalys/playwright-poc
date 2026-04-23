import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseController {
  constructor(protected readonly request: APIRequestContext) {}

  protected get(url: string): Promise<APIResponse> {
    return this.request.get(url);
  }

  protected post(url: string, data: unknown): Promise<APIResponse> {
    return this.request.post(url, { data });
  }
}
