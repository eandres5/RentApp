import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowprofilePage } from './showprofile.page';

describe('ShowprofilePage', () => {
  let component: ShowprofilePage;
  let fixture: ComponentFixture<ShowprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
