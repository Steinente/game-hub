import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { I18nService } from '../../core/i18n/i18n.service'
import { LegalPageLayoutComponent } from './legal-page-layout.component'
import { TPipe } from '../../shared/pipes/t.pipe'
import { getLegalEmailAddress } from './legal-contact.utils'

@Component({
  standalone: true,
  imports: [LegalPageLayoutComponent, TPipe],
  template: `
    <app-legal-page-layout titleKey="legalImprintTitle">
      <div class="grid legal-page-grid">
        <section class="panel legal-page-section">
          <h2 class="legal-page-section-title">
            {{ 'legalImprintResponsibleLabel' | t }}
          </h2>
          <p>{{ 'legalImprintResponsibleValue' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h2 class="legal-page-section-title">
            {{ 'legalImprintAddressLabel' | t }}
          </h2>
          <p>{{ 'legalImprintAddressValue' | t }}</p>
        </section>

        <section class="panel legal-page-section legal-page-section-full">
          <h2 class="legal-page-section-title">
            {{ 'legalImprintContactLabel' | t }}
          </h2>
          <p>{{ contactValue() }}</p>
        </section>
      </div>
    </app-legal-page-layout>
  `,
  styles: [
    `
      .legal-page-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .legal-page-section {
        gap: 10px;
      }

      .legal-page-section-title {
        margin: 0 0 8px;
        font-size: 16px;
      }

      .legal-page-section p {
        white-space: pre-line;
      }

      .legal-page-section-full {
        grid-column: 1 / -1;
      }

      @media (max-width: 700px) {
        .legal-page-grid {
          grid-template-columns: 1fr;
        }

        .legal-page-section-full {
          grid-column: auto;
        }
      }
    `,
  ],
})
export class LegalImprintPageComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly i18n = inject(I18nService)
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  })

  protected readonly contactValue = computed(() =>
    this.i18n.format('legalImprintContactValue', {
      email: getLegalEmailAddress(this.queryParamMap().get('game')),
    }),
  )
}
