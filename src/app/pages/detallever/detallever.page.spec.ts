import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalleverPage } from './detallever.page';

describe('DetalleverPage', () => {
  let component: DetalleverPage;
  let fixture: ComponentFixture<DetalleverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
