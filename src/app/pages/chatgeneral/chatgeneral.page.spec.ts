import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatgeneralPage } from './chatgeneral.page';

describe('ChatgeneralPage', () => {
  let component: ChatgeneralPage;
  let fixture: ComponentFixture<ChatgeneralPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatgeneralPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatgeneralPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
