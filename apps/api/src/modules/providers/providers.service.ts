import { Injectable } from '@nestjs/common';
import { FiscalProviderRegistry } from '@opennfe/providers';
import { FiscalEnvironment } from '@opennfe/shared';

@Injectable()
export class ProvidersService {
  async listProviders() {
    const providers = FiscalProviderRegistry.listAll();
    const list = [];
    for (const p of providers) {
      const caps = await p.getCapabilities();
      list.push({
        key: p.providerKey,
        name: p.name,
        capabilities: caps,
      });
    }
    return list;
  }

  async testConnection(providerKey: string, credentials: Record<string, string>, env: FiscalEnvironment) {
    const adapter = FiscalProviderRegistry.get(providerKey);
    return adapter.testConnection(credentials, env);
  }
}

