import { NextResponse } from 'next/server';
import { getPrisma } from '../../../../lib/prisma.js';

/**
 * Sign-ups for the CEIBA community of practice.
 *
 * The rest of the site is statically prerendered; this is the only route with a
 * runtime, so it is deliberately self-contained. Validation is hand-rolled
 * rather than pulling in a schema library — the project has no validation
 * dependency and this is five fields.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FIELDS = {
  name: { min: 2, max: 120 },
  email: { min: 5, max: 200 },
  organization: { min: 2, max: 160 },
  position: { min: 2, max: 120 },
  motivation: { min: 10, max: 2000 },
};

function validate(body) {
  const values = {};
  const errors = {};

  Object.entries(FIELDS).forEach(([field, { min, max }]) => {
    const raw = typeof body?.[field] === 'string' ? body[field].trim() : '';

    if (raw.length === 0) {
      errors[field] = 'required';
      return;
    }
    if (raw.length < min) {
      errors[field] = 'tooShort';
      return;
    }
    if (raw.length > max) {
      errors[field] = 'tooLong';
      return;
    }

    values[field] = raw;
  });

  if (!errors.email && !EMAIL_PATTERN.test(values.email)) {
    errors.email = 'invalid';
  }

  return {
    values: { ...values, email: values.email?.toLowerCase() },
    errors,
    ok: Object.keys(errors).length === 0,
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'badRequest' }, { status: 400 });
  }

  const { values, errors, ok } = validate(body);
  if (!ok) {
    return NextResponse.json({ error: 'validation', fields: errors }, { status: 422 });
  }

  const locale = body?.locale === 'en' ? 'en' : 'es';

  try {
    const prisma = await getPrisma();
    const registration = await prisma.ceibaRegistration.create({
      data: { ...values, locale },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, id: registration.id }, { status: 201 });
  } catch (error) {
    // Unique constraint on email — someone already signed up with it.
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 });
    }

    console.error('[ceiba/registro] failed to store registration', error);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
