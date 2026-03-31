import { Component, computed, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { I18nService } from '../../core/i18n/i18n.service'
import { TPipe } from '../../shared/pipes/t.pipe'
import { LegalPageLayoutComponent } from './legal-page-layout.component'
import { getLegalEmailAddress } from './legal-contact.utils'

@Component({
  standalone: true,
  imports: [LegalPageLayoutComponent, TPipe],
  template: `
    <app-legal-page-layout titleKey="legalPrivacyTitle">
      <h2 class="legal-page-chapter">{{ 'legalPrivacyChapter1' | t }}</h2>

      <div class="legal-page-sections">
        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyOverviewTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyOverviewBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyDataRecTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyDataRecBody' | t }}</p>
        </section>
      </div>

      <h2 class="legal-page-chapter">{{ 'legalPrivacyChapter2' | t }}</h2>

      <div class="legal-page-sections">
        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyCloudflareTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyCloudflareBody' | t }}</p>
        </section>
      </div>

      <h2 class="legal-page-chapter">{{ 'legalPrivacyChapter3' | t }}</h2>

      <div class="legal-page-sections">
        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyProtectionTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyProtectionBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyControllerTitle' | t }}
          </h3>
          <p>{{ controllerBody() }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyStorageDurTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyStorageDurBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyLegalBasisTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyLegalBasisBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyRecipientsTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyRecipientsBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyRevocationTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyRevocationBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyObjectionTitle' | t }}
          </h3>
          <p class="legal-page-block-notice">
            {{ 'legalPrivacyObjectionBody' | t }}
          </p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyComplaintTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyComplaintBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyPortabilityTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyPortabilityBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyAccessTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyAccessBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyRestrictionTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyRestrictionIntro' | t }}</p>
          <ul class="legal-page-list">
            <li>{{ 'legalPrivacyRestrictionItem1' | t }}</li>
            <li>{{ 'legalPrivacyRestrictionItem2' | t }}</li>
            <li>{{ 'legalPrivacyRestrictionItem3' | t }}</li>
            <li>{{ 'legalPrivacyRestrictionItem4' | t }}</li>
          </ul>
          <p>{{ 'legalPrivacyRestrictionOutro' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacySSLTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacySSLBody' | t }}</p>
        </section>

        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacySpamTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacySpamBody' | t }}</p>
        </section>
      </div>

      <h2 class="legal-page-chapter">{{ 'legalPrivacyChapter4' | t }}</h2>

      <div class="legal-page-sections">
        <section class="panel legal-page-section">
          <h3 class="legal-page-section-title">
            {{ 'legalPrivacyWhatsappTitle' | t }}
          </h3>
          <p>{{ 'legalPrivacyWhatsappBody' | t }}</p>
        </section>
      </div>
    </app-legal-page-layout>
  `,
  styles: [
    `
      .legal-page-chapter {
        margin: 4px 0 0;
        font-size: 17px;
        color: var(--muted);
        font-weight: 600;
      }

      .legal-page-sections {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .legal-page-section {
        gap: 10px;
      }

      .legal-page-section-title {
        margin: 0 0 8px;
        font-size: 16px;
      }

      .legal-page-section p {
        margin: 0;
        line-height: 1.6;
        white-space: pre-line;
      }

      .legal-page-section p + p {
        margin-top: 8px;
      }

      .legal-page-block-notice {
        font-size: 0.88em;
        line-height: 1.55;
      }

      .legal-page-list {
        margin: 6px 0 8px;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        line-height: 1.6;
      }

      @media (max-width: 700px) {
        .legal-page-chapter {
          margin-top: 0;
        }
      }
    `,
  ],
})
export class LegalPrivacyPageComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly i18n = inject(I18nService)
  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  })

  protected readonly controllerBody = computed(() =>
    this.i18n.format('legalPrivacyControllerBody', {
      email: getLegalEmailAddress(this.queryParamMap().get('game')),
    }),
  )
}
