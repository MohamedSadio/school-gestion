import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import DataTable from '@/components/DataTable';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

interface GradeEntry {
  id: string;
  eleve: string;
  mathematiques: number;
  francais: number;
  sciences: number;
  histoire: number;
  anglais: number;
  moyenne: number;
  rang: number;
}

const COEFS = { mathematiques: 4, francais: 3, sciences: 3, histoire: 2, anglais: 2 };

function calcMoyenne(g: Omit<GradeEntry, 'id' | 'eleve' | 'moyenne' | 'rang'>) {
  const totalCoef = Object.values(COEFS).reduce((a, b) => a + b, 0);
  const weighted =
    g.mathematiques * COEFS.mathematiques +
    g.francais * COEFS.francais +
    g.sciences * COEFS.sciences +
    g.histoire * COEFS.histoire +
    g.anglais * COEFS.anglais;
  return Math.round((weighted / totalCoef) * 100) / 100;
}

const RAW: Omit<GradeEntry, 'moyenne' | 'rang'>[] = [
  { id: '1', eleve: 'Diallo Amadou', mathematiques: 16, francais: 14, sciences: 15, histoire: 12, anglais: 13 },
  { id: '2', eleve: 'Ba Fatou', mathematiques: 12, francais: 17, sciences: 13, histoire: 15, anglais: 16 },
  { id: '3', eleve: 'Ndiaye Moussa', mathematiques: 14, francais: 11, sciences: 16, histoire: 13, anglais: 10 },
  { id: '4', eleve: 'Sow Aïssatou', mathematiques: 18, francais: 15, sciences: 17, histoire: 14, anglais: 15 },
  { id: '5', eleve: 'Diop Mariama', mathematiques: 10, francais: 13, sciences: 11, histoire: 16, anglais: 14 },
];

function buildGrades(): GradeEntry[] {
  const withMoyenne = RAW.map((r) => ({ ...r, moyenne: calcMoyenne(r), rang: 0 }));
  withMoyenne.sort((a, b) => b.moyenne - a.moyenne);
  withMoyenne.forEach((g, i) => (g.rang = i + 1));
  return withMoyenne;
}

export default function GradesPage() {
  const [selectedClass, setSelectedClass] = useState('3ème A');
  const grades = buildGrades();

  const exportBulletin = (g: GradeEntry) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BULLETIN SCOLAIRE — TRIMESTRE 1', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Élève: ${g.eleve}`, 20, 35);
    doc.text(`Classe: ${selectedClass}`, 20, 42);
    doc.text('Année scolaire: 2024–2025', 20, 49);
    doc.line(20, 55, 190, 55);

    const subjects = [
      ['Mathématiques', g.mathematiques, COEFS.mathematiques],
      ['Français', g.francais, COEFS.francais],
      ['Sciences', g.sciences, COEFS.sciences],
      ['Histoire-Géo', g.histoire, COEFS.histoire],
      ['Anglais', g.anglais, COEFS.anglais],
    ] as const;

    let y = 65;
    doc.setFont('helvetica', 'bold');
    doc.text('Matière', 20, y);
    doc.text('Note /20', 100, y);
    doc.text('Coef.', 140, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    subjects.forEach(([name, note, coef]) => {
      doc.text(String(name), 20, y);
      doc.text(String(note), 100, y);
      doc.text(String(coef), 140, y);
      y += 7;
    });
    y += 5;
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Moyenne générale: ${g.moyenne.toFixed(2)} /20`, 20, y);
    y += 8;
    doc.text(`Rang: ${g.rang}/${grades.length}`, 20, y);

    doc.save(`Bulletin_${g.eleve.replace(/\s/g, '_')}_T1.pdf`);
  };

  const columns = [
    { key: 'rang', header: 'Rang', render: (g: GradeEntry) => <span className="font-medium tabular-nums">{g.rang}</span>, className: 'w-16' },
    { key: 'eleve', header: 'Élève', render: (g: GradeEntry) => <span className="font-medium">{g.eleve}</span> },
    { key: 'mathematiques', header: 'Maths (×4)', className: 'tabular-nums text-center' },
    { key: 'francais', header: 'Français (×3)', className: 'tabular-nums text-center' },
    { key: 'sciences', header: 'Sciences (×3)', className: 'tabular-nums text-center' },
    { key: 'histoire', header: 'Hist-Géo (×2)', className: 'tabular-nums text-center' },
    { key: 'anglais', header: 'Anglais (×2)', className: 'tabular-nums text-center' },
    { key: 'moyenne', header: 'Moyenne', render: (g: GradeEntry) => <span className="font-bold tabular-nums">{g.moyenne.toFixed(2)}</span>, className: 'text-center' },
    {
      key: 'actions',
      header: '',
      render: (g: GradeEntry) => (
        <button onClick={() => exportBulletin(g)} className="p-1 hover:text-accent transition-colors" title="Générer bulletin PDF">
          <FileDown className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Notes & Bulletins" description="Saisie des notes et génération des bulletins trimestriels." />

      <DocumentCard className="mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Classe</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option>3ème A</option>
              <option>3ème B</option>
              <option>6ème A</option>
              <option>6ème B</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Trimestre</label>
            <select className="px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent">
              <option>Trimestre 1</option>
              <option>Trimestre 2</option>
              <option>Trimestre 3</option>
            </select>
          </div>
        </div>
      </DocumentCard>

      <DataTable columns={columns} data={grades} keyExtractor={(g) => g.id} currentPage={1} totalPages={1} />
    </div>
  );
}
