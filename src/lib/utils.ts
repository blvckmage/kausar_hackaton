import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(value: string) {
  if (!value) return value;
  
  // Если ввели "admin", не форматируем (оставляем для хакатон-входа)
  if (value.toLowerCase() === 'admin') return value;

  const phoneNumber = value.replace(/[^\d]/g, '');
  
  let digits = phoneNumber;
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.substring(1);
  }

  digits = digits.substring(0, 10);

  if (digits.length === 0) return '';
  if (digits.length <= 3) return `+7 (${digits}`;
  if (digits.length <= 6) return `+7 (${digits.slice(0, 3)})-${digits.slice(3)}`;
  if (digits.length <= 8) return `+7 (${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `+7 (${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function phoneToEmail(phone: string) {
  if (phone.toLowerCase() === 'admin') return 'admin1@mentoria.com';
  
  const digits = phone.replace(/[^\d]/g, '');
  if (!digits) return '';
  
  let normalized = digits;
  if (normalized.startsWith('8')) normalized = '7' + normalized.substring(1);
  if (!normalized.startsWith('7')) normalized = '7' + normalized;
  
  return `${normalized}@mentoria.com`;
}
