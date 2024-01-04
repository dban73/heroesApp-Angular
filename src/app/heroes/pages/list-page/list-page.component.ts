import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

import { HeroesService } from '../../services/Heroes.service';

@Component({
  selector: 'heroes-list-page',
  templateUrl: './list-page.component.html',
  styles: ``,
})
export class ListPageComponent implements OnInit {
  public heroes: Hero[] = [];
  constructor(private heroesService: HeroesService) {}

  ngOnInit(): void {
    this.heroesService
      .getheroes()
      .subscribe((heroes) => (this.heroes = heroes));
  }
}
