import {
  DbError,
  EmptyState,
  PageHeader,
  SectionHeader,
  StatusPill,
  btnGhost,
  btnPrimary,
  cardClass,
  inputClass,
  tableWrap,
  tdClass,
  thClass,
  trClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { INVOICE_STATUSES, PAYMENT_STATUSES } from "@/lib/validation/admin";
import {
  createContract,
  createInvoice,
  createPayment,
  updateInvoiceStatus,
  updatePaymentStatus,
} from "./actions";

export default async function FinancePage() {
  const { supabase } = await requireAdmin();
  const [
    { data: companies },
    { data: contracts, error: cErr },
    { data: invoices, error: iErr },
    { data: payments, error: pErr },
  ] = await Promise.all([
    supabase.from("companies").select("id, name").order("name"),
    supabase
      .from("contracts")
      .select("id, title, status, company_id, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, amount_cents, currency, status, company_id, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("payments")
      .select("id, invoice_id, amount_cents, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const err = cErr ?? iErr ?? pErr;
  const companyMap = new Map((companies ?? []).map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Contracts, invoices, and payment status."
      />
      {err ? <DbError message={err.message} /> : null}

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <form action={createContract} className={`${cardClass()} space-y-3`}>
          <SectionHeader title="New contract" />
          <select name="companyId" required className={inputClass()} defaultValue="">
            <option value="" disabled>
              Company
            </option>
            {(companies ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="title" required placeholder="Title" className={inputClass()} />
          <button type="submit" className={btnPrimary()}>
            Create
          </button>
        </form>

        <form action={createInvoice} className={`${cardClass()} space-y-3`}>
          <SectionHeader title="New invoice" />
          <select name="companyId" required className={inputClass()} defaultValue="">
            <option value="" disabled>
              Company
            </option>
            {(companies ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            name="amount"
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            className={inputClass()}
          />
          <button type="submit" className={btnPrimary()}>
            Create
          </button>
        </form>

        <form action={createPayment} className={`${cardClass()} space-y-3`}>
          <SectionHeader title="Record payment" />
          <select name="invoiceId" required className={inputClass()} defaultValue="">
            <option value="" disabled>
              Invoice
            </option>
            {(invoices ?? []).map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.currency} {(inv.amount_cents / 100).toFixed(2)} · {inv.status}
              </option>
            ))}
          </select>
          <input
            name="amount"
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            className={inputClass()}
          />
          <button type="submit" className={btnPrimary()}>
            Create
          </button>
        </form>
      </div>

      <SectionHeader title="Contracts" />
      {!contracts?.length ? (
        <div className="mb-8">
          <EmptyState
            title="No contracts yet"
            description="Create a contract from the form above."
          />
        </div>
      ) : (
        <div className={`${tableWrap()} mb-8`}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>Title</th>
                <th className={thClass()}>Company</th>
                <th className={thClass()}>Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className={trClass()}>
                  <td className={tdClass()}>{c.title}</td>
                  <td className={tdClass()}>
                    {c.company_id ? companyMap.get(c.company_id) : "—"}
                  </td>
                  <td className={tdClass()}>
                    <StatusPill value={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SectionHeader title="Invoices" />
      {!invoices?.length ? (
        <div className="mb-8">
          <EmptyState
            title="No invoices yet"
            description="Create an invoice from the form above."
          />
        </div>
      ) : (
        <div className={`${tableWrap()} mb-8`}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>Amount</th>
                <th className={thClass()}>Company</th>
                <th className={thClass()}>Status</th>
                <th className={thClass()}>Update</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className={trClass()}>
                  <td className={tdClass()}>
                    {inv.currency} {(inv.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className={tdClass()}>
                    {inv.company_id ? companyMap.get(inv.company_id) : "—"}
                  </td>
                  <td className={tdClass()}>
                    <StatusPill value={inv.status} />
                  </td>
                  <td className={tdClass()}>
                    <form action={updateInvoiceStatus} className="flex flex-wrap gap-2">
                      <input type="hidden" name="invoiceId" value={inv.id} />
                      <select
                        name="status"
                        defaultValue={inv.status}
                        className={inputClass()}
                      >
                        {INVOICE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className={btnGhost()}>
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SectionHeader title="Payments" />
      {!payments?.length ? (
        <EmptyState
          title="No payments yet"
          description="Record a payment against an invoice when funds clear."
        />
      ) : (
        <div className={tableWrap()}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>Amount</th>
                <th className={thClass()}>Status</th>
                <th className={thClass()}>Update</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className={trClass()}>
                  <td className={tdClass()}>
                    {(p.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className={tdClass()}>
                    <StatusPill value={p.status} />
                  </td>
                  <td className={tdClass()}>
                    <form action={updatePaymentStatus} className="flex flex-wrap gap-2">
                      <input type="hidden" name="paymentId" value={p.id} />
                      <select
                        name="status"
                        defaultValue={p.status}
                        className={inputClass()}
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className={btnGhost()}>
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
