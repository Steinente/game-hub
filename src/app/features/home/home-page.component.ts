import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common'
import { Subscription, interval } from 'rxjs'
import { startWith } from 'rxjs/operators'
import { I18nService } from '../../core/i18n/i18n.service'
import type { TranslationLanguage } from '../../core/i18n/translations'
import { TPipe } from '../../shared/pipes/t.pipe'

type GameCard = {
  id: string
  url: string
  name: string
  description: string
  iconUrl: string
  isOnline: boolean
  checkedAt: string
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TPipe],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient)
  private readonly platformId = inject(PLATFORM_ID)
  private pollSubscription?: Subscription

  readonly games = signal<GameCard[]>([])
  readonly loadingGames = signal(true)
  readonly gamesLoadError = signal(false)

  constructor(protected readonly language: I18nService) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.loadingGames.set(false)
      return
    }

    this.pollSubscription = interval(30_000)
      .pipe(startWith(0))
      .subscribe(() => {
        void this.loadGames()
      })
  }

  ngOnDestroy() {
    this.pollSubscription?.unsubscribe()
  }

  setLanguage(language: TranslationLanguage) {
    this.language.setLanguage(language)
  }

  handleIconError(gameId: string) {
    this.games.update((items) =>
      items.map((game) =>
        game.id === gameId
          ? { ...game, iconUrl: '/icons/icon-192x192.png' }
          : game,
      ),
    )
  }

  private async loadGames() {
    try {
      const games = await this.http
        .get<
          GameCard[]
        >('/api/games', { headers: { 'cache-control': 'no-cache' } })
        .toPromise()

      this.games.set(games ?? [])
      this.gamesLoadError.set(false)
    } catch {
      this.gamesLoadError.set(true)
    } finally {
      this.loadingGames.set(false)
    }
  }
}
