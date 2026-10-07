export const MOCK_USERS = {
  familia: { id: 'f1', name: 'Ana Souza', phone: '(11) 98765-4321', profile: 'familia' },
  cuidador: { id: 'c1', name: 'Maria Oliveira', phone: '(11) 91234-5678', profile: 'cuidador' },
};

export const MOCK_IDOSOS = [
  {
    id: 'i1',
    name: 'José Souza',
    age: 78,
    photo: 'https://i.pravatar.cc/150?img=70',
    conditions: ['Hipertensão', 'Diabetes tipo 2'],
    emergencyContact: { name: 'Carlos Souza', phone: '(11) 99887-6655', relation: 'Filho' },
    medications: [
      { id: 'm1', name: 'Losartana 50mg', schedule: ['08:00', '20:00'], notes: 'Tomar com água' },
      { id: 'm2', name: 'Metformina 500mg', schedule: ['07:00', '12:00', '19:00'], notes: 'Tomar após refeição' },
      { id: 'm3', name: 'AAS 100mg', schedule: ['08:00'], notes: 'Tomar com café da manhã' },
    ],
  },
  {
    id: 'i2',
    name: 'Maria das Graças',
    age: 82,
    photo: 'https://i.pravatar.cc/150?img=47',
    conditions: ['Alzheimer leve', 'Osteoporose'],
    emergencyContact: { name: 'Ana Souza', phone: '(11) 98765-4321', relation: 'Filha' },
    medications: [
      { id: 'm4', name: 'Donepezila 5mg', schedule: ['21:00'], notes: 'Tomar antes de dormir' },
      { id: 'm5', name: 'Cálcio + Vitamina D', schedule: ['12:00'], notes: 'Tomar com almoço' },
    ],
  },
];

export const MOCK_CUIDADORES = [
  {
    id: 'c1',
    name: 'Maria Oliveira',
    age: 42,
    photo: 'https://i.pravatar.cc/150?img=5',
    verified: true,
    rating: 4.9,
    reviewCount: 47,
    experience: '8 anos de experiência com idosos com Alzheimer e doenças crônicas.',
    specialties: ['Alzheimer', 'Diabetes', 'Mobilidade reduzida'],
    region: 'Vila Mariana, SP',
    availability: 'Segunda a sexta, período integral',
    bio: 'Cuidadora dedicada com formação em técnica de enfermagem. Tenho experiência com idosos que precisam de cuidados especiais e adoro criar vínculos com as famílias.',
    documents: ['RG', 'CPF', 'Certificado de Cuidador', 'Antecedentes criminais'],
    references: ['Família Pereira - 3 anos', 'Família Costa - 2 anos'],
    reviews: [
      { author: 'Família Pereira', rating: 5, text: 'Excelente cuidadora, muito atenciosa e carinhosa com nosso pai.', date: '2024-11-15' },
      { author: 'Família Costa', rating: 5, text: 'Recomendo muito! Pontual, responsável e muito dedicada.', date: '2024-10-20' },
    ],
  },
  {
    id: 'c2',
    name: 'João Santos',
    age: 38,
    photo: 'https://i.pravatar.cc/150?img=12',
    verified: true,
    rating: 4.7,
    reviewCount: 31,
    experience: '5 anos com foco em reabilitação e fisioterapia domiciliar.',
    specialties: ['Reabilitação', 'Hipertensão', 'Pós-cirúrgico'],
    region: 'Moema, SP',
    availability: 'Todos os dias, período integral ou parcial',
    bio: 'Técnico em enfermagem com especialização em cuidados domiciliares. Experiência em acompanhamento pós-cirúrgico e reabilitação.',
    documents: ['RG', 'CPF', 'CTE', 'Antecedentes criminais'],
    references: ['Família Almeida - 2 anos', 'Família Rodrigues - 1 ano'],
    reviews: [
      { author: 'Família Almeida', rating: 5, text: 'Muito profissional e cuidadoso. Nosso pai melhorou muito.', date: '2024-12-01' },
      { author: 'Família Rodrigues', rating: 4, text: 'Ótimo profissional, sempre pontual.', date: '2024-09-10' },
    ],
  },
  {
    id: 'c3',
    name: 'Fernanda Lima',
    age: 35,
    photo: 'https://i.pravatar.cc/150?img=9',
    verified: true,
    rating: 4.8,
    reviewCount: 22,
    experience: '6 anos com idosos com demência e cuidados paliativos.',
    specialties: ['Demência', 'Cuidados paliativos', 'Alzheimer'],
    region: 'Pinheiros, SP',
    availability: 'Segunda a sábado, período integral',
    bio: 'Formada em gerontologia, apaixonada por cuidar de idosos com carinho e respeito. Especialista em cuidados paliativos.',
    documents: ['RG', 'CPF', 'Diploma de Gerontologia', 'Antecedentes criminais'],
    references: ['Família Mendes - 3 anos'],
    reviews: [
      { author: 'Família Mendes', rating: 5, text: 'Fernanda é um anjo. Cuida da nossa mãe com muito amor.', date: '2024-11-28' },
    ],
  },
  {
    id: 'c4',
    name: 'Roberto Ferreira',
    age: 45,
    photo: 'https://i.pravatar.cc/150?img=15',
    verified: false,
    rating: 0,
    reviewCount: 0,
    experience: '2 anos como auxiliar de enfermagem.',
    specialties: ['Cuidados básicos', 'Higiene', 'Alimentação'],
    region: 'Santana, SP',
    availability: 'Finais de semana',
    bio: 'Auxiliar de enfermagem buscando oportunidade como cuidador domiciliar. Documentação em processo de verificação.',
    documents: ['RG', 'CPF'],
    references: [],
    reviews: [],
  },
];

export const MOCK_CHECKLIST = [
  { id: 'ch1', type: 'remedio', label: 'Losartana 50mg', time: '08:00', done: true, syncStatus: 'synced' },
  { id: 'ch2', type: 'remedio', label: 'Metformina 500mg', time: '07:00', done: true, syncStatus: 'synced' },
  { id: 'ch3', type: 'remedio', label: 'AAS 100mg', time: '08:00', done: false, syncStatus: 'pending' },
  { id: 'ch4', type: 'refeicao', label: 'Café da manhã', time: '08:30', done: true, syncStatus: 'synced' },
  { id: 'ch5', type: 'refeicao', label: 'Almoço', time: '12:00', done: true, syncStatus: 'synced' },
  { id: 'ch6', type: 'refeicao', label: 'Lanche da tarde', time: '15:30', done: false, syncStatus: 'pending' },
  { id: 'ch7', type: 'higiene', label: 'Banho', time: '09:00', done: true, syncStatus: 'synced' },
  { id: 'ch8', type: 'higiene', label: 'Escovação dos dentes', time: '08:00', done: true, syncStatus: 'synced' },
  { id: 'ch9', type: 'remedio', label: 'Metformina 500mg', time: '12:00', done: false, syncStatus: 'pending' },
  { id: 'ch10', type: 'refeicao', label: 'Jantar', time: '19:00', done: false, syncStatus: 'pending' },
];

export const MOCK_OCORRENCIAS = [
  { id: 'o1', date: '2025-01-15T14:30:00', text: 'Sr. José reclamou de dor leve no joelho direito. Aplicamos compressa fria.', hasPhoto: false, syncStatus: 'synced' },
  { id: 'o2', date: '2025-01-14T10:15:00', text: 'Boa disposição hoje. Fez caminhada curta no corredor.', hasPhoto: false, syncStatus: 'synced' },
  { id: 'o3', date: '2025-01-13T16:45:00', text: 'Recusou o lanche da tarde. Aceitou suco de laranja.', hasPhoto: false, syncStatus: 'synced' },
];

export const MOCK_MESSAGES = [
  { id: 'msg1', senderId: 'c1', text: 'Bom dia! Sr. José tomou todos os remédios da manhã. Está bem disposto hoje.', time: '08:45', date: 'Hoje' },
  { id: 'msg2', senderId: 'f1', text: 'Ótimo! Obrigada, Maria. Ele dormiu bem?', time: '09:02', date: 'Hoje' },
  { id: 'msg3', senderId: 'c1', text: 'Dormiu muito bem! Acordou às 7h sem dificuldades.', time: '09:05', date: 'Hoje' },
  { id: 'msg4', senderId: 'f1', text: 'Que alívio! Vou passar lá no final da tarde.', time: '09:10', date: 'Hoje' },
  { id: 'msg5', senderId: 'c1', text: 'Perfeito! Estarei aqui. 😊', time: '09:12', date: 'Hoje' },
];

export const MOCK_CONVERSAS = [
  { id: 'conv1', name: 'Maria Oliveira', role: 'Cuidadora', lastMessage: 'Dormiu muito bem! Acordou às 7h...', time: '09:12', unread: 0, photo: 'https://i.pravatar.cc/150?img=5' },
  { id: 'conv2', name: 'Suporte Mais Cuidado', role: 'Suporte', lastMessage: 'Como podemos ajudar?', time: 'Ontem', unread: 1, photo: null },
];
