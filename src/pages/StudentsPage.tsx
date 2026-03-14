import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import DataTable from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import DocumentCard from '@/components/DocumentCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Search } from 'lucide-react';

interface Student {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  classe: string;
  dateNaissance: string;
  statut: 'actif' | 'inactif';
  anneeScolaire: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', matricule: 'MAT-2024-001', nom: 'Diallo', prenom: 'Amadou', classe: '3ème A', dateNaissance: '12/03/2009', statut: 'actif', anneeScolaire: '2024-2025' },
  { id: '2', matricule: 'MAT-2024-002', nom: 'Ba', prenom: 'Fatou', classe: '6ème B', dateNaissance: '25/07/2012', statut: 'actif', anneeScolaire: '2024-2025' },
  { id: '3', matricule: 'MAT-2024-003', nom: 'Ndiaye', prenom: 'Moussa', classe: '5ème A', dateNaissance: '03/11/2010', statut: 'actif', anneeScolaire: '2024-2025' },
  { id: '4', matricule: 'MAT-2024-004', nom: 'Sow', prenom: 'Aïssatou', classe: 'Tle S', dateNaissance: '19/01/2006', statut: 'actif', anneeScolaire: '2024-2025' },
  { id: '5', matricule: 'MAT-2024-005', nom: 'Faye', prenom: 'Ibrahima', classe: '4ème B', dateNaissance: '08/09/2008', statut: 'inactif', anneeScolaire: '2024-2025' },
  { id: '6', matricule: 'MAT-2024-006', nom: 'Diop', prenom: 'Mariama', classe: '3ème A', dateNaissance: '14/06/2009', statut: 'actif', anneeScolaire: '2024-2025' },
];

const studentSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').max(50),
  dateNaissance: z.string().min(1, 'La date de naissance est requise'),
  classe: z.string().min(1, 'La classe est requise'),
  anneeScolaire: z.string().min(1, "L'année scolaire est requise"),
});

type StudentForm = z.infer<typeof studentSchema>;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: { anneeScolaire: '2024-2025' },
  });

  const filteredStudents = students.filter(
    (s) =>
      s.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: StudentForm) => {
    const newStudent: Student = {
      id: String(students.length + 1),
      matricule: `MAT-2024-${String(students.length + 1).padStart(3, '0')}`,
      ...data,
      statut: 'actif',
    };
    setStudents([newStudent, ...students]);
    setShowForm(false);
    reset();
  };

  const columns = [
    { key: 'matricule', header: 'Matricule', className: 'font-mono text-xs' },
    {
      key: 'nom',
      header: 'Nom complet',
      render: (s: Student) => (
        <span className="font-medium">{s.nom} {s.prenom}</span>
      ),
    },
    { key: 'classe', header: 'Classe' },
    { key: 'dateNaissance', header: 'Date de naissance', className: 'tabular-nums' },
    { key: 'anneeScolaire', header: 'Année', className: 'tabular-nums' },
    {
      key: 'statut',
      header: 'Statut',
      render: (s: Student) => (
        <StatusBadge
          status={s.statut === 'actif' ? 'success' : 'neutral'}
          label={s.statut === 'actif' ? 'Actif' : 'Inactif'}
        />
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Gestion des Élèves"
        description="Registre des élèves inscrits pour l'année scolaire en cours."
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Annuler' : 'Nouvel élève'}
          </button>
        }
      />

      {showForm && (
        <DocumentCard className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Inscription d'un nouvel élève
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Nom</label>
              <input {...register('nom')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
              {errors.nom && <p className="mt-1 text-xs text-destructive">{errors.nom.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Prénom</label>
              <input {...register('prenom')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
              {errors.prenom && <p className="mt-1 text-xs text-destructive">{errors.prenom.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Date de naissance</label>
              <input {...register('dateNaissance')} type="date" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" />
              {errors.dateNaissance && <p className="mt-1 text-xs text-destructive">{errors.dateNaissance.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Classe</label>
              <select {...register('classe')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent">
                <option value="">Sélectionner</option>
                <option>6ème A</option><option>6ème B</option>
                <option>5ème A</option><option>5ème B</option>
                <option>4ème A</option><option>4ème B</option>
                <option>3ème A</option><option>3ème B</option>
                <option>2nde S</option><option>1ère S</option><option>Tle S</option>
              </select>
              {errors.classe && <p className="mt-1 text-xs text-destructive">{errors.classe.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Année scolaire</label>
              <input {...register('anneeScolaire')} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent" readOnly />
            </div>
            <div className="flex items-end">
              <button type="submit" className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity">
                Enregistrer
              </button>
            </div>
          </form>
        </DocumentCard>
      )}

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un élève…"
          className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        keyExtractor={(s) => s.id}
        emptyMessage="Aucun élève trouvé."
        currentPage={1}
        totalPages={1}
      />
    </div>
  );
}
