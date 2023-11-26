import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePublicPage } from './home-public.page';

describe('HomePublicPage', () => {
  let component: HomePublicPage;
  let fixture: ComponentFixture<HomePublicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomePublicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
