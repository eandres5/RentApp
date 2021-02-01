import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RentadosPage } from './rentados.page';

describe('RentadosPage', () => {
  let component: RentadosPage;
  let fixture: ComponentFixture<RentadosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentadosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RentadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
