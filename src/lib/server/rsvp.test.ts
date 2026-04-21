import { describe, it, expect } from 'vitest';
import { rsvpFormSchema } from './rsvp';

describe('rsvpFormSchema', () => {
	it('accepts a minimal valid submission', () => {
		const result = rsvpFormSchema.safeParse({
			name: 'Aria Russo',
			email: 'aria@example.com'
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe('Aria Russo');
			expect(result.data.email).toBe('aria@example.com');
			expect(result.data.phone).toBeNull();
			expect(result.data.baby_age).toBeNull();
			expect(result.data.message).toBeNull();
		}
	});

	it('trims and lowercases the email', () => {
		const result = rsvpFormSchema.safeParse({
			name: 'Aria Russo',
			email: '   Aria@Example.COM  '
		});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data.email).toBe('aria@example.com');
	});

	it('rejects a missing name', () => {
		const result = rsvpFormSchema.safeParse({ email: 'aria@example.com' });
		expect(result.success).toBe(false);
	});

	it('rejects an invalid email', () => {
		const result = rsvpFormSchema.safeParse({
			name: 'Aria Russo',
			email: 'not-an-email'
		});
		expect(result.success).toBe(false);
	});

	it('normalizes empty-string optionals to null', () => {
		const result = rsvpFormSchema.safeParse({
			name: 'Aria Russo',
			email: 'aria@example.com',
			phone: '',
			baby_age: '   ',
			message: ''
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.phone).toBeNull();
			expect(result.data.baby_age).toBeNull();
			expect(result.data.message).toBeNull();
		}
	});

	it('rejects a filled honeypot', () => {
		const result = rsvpFormSchema.safeParse({
			name: 'Bot Russo',
			email: 'bot@example.com',
			_hp: 'http://spammer.example'
		});
		expect(result.success).toBe(false);
	});

	it('enforces the 120-char name limit', () => {
		const longName = 'x'.repeat(121);
		const result = rsvpFormSchema.safeParse({ name: longName, email: 'aria@example.com' });
		expect(result.success).toBe(false);
	});
});
