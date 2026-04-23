import { BaseComponent } from '../../base/BaseComponent';

export class HeaderComponent extends BaseComponent {
  get docsLink() {
    return this.byRole('link', { name: 'Docs' });
  }
}
