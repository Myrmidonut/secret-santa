import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MywishComponent } from './mywish.component';

describe('MywishComponent', () => {
  let component: MywishComponent;
  let fixture: ComponentFixture<MywishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MywishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MywishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
