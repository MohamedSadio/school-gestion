import PageHeader from '@/components/PageHeader';
import DocumentCard from '@/components/DocumentCard';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

const documents = [
  { id: '1', type: 'Fiche de paiement', eleve: 'Diallo Amadou', date: '15/10/2024' },
  { id: '2', type: 'Certificat de scolarité', eleve: 'Ba Fatou', date: '12/10/2024' },
  { id: '3', type: 'Fiche de paiement', eleve: 'Sow Aïssatou', date: '10/10/2024' },
];

export default function DocumentsPage() {
  const generatePaymentSheet = (eleve: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHE DE PAIEMENT', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Élève: ${eleve}`, 20, 40);
    doc.text('Année scolaire: 2024–2025', 20, 47);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 54);
    doc.line(20, 62, 190, 62);
    doc.text('Frais de scolarité: 350.000 FCFA', 20, 75);
    doc.text('Paiement 1: 200.000 FCFA — 15/09/2024', 20, 85);
    doc.text('Paiement 2: 150.000 FCFA — 15/10/2024', 20, 92);
    doc.line(20, 100, 190, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('Total payé: 350.000 FCFA', 20, 110);
    doc.text('Reste à payer: 0 FCFA', 20, 117);
    doc.save(`Fiche_Paiement_${eleve.replace(/\s/g, '_')}.pdf`);
  };

  const generateCertificate = (eleve: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICAT DE SCOLARITÉ', 105, 30, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Le Directeur de l\'établissement GestScolaire certifie que', 105, 55, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(eleve, 105, 70, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('est régulièrement inscrit(e) dans notre établissement', 105, 85, { align: 'center' });
    doc.text('pour l\'année scolaire 2024–2025.', 105, 93, { align: 'center' });
    doc.text(`Fait à Dakar, le ${new Date().toLocaleDateString('fr-FR')}`, 105, 115, { align: 'center' });
    doc.text('Le Directeur', 150, 145);
    doc.text('_________________', 140, 165);
    // QR code placeholder
    doc.setFontSize(8);
    doc.text('QR Code de vérification: [À intégrer]', 20, 280);
    doc.save(`Certificat_${eleve.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Documents" description="Génération et téléchargement des documents officiels." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Fiche de paiement</h3>
          <p className="text-sm text-muted-foreground mb-4">Liste des paiements d'un élève avec total payé et restant.</p>
          <button
            onClick={() => generatePaymentSheet('Diallo Amadou')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            <FileDown className="h-4 w-4" /> Générer un exemple
          </button>
        </DocumentCard>
        <DocumentCard>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Certificat de scolarité</h3>
          <p className="text-sm text-muted-foreground mb-4">Document officiel avec signature et QR code de vérification.</p>
          <button
            onClick={() => generateCertificate('Ba Fatou')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            <FileDown className="h-4 w-4" /> Générer un exemple
          </button>
        </DocumentCard>
      </div>

      <DocumentCard>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Documents récents</h3>
        <div className="divide-y divide-border">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{d.type}</p>
                <p className="text-xs text-muted-foreground">{d.eleve} — {d.date}</p>
              </div>
              <button className="p-1.5 hover:text-accent transition-colors">
                <FileDown className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </DocumentCard>
    </div>
  );
}
