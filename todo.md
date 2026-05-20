# TODO — syncpropertyportalmarketing (Urbimed work)

## Minor issues to fix

### 1. Empty `<price></price>` accidentally skipped
**File:** `routes/xml/index.js` line ~1387-1399
**Problem:** `String(priceRaw).trim() == 0` coerces `""` to `0` → skips properties with missing/empty price for Urbimed.
**Fix:**
```js
if (
  feedAgentRaw === "urbimed" &&
  priceRaw !== undefined && priceRaw !== null &&
  String(priceRaw).trim() !== "" &&
  Number(String(priceRaw).trim()) === 0
) {
  continue;
}
```

### 2. `urbimedTestData.push` runs even when `updatedCRMJSON` empty
**File:** `routes/xml/index.js` line ~1747-1750
**Problem:** Push happens before `Object.keys(updatedCRMJSON).length > 0` gate at line 1753. Test data shows entries that won't actually be sent to CRM.
**Fix:** Move push inside the length-check block, OR guard the push:
```js
if (Object.keys(updatedCRMJSON).length > 0) {
  urbimedTestData.push({ ref: xmlJSON?.ref?._text, updatedCRMJSON });
}
```

### 3. Redundant `feed_agent` extraction
**File:** `routes/xml/index.js` lines 1388 + 1725
**Problem:** Same `feed_agent` lowercase/trim computed twice per row.
**Fix:** Compute once at top of loop, reuse.

---

## Pre-existing bugs (not introduced by Urbimed work, but worth fixing)

### A. `crmJSON = {}` never populated
**File:** `routes/xml/index.js` line ~1370
**Impact:**
- Diff check vs CRM (line ~1568) always fails → every field re-sent every run
- `Properties: crmJSON?.[referenceKey]?.["id"]` (line ~1765) → always `undefined` → log row missing FK
- `Original_JSON: JSON.stringify(crmJSON?.[referenceKey])` (line ~1766) → stringified `undefined`
**Fix:** Fetch existing CRM records (COQL or getRecords) and populate `crmJSON[referenceKey] = record` before main loop. Compare with sibling `syncpropertyproduction` handler for pattern.

### B. `xmlJSON["type"]._text` crash risk
**File:** `routes/xml/index.js` line ~1497-1499 (inside pool block)
**Problem:** Throws TypeError if `<type>` tag missing from XML.
**Fix:** `xmlJSON.type?._text ?? xmlJSON.type?._cdata ?? ""`

### C. `ACCESS_TOKEN_URL` env var trailing backslash
**Problem:** Caused 400 Bad Request. Currently sanitized inline at line ~1346, but 4 other handlers still use raw env.
**Fix:** Clean `.env` file (remove trailing `\`), then revert the inline sanitize.

### D. `valueFromXML.slice(0, 1)` crashes on bare number
**File:** `routes/xml/index.js` line ~1413, 1422 (baths/beds blocks)
**Fix:** `String(valueFromXML?._text ?? valueFromXML).slice(0, 1)`

### E. Operator precedence — `"- " + ... || ...`
**File:** `routes/xml/index.js` line ~1492-1494
**Problem:** Parses as `("- " + undefined) || fallback` → always `"- undefined"`.
**Fix:** `"- " + (valueFromXML?._text || valueFromXML)`

### F. `.split("-")[1].trim()` unsafe
**File:** `routes/xml/index.js` line ~1628
**Problem:** If CRM photo line lacks `-`, throws on `.trim()` of undefined.

### G. No try/catch on outer XML fetch
**File:** `routes/xml/index.js` line ~1355
**Problem:** If `propertyportalmarketing.com` down, `fetch`/`xml2json`/`JSON.parse` throws → 500 with stack.

### H. Authorization header missing `Zoho-oauthtoken` prefix
**Files:** All CRM POST sites — line ~1320, 1773, 1793
**Problem:** Sends raw access token; Zoho v7 expects `Zoho-oauthtoken <token>`. Verify whether token already includes prefix or not.
