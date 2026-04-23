import { APIRequestContext } from '@playwright/test';
import { HealthController } from './controllers/Health.controller';

export class ApiManager {
  private healthControllerInstance?: HealthController;

  constructor(private readonly request: APIRequestContext) {}

  get healthController(): HealthController {
    if (!this.healthControllerInstance) {
      this.healthControllerInstance = new HealthController(this.request);
    }

    return this.healthControllerInstance;
  }
}
