import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import DataTable from '@/components/DataTable';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

interface Employee {
  id: string;
  nom: string;
  poste: string;
  salaireBrut: number;
  impots: number;
  net: number;
}

const TAX_RATE = 0.13;

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', nom: 'M. Ndiaye', poste: 'Enseignant Mathématiques', salaireBrut: 450000, impots: 58500, net: 391500 },
  { id: '2', nom: 'Mme Diop', poste: 'Enseignante Français', salaireBrut: 420000, impots: 54600, net: 365400 },
  { id: '3', nom: 'M. Sarr', poste: 'Surveillant Général', salaireBrut: 380000, impots: 49400, net: 330600 },
  { id: '4', nom: 'Mme Fall', poste: 'Secrétaire', salaireBrut: 280000, impots: 36400, net: 243600 },
  { id: '5', nom: 'M. Gueye', poste: 'Agent d\'entretien', salaireBrut: 180000, impots: 23400, net: 156600 },
];

function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

export default function PayrollPage() {
  const [employees] = useState(MOCK_EMPLOYEES);

  const exportPayslip = (e: Employee) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN DE SALAIRE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Employé: ${e.nom}`, 20, 40);
    doc.text(`Poste: ${e.poste}`, 20, 47);
    doc.text(`Période: Octobre 2024`, 20, 54);
    doc.line(20, 62, 190, 62);
    doc.text(`Salaire brut: ${fmt(e.salaireBrut)}`, 20, 75);
    doc.text(`Taux d'imposition: ${(TAX_RATE * 100).toFixed(0)}%`, 20, 82);
    doc.text(`Retenue fiscale: ${fmt(e.impots)}`, 20, 89);
    doc.line(20, 97, 190, 97);
    doc.setFont('helvetica', 'bold');
    doc.text(`Net à payer: ${fmt(e.net)}`, 20, 107);
    doc.save(`Bulletin_Salaire_${e.nom.replace(/\s/g, '_')}.pdf`);
  };

  const totalBrut = employees.reduce((a, e) => a + e.salaireBrut, 0);
  const totalNet = employees.reduce((a, e) => a + e.net, 0);

  const columns = [
    { key: 'nom', header: 'Employé', render: (e: Employee) => <span className="font-medium">{e.nom}</span> },
    { key: 'poste', header: 'Poste' },
    { key: 'salaireBrut', header: 'Brut', render: (e: Employee) => <span className="tabular-nums">{fmt(e.salaireBrut)}</span> },
    { key: 'impots', header: 'Retenues', render: (e: Employee) => <span className="tabular-nums text-destructive">{fmt(e.impots)}</span> },
    { key: 'net', header: 'Net à payer', render: (e: Employee) => <span className="tabular-nums font-bold">{fmt(e.net)}</span> },
    {
      key: 'actions',
      header: '',
      render: (e: Employee) => (
        <button onClick={() => exportPayslip(e)} className="p-1 hover:text-accent transition-colors" title="Bulletin PDF">
          <FileDown className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Gestion de la Paie" description="Bulletins de salaire et calcul des retenues fiscales." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DocumentCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Masse salariale brute</p>
          <p className="text-xl font-serif tabular-nums text-foreground">{fmt(totalBrut)}</p>
        </DocumentCard>
        <DocumentCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total net</p>
          <p className="text-xl font-serif tabular-nums text-foreground">{fmt(totalNet)}</p>
        </DocumentCard>
        <DocumentCard>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Taux d'imposition</p>
          <p className="text-xl font-serif tabular-nums text-accent">{(TAX_RATE * 100).toFixed(0)}%</p>
        </DocumentCard>
      </div>

      <DataTable columns={columns} data={employees} keyExtractor={(e) => e.id} currentPage={1} totalPages={1} />
    </div>
  );
}
