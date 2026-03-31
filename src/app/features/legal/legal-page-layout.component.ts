import { isPlatformBrowser, Location } from '@angular/common'
import { Component, Input, PLATFORM_ID, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TPipe } from '../../shared/pipes/t.pipe'
import type { TranslationKey } from '../../core/i18n/translations'

@Component({
  selector: 'app-legal-page-layout',
  standalone: true,
  imports: [TPipe],
  template: `
    <div class="page-shell legal-page-shell">
      <div class="panel legal-page-panel">
        <div class="legal-page-top">
          <div>
            <p class="legal-page-eyebrow">{{ 'legalFooterLabel' | t }}</p>
            <h1 class="legal-page-title">{{ titleKey | t }}</h1>
          </div>

          <div class="legal-page-actions">
            <button
              type="button"
              class="btn btn-outline legal-page-back-link"
              (click)="goBack()"
            >
              {{ 'back' | t }}
            </button>
          </div>
        </div>

        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .legal-page-shell {
        max-width: 980px;
        padding-top: 24px;
        padding-bottom: 24px;
      }

      .legal-page-panel {
        display: grid;
        gap: 18px;
      }

      .legal-page-top {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
      }

      .legal-page-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .legal-page-eyebrow {
        margin: 0 0 8px;
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .legal-page-title {
        margin: 0;
      }

      .legal-page-back-link {
        white-space: nowrap;
      }

      @media (max-width: 700px) {
        .legal-page-shell {
          padding-top: 12px;
          padding-bottom: 20px;
        }

        .legal-page-top {
          flex-direction: column;
        }

        .legal-page-actions {
          width: 100%;
        }

        .legal-page-back-link {
          width: 100%;
          text-align: center;
        }
      }
    `,
  ],
})
export class LegalPageLayoutComponent {
  private readonly router = inject(Router)
  private readonly location = inject(Location)
  private readonly platformId = inject(PLATFORM_ID)

  @Input({ required: true }) titleKey!: TranslationKey

  goBack() {
    if (isPlatformBrowser(this.platformId) && window.history.length > 1) {
      this.location.back()
      return
    }

    void this.router.navigateByUrl('/')
  }
}
