import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NuevoarticuloPage } from './nuevoarticulo.page';

describe('NuevoarticuloPage', () => {
  let component: NuevoarticuloPage;
  let fixture: ComponentFixture<NuevoarticuloPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoarticuloPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoarticuloPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
