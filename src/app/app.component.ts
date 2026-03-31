import { NgComponentOutlet } from '@angular/common'
import { Component, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { TPipe } from './shared/pipes/t.pipe'
import { PwaService } from './core/services/pwa.service'
import { SiteFooterComponent } from './site-footer.component'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgComponentOutlet, TPipe],
  template: `
    <div class="app-shell">
      @if (pwa.isOffline()) {
        <div class="app-status-banner app-status-banner-offline">
          <span>{{ 'pwaOfflineMessage' | t }}</span>
        </div>
      }

      @if (pwa.updateAvailable()) {
        <div class="app-status-banner app-status-banner-update">
          <span>{{ 'pwaUpdateMessage' | t }}</span>
          <button
            type="button"
            class="btn btn-primary"
            (click)="activateUpdate()"
          >
            {{ 'pwaUpdateAction' | t }}
          </button>
        </div>
      }

      <main class="app-main">
        <router-outlet />
      </main>

      <ng-container *ngComponentOutlet="siteFooterComponent" />
    </div>
  `,
  styles: [
    `
      .app-status-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        border-bottom: 1px solid var(--border);
      }

      .app-status-banner-offline {
        background: rgb(127 29 29 / 0.35);
        color: #fecaca;
      }

      .app-status-banner-update {
        background: rgb(30 64 175 / 0.3);
        color: #dbeafe;
      }

      @media (max-width: 700px) {
        .app-status-banner {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class App {
  protected readonly pwa = inject(PwaService)
  protected readonly siteFooterComponent = SiteFooterComponent

  protected activateUpdate() {
    void this.pwa.activateUpdate()
  }
}
