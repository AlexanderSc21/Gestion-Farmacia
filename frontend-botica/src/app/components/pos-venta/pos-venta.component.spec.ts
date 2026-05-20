import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosVentaComponent } from './pos-venta.component';

describe('PosVentaComponent', () => {
  let component: PosVentaComponent;
  let fixture: ComponentFixture<PosVentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PosVentaComponent]
    });
    fixture = TestBed.createComponent(PosVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
