import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArticulosPage } from './articulos.page';

describe('ArticulosPage', () => {
  let component: ArticulosPage;
  let fixture: ComponentFixture<ArticulosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticulosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticulosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
