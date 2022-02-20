import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

export interface MarkerData {
  tick: number,
  text: string
}

export interface MarkerPosition {
  tick: number,
  text: string,
  x: number
}

@Component({
  selector: 'app-timeline-slider',
  templateUrl: './timeline-slider.component.html',
  styleUrls: ['./timeline-slider.component.scss']
})
export class TimelineSliderComponent implements OnInit, OnChanges {
  @Input() public min: number = 0;
  @Input() public max: number = 1;

  @Input() public value: number = 0;
  @Output() public valueChange: EventEmitter<number> = new EventEmitter();

  @Input() public markers: MarkerData[] = [];
  public markerPositions: MarkerPosition[] = [];

  @ViewChild('container') public container: ElementRef;
  public dragPosition = {x: 0, y:0};

  public focused = false;

  constructor(private cdRef:ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if('value' in changes) {
      this.setDragPosition();
    }
  }

  setDragPosition() {
    let x = this.getX(this.value);
    // console.log(this.value, x);
    this.dragPosition = {
      x:x,
      y:0
    };
  }

  ngOnInit(): void {
    this.updateMarkerPositions();
  }

  ngAfterViewChecked(): void {
    this.updateMarkerPositions();
    this.setDragPosition();
    this.cdRef.detectChanges();
  }

  onResize(event: UIEvent): void {
    console.log('Resized');
    this.updateMarkerPositions();
    this.setDragPosition();
    this.cdRef.detectChanges();
  }

  // onClick(): void {
  //   console.log(this.dragPosition, this.value);
  // }

  updateMarkerPositions(): void {
    this.markerPositions = this.markers.filter((marker) => {
      return marker.tick >= this.min && marker.tick <= this.max;
    }).map((marker) => {
      return {
        tick: marker.tick,
        text: marker.text,
        x: this.getX(marker.tick) + 10
      };
    });
  }

  getX(tick: number) {
    if(!this.container) return 0;
    let max = Number(this.max);
    let min = Number(this.min);

    let containerWidth = this.container.nativeElement.offsetWidth;
    let pixelPerTick = ((containerWidth - 20) / Math.max(1, max-min));
    return Math.floor((tick-min) * pixelPerTick);
  }

  getCompletedValue() {
    return this.dragPosition.x + 10;
  }

  getTransform(markerPosition: MarkerPosition): string {
    return `transform(${markerPosition.x}px, 0)`;
  }

  getPixelToValue(pixel: number) {
    if(!this.container) return 0;
    let max = Number(this.max);
    let min = Number(this.min);

    let containerWidth = this.container.nativeElement.offsetWidth;
    let tickPerPixel = Math.abs(max - min) / Math.max(1, containerWidth - 20);
    console.log(tickPerPixel, pixel, min, pixel * tickPerPixel);
    return Math.floor(min + pixel * tickPerPixel);
  }

  dragEnd(event) {
    let pos = event.source.getFreeDragPosition();
    this.value = this.getPixelToValue(pos.x);
    // console.log(this.value, this.dragPosition);
    this.valueChange.emit(this.value);
    this.cdRef.detectChanges();
  }

  onParentClick() {
    console.log('Parent Clicked');
  }

  onMarkerClicked(marker) {
    console.log(marker);
    this.value = marker.tick;
    this.valueChange.emit(this.value);
    this.cdRef.detectChanges();
  }

  onBlur() {
    this.focused = false;
    console.log('Blurred');
  }

  onFocus() {
    this.focused = true;
    console.log('Focused');
  }
}
