import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, switchMap, tap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/Heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'heroes-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigate(['/heroes/list']);
        this.heroForm.reset(hero);
        return;
      });
  }
  onSubmit(): void {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        //TODO Mostrarr snackbar
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} updated!`);
      });
      return;
    } else {
      this.heroesService.addHero(this.currentHero).subscribe((hero) => {
        //TODO Mostrarr snackbar, y navegar a /heroes/edit/hero.id
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${hero.superhero} created!`);
      });
    }
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) result;
    //   this.heroesService
    //     .deleteHeroById(this.currentHero.id)
    //     .subscribe((resp) => {
    //       this.router.navigate(['/heroes/list']);
    //       this.showSnackbar(`${this.currentHero.superhero} deleted!`);
    //     });
    // });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result): boolean => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasdeleted): boolean => wasdeleted)
      )
      .subscribe((result) => {
        this.router.navigate(['/heroes/list']);
        this.showSnackbar(`${this.currentHero.superhero} deleted!`);
      });
  }
  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Done', {
      duration: 2500,
    });
  }
}
