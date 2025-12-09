import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscolhaCategoriaComponent } from './escolha-categoria.component';

describe('EscolhaCategoriaComponent', () => {
  let component: EscolhaCategoriaComponent;
  let fixture: ComponentFixture<EscolhaCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscolhaCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscolhaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
