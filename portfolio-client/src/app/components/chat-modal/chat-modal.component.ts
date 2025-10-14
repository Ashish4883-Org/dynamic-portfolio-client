import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzInputModule,
  ],
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss'],
})
export class ChatModalComponent {
  /** Controls visibility from parent via two-way binding [(isVisible)] */
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  /** Selected user meta shown in title */
  @Input() selectedUser: any = null;

  /** Messages passed from parent (parent keeps authoritative list) */
  @Input() messages: any[] = [];

  /** Modal width (optional override) */
  @Input() width: string = '600px';

  /** Emitted when user sends a message from inside the modal. Payload = message text */
  @Output() send = new EventEmitter<string>();

  /** Emitted when modal is cancelled/closed */
  @Output() cancel = new EventEmitter<void>();

  /** Local input model for the message box inside this component */
  newMessage: string = '';

  @ViewChild('messageList') messageList!: ElementRef<HTMLDivElement>;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const el = this.messageList?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  onCancel(): void {
    // emit visible change and cancel event so parent can react
    this.isVisible = false;
    this.isVisibleChange.emit(false);
    this.cancel.emit();
    this.newMessage = '';
  }

  onSend(): void {
    if (this.newMessage && this.newMessage.trim()) {
      this.send.emit(this.newMessage.trim());
      this.newMessage = '';
    }
  }
}
