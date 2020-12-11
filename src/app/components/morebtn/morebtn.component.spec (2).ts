import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MorebtnComponent } from './morebtn.component';

describe('MorebtnComponent', () => {
  let component: MorebtnComponent;
  let fixture: ComponentFixture<MorebtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorebtnComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MorebtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
