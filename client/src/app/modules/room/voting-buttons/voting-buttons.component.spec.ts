import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingButtonsComponent } from './voting-buttons.component';

describe('VotingButtonsComponent', () => {
  let component: VotingButtonsComponent;
  let fixture: ComponentFixture<VotingButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VotingButtonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotingButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
