import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

/**
 * Lazy Resend client — instantiated on first use so missing credentials
 * don't crash the build step (CI never has `RESEND_API_KEY`). Returns
 * `null` when unconfigured so callers can no-op gracefully.
 */
let client: Resend | null = null;
let resolvedOnce = false;

function getClient(): Resend | null {
	if (resolvedOnce) return client;
	resolvedOnce = true;

	const key = env.RESEND_API_KEY;
	if (!key) {
		console.warn('[email] RESEND_API_KEY not set — email notifications disabled.');
		return null;
	}
	client = new Resend(key);
	return client;
}

export type RsvpNotification = {
	name: string;
	email: string;
	phone: string | null;
	babyAge: string | null;
	message: string | null;
	source: string;
	submittedAt: Date;
};

type SendResult =
	| { sent: true; id?: string }
	| { sent: false; reason: 'disabled' | 'misconfigured' | 'send_failed' };

/**
 * Fire an internal notification email about a new RSVP. Failures are
 * swallowed and logged — we never want a Resend hiccup to block a valid
 * RSVP from being captured in Directus. Callers should `await` this but
 * treat a `{ sent: false }` result as non-fatal.
 */
export async function sendRsvpNotification(payload: RsvpNotification): Promise<SendResult> {
	const resend = getClient();
	if (!resend) return { sent: false, reason: 'disabled' };

	const to = env.RSVP_NOTIFY_EMAIL;
	const from = env.RSVP_NOTIFY_FROM || 'Dolce Vita CT <reservations@dolcevitact.com>';
	if (!to) {
		console.warn('[email] RSVP_NOTIFY_EMAIL not set — skipping email notification.');
		return { sent: false, reason: 'misconfigured' };
	}

	try {
		const response = await resend.emails.send({
			from,
			to,
			replyTo: payload.email,
			subject: `New RSVP — ${payload.name}`,
			html: renderNotificationHtml(payload),
			text: renderNotificationText(payload)
		});
		return { sent: true, id: response.data?.id };
	} catch (error) {
		console.warn('[email] RSVP notification failed:', error);
		return { sent: false, reason: 'send_failed' };
	}
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function renderRow(label: string, value: string | null): string {
	if (!value) return '';
	return `
		<tr>
			<td style="padding:6px 16px 6px 0;font-family:Georgia,serif;font-size:13px;color:#6d6459;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(label)}</td>
			<td style="padding:6px 0;font-family:Georgia,serif;font-size:15px;color:#2d2a26;">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
		</tr>
	`;
}

function renderNotificationHtml(p: RsvpNotification): string {
	const submittedAt = p.submittedAt.toLocaleString('en-US', {
		timeZone: 'America/New_York',
		dateStyle: 'full',
		timeStyle: 'short'
	});

	return `<!doctype html>
<html>
	<body style="margin:0;padding:32px 16px;background:#f6f1ec;">
		<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fffbf6;border:1px solid #e7ddcf;border-radius:12px;padding:32px;">
			<tr>
				<td>
					<p style="margin:0 0 4px;font-family:Georgia,serif;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#a07a4d;">Dolce Vita CT</p>
					<h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#2d2a26;">New RSVP received</h1>
					<table role="presentation" cellpadding="0" cellspacing="0">
						${renderRow('Name', p.name)}
						${renderRow('Email', p.email)}
						${renderRow('Phone', p.phone)}
						${renderRow('Baby age', p.babyAge)}
						${renderRow('Note', p.message)}
						${renderRow('Source', p.source)}
						${renderRow('Submitted', submittedAt)}
					</table>
					<p style="margin:28px 0 0;font-family:Georgia,serif;font-size:13px;color:#6d6459;">Triage from <a href="https://cms.bravobyte.co/admin/content/rsvp_submissions" style="color:#a07a4d;">Directus → RSVP Submissions</a>.</p>
				</td>
			</tr>
		</table>
	</body>
</html>`;
}

function renderNotificationText(p: RsvpNotification): string {
	const lines = [
		'New RSVP received — Dolce Vita CT',
		'',
		`Name:       ${p.name}`,
		`Email:      ${p.email}`,
		p.phone ? `Phone:      ${p.phone}` : null,
		p.babyAge ? `Baby age:   ${p.babyAge}` : null,
		p.message ? `\nNote:\n${p.message}` : null,
		'',
		`Source:     ${p.source}`,
		`Submitted:  ${p.submittedAt.toISOString()}`,
		'',
		'Triage at https://cms.bravobyte.co/admin/content/rsvp_submissions'
	];
	return lines.filter(Boolean).join('\n');
}
