import { BaseController } from '../../base/BaseController';
import { HealthStatus } from '../models/Health.interface';

export class HealthController extends BaseController {
  async check(url: string): Promise<HealthStatus> {
    const response = await this.get(url);

    return {
      ok: response.ok(),
      status: response.status(),
      url,
    };
  }


  async GETRequest(url: string): Promise<HealthStatus> {
    const request = await this.request.get(url);

    return {
      url,
      ok: request.ok(),
      status: request.status(),  
    }; 

  }
}
