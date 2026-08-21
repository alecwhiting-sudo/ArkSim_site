# Privacy & UK data protection — plan

Outstanding compliance work for the site's data collection (contact form,
download-gate email capture). Nothing below has been implemented yet — this
is a to-do list for the site owner, not a description of the current state.
See `DEPLOYMENT.md` for how the underlying systems (Resend, the download
gate, the `arksim_dl_ok` cookie) actually work.

**Caveat on sourcing:** this was researched by having an agent search for
ICO guidance (`ico.org.uk`) — the pages themselves couldn't be fetched
directly in this environment (proxy blocked), so treat every URL below as
something to open and verify before relying on it, not a verbatim quote.

## What's driving this

Two things on the live site currently collect personal data with no privacy
notice in place:
- The contact form (`src/app/api/contact/route.ts`) — name, email, message,
  sent via Resend to a personal Gmail inbox.
- The download gate (`src/app/api/download-lead/route.ts`) — email address,
  sent via Resend, plus a 180-day, non-httpOnly `arksim_dl_ok` cookie
  (`src/lib/site.ts:16`) that unlocks the download without re-entering it.

No analytics package is installed (verified in `package.json`), so that's
not a live issue — just something to double check on the deployed site (see
item 15).

## Hard legal requirements (currently unmet)

1. **Publish a privacy notice**, linked directly from both the contact form
   and the download form (point of collection, not just the footer).
   Required by Article 13 UK GDPR ("right to be informed").
2. **Disclose Resend, Vercel and Google as recipients**, and that data goes
   to the **US**, under the **UK Extension to the EU-US Data Privacy
   Framework** as the transfer mechanism (both Vercel and Resend publicly
   claim certification — verify "Active" status at dataprivacyframework.gov
   before publishing, and re-check annually).
3. **State a real retention period** for emails sitting in the Gmail inbox
   (currently kept indefinitely) — e.g. "deleted 12 months after" — and
   actually delete on that schedule.
4. **Add a data protection complaints route** (new under the Data (Use and
   Access) Act 2025): a stated way to complain, acknowledged within 30 days,
   plus a signpost to the ICO's own complaints process — this needs to sit
   above the ICO link in the notice.
5. **State the lawful basis** for each purpose (see below), and — for the
   download gate specifically — say plainly that an email is required to
   get the installer and why (Art 13(2)(e)).
6. **Deal with the `arksim_dl_ok` cookie under PECR.** It isn't safely
   "strictly necessary" (that's a business choice, not a technical one, and
   ICO judges necessity from the user's perspective). Cleanest fix — no
   site-wide banner needed — fold consent into the download form itself,
   e.g. *"We'll remember this on your device for 180 days (sets a cookie) so
   you don't have to re-enter your email."* Submitting the form becomes the
   affirmative consent. Add a short "Cookies" section to the notice naming
   it, its purpose, and its lifetime.
7. **Confirm the Resend and Vercel DPAs are actually in force** and keep
   dated copies (`vercel.com/legal/dpa`, `resend.com/legal/dpa`) — they're
   processors under Article 28.
8. **Run the ICO fee self-assessment** and either pay the fee or keep the
   "exempt" result on file (see below).

## Lawful basis (Article 6)

- Both the contact form and the download gate are best justified under
  **legitimate interests** (Art 6(1)(f)) — expected by the user, low privacy
  impact. Write a one-page note per purpose (purpose / necessity /
  balancing test) as the accountability record for relying on this basis.
- **Do not email these addresses anything promotional without separate
  consent.** PECR's marketing rules apply regardless of the Art 6 basis
  above, and a beta download is a weak "soft opt-in" foundation. Add a
  **separate, unticked opt-in checkbox** now (e.g. "email me about ArkSim
  updates") — costs nothing today, avoids having to re-contact everyone
  later if a mailing list is wanted.

## ICO registration / data protection fee

- Tiers: **£52 (£47 by Direct Debit)** for turnover ≤ £632k or ≤ 10 staff —
  the tier ArkSim would fall into if payable.
- There's a plausible exemption (advertising/marketing/PR + accounts and
  records) today, but it's narrow and all-or-nothing, and will likely stop
  applying once ArkSim has real accounts, a CRM, or in-app telemetry.
- **Action:** run the self-assessment at
  `ico.org.uk/for-organisations/data-protection-fee/data-protection-fee-self-assessment/`
  and either pay or keep the result on file. Many solo operators in this
  position just pay — it buys certainty and a public-register credibility
  signal for a modest amount.

## Where to get the actual wording (don't draft this from AI memory)

- **`ico.org.uk/create-your-own-privacy-notice`** — ICO's free generator,
  ~15 minutes, question-led. Choose "General business" as the closest
  sector fit. Produces text to adapt, not paste blind.
- **`ico.org.uk/media2/for-organisations/documents/2617552/privacy-notice-template.docx`**
  — ICO's downloadable Word template, if writing from a blank template is
  preferred instead.
- The generator **won't** cover two things — write these by hand:
  - The cookie section for `arksim_dl_ok` (item 6 above).
  - The Resend/Vercel/Google US-transfer disclosure (item 2 above) — check
    `ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/`
    first.

## The weakest link: personal Gmail

`CONTACT_TO` is a personal Gmail address. A free consumer Gmail account
almost certainly doesn't come with a proper Article 28 data-processing
agreement the way Google Workspace does — and that's where lead data
actually sits long-term. Ranks above the cookie question in practical
importance. Options: move to Google Workspace, or use the existing
`divurj.com` Private Email plan (see `DEPLOYMENT.md` for why that's the
cheapest existing option).

## Cheap technical fixes, independent of the legal decisions above

- Add `httpOnly: true` and `secure: true` to the `arksim_dl_ok` cookie set
  in `src/app/api/download-lead/route.ts` — it's only ever read
  server-side, so this costs nothing and is basic Art 32 hygiene.
- Shorten the cookie lifetime from 180 days to something proportionate (e.g.
  30 days, or session-scoped) — makes the PECR consent question much easier
  to defend either way.

## Verify before publishing anything (couldn't check these directly)

- DevTools cookie audit of the live production page in a clean private
  window, before any interaction — confirm nothing beyond `arksim_dl_ok` is
  being set (Vercel toolbar/analytics cookies shouldn't appear on
  production for anonymous visitors, but check).
- Vercel project settings — confirm Web Analytics and Speed Insights are
  off (no package is installed in code, but dashboard-level toggles are
  separate).
- DPF list status for Vercel and Resend at dataprivacyframework.gov
  ("Active", covers non-HR data) — dated screenshot, annual reminder to
  re-check.

## Open decisions for the site owner

- Pay the ICO fee, or run the self-assessment and rely on the exemption?
- Exact retention periods for contact-form and download-lead emails.
- Wording/address for the complaints route.
- Whether to add the marketing opt-in checkbox now or defer it.
- Whether/when to move off personal Gmail for `CONTACT_TO`.

Once these are decided, the actual build-out (privacy policy page, cookie
consent line on the download form, `httpOnly`/`secure`/shorter cookie
lifetime) is a small, mechanical change.
