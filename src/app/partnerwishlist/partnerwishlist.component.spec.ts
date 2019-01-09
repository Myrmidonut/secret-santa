import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerwishlistComponent } from './partnerwishlist.component';

describe('PartnerwishlistComponent', () => {
  let component: PartnerwishlistComponent;
  let fixture: ComponentFixture<PartnerwishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerwishlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerwishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
