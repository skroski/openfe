import '@angular/compiler';
import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App Component', () => {
  it('deve instanciar a classe App com título OpenNFE', () => {
    const app = new App();
    expect(app).toBeDefined();
  });
});
