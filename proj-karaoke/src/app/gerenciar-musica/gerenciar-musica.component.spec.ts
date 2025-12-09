import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarMusicaComponent } from './gerenciar-musica.component';

describe('GerenciarMusicaComponent', () => {
  let component: GerenciarMusicaComponent;
  let fixture: ComponentFixture<GerenciarMusicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarMusicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarMusicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
