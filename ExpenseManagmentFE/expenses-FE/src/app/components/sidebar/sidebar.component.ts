import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { User } from '../../entities/user';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  isClosed: boolean = true;
  isMobile: boolean = false;

  @Output() logout = new EventEmitter<void>();
  @Input() user: User | null = null;

  constructor(
    private authSrv: AuthService,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkIfMobile();
  }

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const sidebar = this.el.nativeElement.querySelector('.sidebar');

    if (this.isMobile && sidebar && !sidebar.contains(event.target as Node)) {
      this.isClosed = true;
    }
  }

  @HostListener('click', ['$event'])
  onSidebarClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
