import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorRegistroComponent } from './proveedor-registro.component';

describe('ProveedorRegistroComponent', () => {
  let component: ProveedorRegistroComponent;
  let fixture: ComponentFixture<ProveedorRegistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProveedorRegistroComponent]
    });
    fixture = TestBed.createComponent(ProveedorRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
