import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'app-component-host',
  template: '',
  styleUrls: []
})
export class ComponentHostComponent implements OnInit {
  @Input()
  set component(component: any) {
    this.viewContainerRef.clear();
    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const componentRef = this.viewContainerRef.createComponent(componentFactory);
    }

  }
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

 

}
