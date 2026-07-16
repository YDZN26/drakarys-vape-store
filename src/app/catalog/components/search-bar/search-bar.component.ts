import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: false,
})
export class SearchBarComponent {
  @Input() value = '';
  @Output() searchChange = new EventEmitter<string>();

  onInput(event: CustomEvent): void {
    this.searchChange.emit((event.detail.value as string) ?? '');
  }

  onClear(): void {
    this.searchChange.emit('');
  }
}
