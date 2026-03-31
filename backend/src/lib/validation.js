const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {unknown} value
 */
export function toNonEmptyString(value) {
	return typeof value === 'string' ? value.trim() : '';
}

/**
 * @param {unknown} value
 */
export function toInteger(value) {
	if (typeof value === 'number' && Number.isInteger(value)) return value;
	if (typeof value === 'string' && value.trim() !== '' && /^-?\d+$/.test(value.trim())) {
		return Number(value);
	}
	return NaN;
}

/**
 * @param {unknown} value
 */
export function isValidEmail(value) {
	return EMAIL_REGEX.test(toNonEmptyString(value).toLowerCase());
}

/**
 * @param {unknown} value
 */
export function parseIsoDate(value) {
	const text = toNonEmptyString(value);
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
	if (!match) return null;

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(Date.UTC(year, month - 1, day));

	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() + 1 !== month ||
		date.getUTCDate() !== day
	) {
		return null;
	}

	return date;
}

/**
 * @param {Date} start
 * @param {Date} end
 */
export function differenceInDays(start, end) {
	return Math.floor((end.getTime() - start.getTime()) / 86_400_000);
}

/**
 * @param {unknown} value
 */
export function normalizeRoomLookup(value) {
	const str = toNonEmptyString(value).toLowerCase();
	if (!str) return null;

	if (/^\d+$/.test(str)) {
		return { kind: 'id', value: Number(str) };
	}

	return { kind: 'code', value: str };
}
