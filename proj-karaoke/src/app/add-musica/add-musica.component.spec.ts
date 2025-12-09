import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMusicaComponent } from './add-musica.component';

describe('AddMusicaComponent', () => {
  let component: AddMusicaComponent;
  let fixture: ComponentFixture<AddMusicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMusicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMusicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
