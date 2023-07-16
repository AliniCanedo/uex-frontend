import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputMask]'
})
export class InputMaskDirective {
  @Input('appInputMask') maskType: string = '';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (this.maskType === 'cpf') {
      this.el.nativeElement.value = this.formatCPF(value);
    } else if (this.maskType === 'phone') {
      this.el.nativeElement.value = this.formatPhone(value);
    } else if (this.maskType === 'cep') {
      this.el.nativeElement.value = this.formatCEP(value);
    }
  }

  private formatCPF(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');

    return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatPhone(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');

    return cleanedValue.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }

  private formatCEP(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');

    return cleanedValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
