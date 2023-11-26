import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MuseoProfilePage } from './museo-profile.page';

describe('MuseoProfilePage', () => {
  let component: MuseoProfilePage;
  let fixture: ComponentFixture<MuseoProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MuseoProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
