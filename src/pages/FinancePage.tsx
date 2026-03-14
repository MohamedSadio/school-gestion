import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { FileDown, Search } from 'lucide-react';
import jsPDF from 'jspdf';

interface Invoice {
  id: string;
  numero: string;
  eleve: string;
  montant: number;
  paye: number;
  statut: 'PAYE' | 'PARTIEL' | 'IMPAYE';
  date: string;
  anneeScolaire: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: '1', numero: 'FAC-2024-001', eleve: 'Diallo Amadou', montant: 350000, paye: 350000, statut: 'PAYE', date: '15/09/2024', anneeScolaire: '2024-2025' },
  { id: '2', numero: 'FAC-2024-002', eleve: 'Ba Fatou', montant: 350000, paye: 200000, statut: 'PARTIEL', date: '15/09/2024', anneeScolaire: '2024-2025' },
  { id: '3', numero: 'FAC-2024-003', eleve: 'Ndiaye Moussa', montant: 350000, paye: 0, statut: 'IMPAYE', date: '15/09/2024', anneeScolaire: '2024-2025' },
  { id: '4', numero: 'FAC-2024-004', eleve: 'Sow Aïssatou', montant: 450000, paye: 450000, statut: 'PAYE', date: '20/09/2024', anneeScolaire: '2024-2025' },
  { id: '5', numero: 'FAC-2024-005', eleve: 'Faye Ibrahima', montant: 350000, paye: 100000, statut: 'PARTIEL', date: '22/09/2024', anneeScolaire: '2024-2025' },
];

const MONTHLY_CLOSINGS = [
  { month: 'Septembre 2024', status: 'locked' as const, total: '4.250.000 FCFA' },
  { month: 'Octobre 2024', status: 'open' as const, total: '3.180.000 FCFA' },
];

function formatCurrency(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export default function FinancePage() {
  const [invoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState('');
  const [closings, setClosings] = useState(MONTHLY_CLOSINGS);

  const filtered = invoices.filter((i) =>
    i.eleve.toLowerCase().includes(search.toLowerCase()) ||
    i.numero.toLowerCase().includes(search.toLowerCase())
  );

  const statusMap: Record<string, { status: 'success' | 'warning' | 'danger'; label: string }> = {
    PAYE: { status: 'success', label: 'Payé' },
    PARTIEL: { status: 'warning', label: 'Partiel' },
    IMPAYE: { status: 'danger', label: 'Impayé' },
  };

  const handleCloseMonth = (month: string) => {
    setClosings((prev) =>
      prev.map((c) => (c.month === month ? { ...c, status: 'locked' as const } : c))
    );
  };

  const exportInvoicePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('FACTURE', 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° ${invoice.numero}`, 20, 40);
    doc.text(`Date: ${invoice.date}`, 20, 47);
    doc.text(`Élève: ${invoice.eleve}`, 20, 54);
    doc.text(`Année scolaire: ${invoice.anneeScolaire}`, 20, 61);
    doc.line(20, 70, 190, 70);
    doc.text(`Montant total: ${formatCurrency(invoice.montant)}`, 20, 82);
    doc.text(`Montant payé: ${formatCurrency(invoice.paye)}`, 20, 89);
    doc.text(`Reste à payer: ${formatCurrency(invoice.montant - invoice.paye)}`, 20, 96);
    doc.text(`Statut: ${invoice.statut}`, 20, 103);
    doc.save(`${invoice.numero}.pdf`);
  };

  const columns = [
    { key: 'numero', header: 'N° Facture', className: 'font-mono text-xs' },
    { key: 'eleve', header: 'Élève', render: (i: Invoice) => <span className="font-medium">{i.eleve}</span> },
    { key: 'montant', header: 'Montant', render: (i: Invoice) => <span className="tabular-nums">{formatCurrency(i.montant)}</span> },
    { key: 'paye', header: 'Payé', render: (i: Invoice) => <span className="tabular-nums">{formatCurrency(i.paye)}</span> },
    {
      key: 'statut',
      header: 'Statut',
      render: (i: Invoice) => <StatusBadge {...statusMap[i.statut]} />,
    },
    { key: 'date', header: 'Date', className: 'tabular-nums' },
    {
      key: 'actions',
      header: '',
      render: (i: Invoice) => (
        <button onClick={() => exportInvoicePDF(i)} className="p-1 hover:text-accent transition-colors" title="Télécharger PDF">
          <FileDown className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Finances" description="Gestion des factures et clôtures mensuelles." />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DocumentCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total facturé</p>
          <p className="text-xl font-serif tabular-nums text-foreground">1.850.000 FCFA</p>
        </DocumentCard>
        <DocumentCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total encaissé</p>
          <p className="text-xl font-serif tabular-nums text-success">1.100.000 FCFA</p>
        </DocumentCard>
        <DocumentCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Impayés</p>
          <p className="text-xl font-serif tabular-nums text-destructive">750.000 FCFA</p>
        </DocumentCard>
      </div>

      {/* Monthly Closings */}
      <DocumentCard className="mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Journal de caisse — Clôtures mensuelles</h3>
        <div className="divide-y divide-border">
          {closings.map((c) => (
            <div key={c.month} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{c.month}</p>
                <p className="text-xs text-muted-foreground tabular-nums">{c.total}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  status={c.status === 'locked' ? 'neutral' : 'success'}
                  label={c.status === 'locked' ? 'Verrouillé' : 'Ouvert'}
                />
                {c.status === 'open' && (
                  <button
                    onClick={() => handleCloseMonth(c.month)}
                    className="px-3 py-1 text-xs font-medium border border-border rounded-sm hover:bg-muted transition-colors"
                  >
                    Clôturer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </DocumentCard>

      {/* Search + Table */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une facture…"
          className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(i) => i.id} currentPage={1} totalPages={1} />
    </div>
  );
}
