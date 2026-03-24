import { describe, it, expect } from 'vitest';
import { isValidIpv4, isValidIpv6, isValidIp } from './validators';

describe('validators', () => {
  describe('isValidIpv4', () => {
    it('debe validar direcciones IPv4 correctas', () => {
      expect(isValidIpv4('8.8.8.8')).toBe(true);
      expect(isValidIpv4('192.168.1.1')).toBe(true);
      expect(isValidIpv4('255.255.255.255')).toBe(true);
      expect(isValidIpv4('0.0.0.0')).toBe(true);
    });

    it('debe rechazar direcciones IPv4 incorrectas', () => {
      expect(isValidIpv4('256.1.1.1')).toBe(false);
      expect(isValidIpv4('192.168.1')).toBe(false);
      expect(isValidIpv4('abc.def.ghi.jkl')).toBe(false);
      expect(isValidIpv4('')).toBe(false);
      expect(isValidIpv4(null)).toBe(false);
    });
  });

  describe('isValidIpv6', () => {
    it('debe validar direcciones IPv6 correctas', () => {
      expect(isValidIpv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(isValidIpv6('2001:db8:85a3::8a2e:370:7334')).toBe(true);
      expect(isValidIpv6('::1')).toBe(true);
    });

    it('debe rechazar direcciones IPv6 incorrectas', () => {
      expect(isValidIpv6('12345::')).toBe(false);
      expect(isValidIpv6('xyz::1')).toBe(false);
      expect(isValidIpv6('')).toBe(false);
    });
  });

  describe('isValidIp', () => {
    it('debe aceptar tanto IPv4 como IPv6 válidas', () => {
      expect(isValidIp('1.1.1.1')).toBe(true);
      expect(isValidIp('fe80::1')).toBe(true);
    });

    it('debe rechazar strings inválidos', () => {
      expect(isValidIp('invalid_ip')).toBe(false);
    });
  });
});
