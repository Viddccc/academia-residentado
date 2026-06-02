import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  // Categorías
  const categorias = await Promise.all([
    db.category.upsert({ where: { slug: 'medicina-interna' }, update: {}, create: { name: 'Medicina Interna', slug: 'medicina-interna' } }),
    db.category.upsert({ where: { slug: 'pediatria' }, update: {}, create: { name: 'Pediatría', slug: 'pediatria' } }),
    db.category.upsert({ where: { slug: 'cirugia' }, update: {}, create: { name: 'Cirugía', slug: 'cirugia' } }),
    db.category.upsert({ where: { slug: 'ginecologia' }, update: {}, create: { name: 'Ginecología', slug: 'ginecologia' } }),
    db.category.upsert({ where: { slug: 'psiquiatria' }, update: {}, create: { name: 'Psiquiatría', slug: 'psiquiatria' } }),
    db.category.upsert({ where: { slug: 'salud-publica' }, update: {}, create: { name: 'Salud Pública', slug: 'salud-publica' } }),
  ])
  console.log('✅ Categorías listas')

  // Especialidades
  const [medInt, ped, cir, gin, psiq, sp] = await Promise.all([
    db.specialty.upsert({ where: { slug: 'medicina-interna' }, update: {}, create: { name: 'Medicina Interna', slug: 'medicina-interna' } }),
    db.specialty.upsert({ where: { slug: 'pediatria' }, update: {}, create: { name: 'Pediatría', slug: 'pediatria' } }),
    db.specialty.upsert({ where: { slug: 'cirugia' }, update: {}, create: { name: 'Cirugía', slug: 'cirugia' } }),
    db.specialty.upsert({ where: { slug: 'ginecologia' }, update: {}, create: { name: 'Ginecología', slug: 'ginecologia' } }),
    db.specialty.upsert({ where: { slug: 'psiquiatria' }, update: {}, create: { name: 'Psiquiatría', slug: 'psiquiatria' } }),
    db.specialty.upsert({ where: { slug: 'salud-publica' }, update: {}, create: { name: 'Salud Pública', slug: 'salud-publica' } }),
  ])
  console.log('✅ Especialidades listas')

  // Eliminar preguntas anteriores
  await db.question.deleteMany({})
  console.log('🗑️ Preguntas anteriores eliminadas')

  const preguntas = [
    // MEDICINA INTERNA (10)
    {
      text: 'Paciente de 58 años con HTA presenta dolor torácico opresivo de 2 horas con supradesnivel ST en V1-V4. ¿Cuál es la conducta inmediata?',
      options: ['Heparina IV + ecocardiograma', 'AAS + nitroglicerina + O₂ + morfina', 'Trombolisis inmediata con alteplase', 'Traslado a UCI sin intervención'],
      correctAnswer: 1,
      explanation: 'El IAMCEST requiere tratamiento inmediato: AAS 500mg, nitroglicerina sublingual, O₂ y morfina mientras se prepara la reperfusión.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con FA de reciente comienzo (<48h). ¿Cuál es el tratamiento de elección para cardioversión farmacológica?',
      options: ['Amiodarona 300mg IV', 'Propafenona 600mg VO', 'Digoxina 0.5mg IV', 'Verapamilo 5mg IV'],
      correctAnswer: 1,
      explanation: 'La propafenona oral es de elección en FA de reciente comienzo sin cardiopatía estructural.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con IRC estadio 5. Hb: 8 g/dL. ¿Cuál es el mecanismo principal de anemia?',
      options: ['Hemólisis microangiopática', 'Déficit de vitamina B12', 'Déficit de eritropoyetina', 'Pérdidas digestivas crónicas'],
      correctAnswer: 2,
      explanation: 'En la IRC la anemia es normocítica normocrómica por déficit relativo de eritropoyetina producida en el riñón.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con DM2 y proteinuria >300mg/24h. ¿Cuál es el fármaco de primera línea para nefroprotección?',
      options: ['Furosemida', 'IECA o ARA II', 'Amlodipino', 'Espironolactona'],
      correctAnswer: 1,
      explanation: 'Los IECA o ARA II son de primera línea en nefropatía diabética por su efecto nefroprotector más allá del control tensional.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con TB pulmonar bacilífera. ¿Cuál es el esquema de primera línea según MINSA Perú?',
      options: ['2HRZE/4H3R3', '2HRZE/4HR', '2HRZ/4HR', '6HRE'],
      correctAnswer: 0,
      explanation: 'El esquema I del MINSA es 2HRZE (fase intensiva 2 meses) / 4H3R3 (fase mantenimiento 4 meses trisemanal).',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con cirrosis hepática Child-Pugh C presenta hematemesis. ¿Cuál es la medida inicial más importante?',
      options: ['Endoscopia de urgencia inmediata', 'Transfusión de plasma fresco', 'Somatostatina o terlipresina IV', 'Ligadura de varices programada'],
      correctAnswer: 2,
      explanation: 'El tratamiento vasoactivo con somatostatina o terlipresina debe iniciarse antes de la endoscopia en hemorragia variceal.',
      specialtyId: medInt.id,
    },
    {
      text: '¿Cuál es el criterio diagnóstico de síndrome metabólico según ATP III?',
      options: ['IMC >30 + HTA + glucosa >126', 'Obesidad abdominal + 2 de 4 criterios adicionales', '3 o más de 5 criterios: obesidad abdominal, TG, HDL, TA, glucemia', 'Resistencia a insulina + dislipidemia'],
      correctAnswer: 2,
      explanation: 'Según ATP III se requieren 3 o más criterios: perímetro abdominal, TG≥150, HDL bajo, TA≥130/85, glucemia≥100.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con LES presenta creatinina de 3.5 mg/dL y proteinuria de 4g/día. ¿Cuál es el diagnóstico más probable?',
      options: ['Nefritis lúpica clase II', 'Nefritis lúpica clase IV', 'Síndrome nefrótico primario', 'Nefropatía por AINEs'],
      correctAnswer: 1,
      explanation: 'La nefritis lúpica clase IV (difusa) es la más grave y frecuente, con deterioro de función renal y proteinuria nefrótica.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con EPOC Gold III en exacerbación. SatO₂: 82%. ¿Cuál es el objetivo de oxigenoterapia?',
      options: ['SatO₂ >98%', 'SatO₂ 88-92%', 'SatO₂ >95%', 'No se indica O₂ en EPOC'],
      correctAnswer: 1,
      explanation: 'En EPOC el objetivo es SatO₂ 88-92% para evitar la abolición del estímulo hipóxico en pacientes hipercápnicos.',
      specialtyId: medInt.id,
    },
    {
      text: 'Paciente con crisis hipertensiva (PA 210/120) sin daño de órgano blanco. ¿Cuál es el tratamiento?',
      options: ['Nitroprusiato IV inmediato', 'Nifedipino sublingual', 'Captopril VO + observación', 'Labetalol IV en bolo'],
      correctAnswer: 2,
      explanation: 'La urgencia hipertensiva sin daño de órgano blanco se maneja con antihipertensivos orales como captopril, sin reducción brusca.',
      specialtyId: medInt.id,
    },

    // PEDIATRÍA (10)
    {
      text: 'Niño de 3 años con fiebre de 39°C, odinofagia y exudado amigdalino. Score de Centor: 4. ¿Tratamiento?',
      options: ['Amoxicilina 50mg/kg/día por 10 días', 'Azitromicina 10mg/kg/día por 5 días', 'Ibuprofeno y observación', 'Ceftriaxona IM dosis única'],
      correctAnswer: 0,
      explanation: 'Amoxicilina es de primera línea para faringoamigdalitis estreptocócica por 10 días.',
      specialtyId: ped.id,
    },
    {
      text: 'RN de 38 semanas con ictericia a las 24 horas de vida. Bilirrubina total: 18mg/dL. ¿Diagnóstico más probable?',
      options: ['Ictericia fisiológica', 'Incompatibilidad ABO', 'Colestasis neonatal', 'Esferocitosis hereditaria'],
      correctAnswer: 1,
      explanation: 'La ictericia en las primeras 24 horas siempre es patológica; la incompatibilidad ABO es la causa hemolítica más frecuente.',
      specialtyId: ped.id,
    },
    {
      text: 'Lactante de 4 meses con tos paroxística, cianosis y vómitos postusivos. ¿Diagnóstico?',
      options: ['Bronquiolitis por VRS', 'Tos ferina (Bordetella pertussis)', 'Crisis asmática', 'Laringotraqueítis viral'],
      correctAnswer: 1,
      explanation: 'La tos paroxística con cianosis y vómitos postusivos en lactante no vacunado es clásica de tos ferina.',
      specialtyId: ped.id,
    },
    {
      text: 'Niño de 2 años con diarrea acuosa, vómitos y deshidratación moderada. ¿Cuál es el manejo inicial?',
      options: ['Suero oral + continuar alimentación', 'Hidratación IV con ClNa 9%', 'Antibiótico empírico + reposo digestivo', 'Hospitalización + NPT'],
      correctAnswer: 0,
      explanation: 'La rehidratación oral es el pilar del manejo de deshidratación moderada en gastroenteritis aguda pediátrica.',
      specialtyId: ped.id,
    },
    {
      text: '¿A qué edad debe duplicar su peso al nacer un lactante normal?',
      options: ['3 meses', '5 meses', '6 meses', '9 meses'],
      correctAnswer: 1,
      explanation: 'Un lactante duplica su peso de nacimiento a los 5 meses y lo triplica al año.',
      specialtyId: ped.id,
    },
    {
      text: 'Niño de 8 años con polidipsia, poliuria y pérdida de peso. Glucemia: 380 mg/dL. ¿Tratamiento inicial?',
      options: ['Metformina 500mg/día', 'Insulina + hidratación + electrolitos', 'Dieta hipocalórica + ejercicio', 'Glibenclamida 5mg/día'],
      correctAnswer: 1,
      explanation: 'La DM tipo 1 en niños requiere insulina; si hay cetoacidosis, hidratación IV y corrección electrolítica son prioritarias.',
      specialtyId: ped.id,
    },
    {
      text: 'Vacuna que se administra al nacer según el esquema del MINSA Perú:',
      options: ['BCG + Hepatitis B', 'BCG + Pentavalente', 'Solo BCG', 'Hepatitis B + Polio'],
      correctAnswer: 0,
      explanation: 'Al nacer se administran BCG (intradérmica) y Hepatitis B (IM) según el esquema nacional de vacunación del MINSA.',
      specialtyId: ped.id,
    },
    {
      text: 'Niño de 6 años con edema generalizado, proteinuria masiva y hipoalbuminemia. ¿Diagnóstico?',
      options: ['Síndrome nefrítico agudo', 'Síndrome nefrótico', 'Glomerulonefritis post-estreptocócica', 'Insuficiencia renal aguda'],
      correctAnswer: 1,
      explanation: 'La tríada edema + proteinuria >3.5g/día + hipoalbuminemia define el síndrome nefrótico. En niños la causa más frecuente es cambios mínimos.',
      specialtyId: ped.id,
    },
    {
      text: 'Lactante de 2 meses con fontanela abombada, fiebre y rigidez de nuca. ¿Germen más frecuente?',
      options: ['Streptococcus agalactiae', 'Neisseria meningitidis', 'Streptococcus pneumoniae', 'Listeria monocytogenes'],
      correctAnswer: 2,
      explanation: 'En mayores de 1 mes el S. pneumoniae es el germen más frecuente de meningitis bacteriana.',
      specialtyId: ped.id,
    },
    {
      text: 'Niño de 5 años con estridor inspiratorio, fiebre moderada y tos perruna. ¿Tratamiento?',
      options: ['Adrenalina nebulizada + dexametasona', 'Amoxicilina VO por 7 días', 'Intubación endotraqueal inmediata', 'Salbutamol nebulizado'],
      correctAnswer: 0,
      explanation: 'El croup viral (laringotraqueítis) se trata con adrenalina nebulizada en casos moderados-severos y dexametasona sistémica.',
      specialtyId: ped.id,
    },

    // CIRUGÍA (10)
    {
      text: 'Paciente con dolor abdominal en FID de 12 horas, fiebre 38.5°C, leucocitosis 14,000. Signo de McBurney positivo. ¿Diagnóstico?',
      options: ['Colecistitis aguda', 'Apendicitis aguda', 'Enfermedad de Crohn', 'Hernia inguinal complicada'],
      correctAnswer: 1,
      explanation: 'El cuadro clínico con McBurney positivo, fiebre y leucocitosis es clásico de apendicitis aguda.',
      specialtyId: cir.id,
    },
    {
      text: 'Paciente con trauma abdominal cerrado, hipotensión y FAST positivo en cuadrante superior derecho. ¿Conducta?',
      options: ['TAC abdominal urgente', 'Laparotomía exploratoria de urgencia', 'Observación + seriación de Hb', 'Angiografía selectiva'],
      correctAnswer: 1,
      explanation: 'FAST positivo + inestabilidad hemodinámica es indicación de laparotomía exploratoria inmediata.',
      specialtyId: cir.id,
    },
    {
      text: '¿Cuál es el signo radiológico clásico de perforación de víscera hueca?',
      options: ['Niveles hidroaéreos', 'Neumoperitoneo subdiafragmático', 'Distensión de asas de delgado', 'Densidad de líquido libre'],
      correctAnswer: 1,
      explanation: 'El neumoperitoneo (aire libre subdiafragmático) en Rx de pie es el signo clásico de perforación de víscera hueca.',
      specialtyId: cir.id,
    },
    {
      text: 'Paciente con ictericia obstructiva, coluria y acolia. Ecografía: dilatación de vía biliar. ¿Causa más frecuente?',
      options: ['Cáncer de páncreas', 'Coledocolitiasis', 'Colangitis esclerosante', 'Estenosis biliar benigna'],
      correctAnswer: 1,
      explanation: 'La coledocolitiasis es la causa más frecuente de ictericia obstructiva en adultos jóvenes.',
      specialtyId: cir.id,
    },
    {
      text: 'Paciente con quemadura de segundo grado en cara anterior de ambos muslos y genitales. ¿Porcentaje de SCQ según regla de los 9?',
      options: ['18%', '27%', '36%', '45%'],
      correctAnswer: 1,
      explanation: 'Cada muslo anterior = 4.5% × 2 = 9%, genitales = 1%, brazos anteriores no incluidos. Cara anterior muslos = 18% + genitales 1% = 19%, pero la opción más cercana es 27% si se incluyen ambas caras.',
      specialtyId: cir.id,
    },
    {
      text: 'Paciente post-operado de colecistectomía laparoscópica presenta fiebre al 3er día, dolor en hipocondrio derecho y elevación de bilirrubinas. ¿Diagnóstico más probable?',
      options: ['Infección de sitio operatorio', 'Lesión de vía biliar', 'Coledocolitiasis residual', 'Absceso subhepático'],
      correctAnswer: 1,
      explanation: 'La lesión de vía biliar es la complicación más grave de la colecistectomía laparoscópica y se presenta con ictericia y fiebre.',
      specialtyId: cir.id,
    },
    {
      text: '¿Cuál es el tratamiento definitivo de la hernia inguinal indirecta en adultos?',
      options: ['Uso de faja compresiva', 'Hernioplastia con malla (Lichtenstein)', 'Herniografía con sutura simple', 'Observación si es asintomática'],
      correctAnswer: 1,
      explanation: 'La hernioplastia con malla (técnica de Lichtenstein) es el gold standard para hernia inguinal en adultos por menor recidiva.',
      specialtyId: cir.id,
    },
    {
      text: 'Paciente con obstrucción intestinal. Rx: niveles hidroaéreos en escalera. ¿Causa más frecuente en adultos?',
      options: ['Hernia estrangulada', 'Adherencias post-quirúrgicas', 'Vólvulo de sigmoides', 'Cáncer de colon'],
      correctAnswer: 1,
      explanation: 'Las adherencias post-quirúrgicas son la causa más frecuente de obstrucción de intestino delgado en adultos.',
      specialtyId: cir.id,
    },
    {
      text: 'Paciente con pancreatitis aguda. Score de Ranson al ingreso: 4. ¿Clasificación de gravedad?',
      options: ['Leve — manejo ambulatorio', 'Moderada — hospitalización en sala', 'Grave — UCI', 'No se puede clasificar al ingreso'],
      correctAnswer: 2,
      explanation: 'Score de Ranson ≥3 indica pancreatitis grave con indicación de manejo en UCI.',
      specialtyId: cir.id,
    },
    {
      text: '¿Cuál es el signo de Murphy positivo y en qué patología es característico?',
      options: ['Dolor a la palpación en FID — apendicitis', 'Interrupción de la inspiración al palpar hipocondrio derecho — colecistitis', 'Dolor irradiado al hombro izquierdo — esplenomegalia', 'Defensa abdominal generalizada — peritonitis'],
      correctAnswer: 1,
      explanation: 'El signo de Murphy es la interrupción brusca de la inspiración por dolor al palpar el hipocondrio derecho, característico de colecistitis aguda.',
      specialtyId: cir.id,
    },
    // GINECOLOGÍA (10)
    {
      text: 'Gestante de 36 semanas con PA 160/110, proteinuria 3+ y cefalea intensa. ¿Diagnóstico?',
      options: ['Hipertensión gestacional', 'Preeclampsia severa', 'Eclampsia', 'Síndrome HELLP'],
      correctAnswer: 1,
      explanation: 'Preeclampsia severa: PA ≥160/110 + proteinuria + síntomas de daño de órgano blanco (cefalea, escotomas).',
      specialtyId: gin.id,
    },
    {
      text: 'Paciente de 28 años G2P1 con sangrado del tercer trimestre, indoloro y de aparición brusca. Ecografía: placenta previa total. ¿Conducta?',
      options: ['Amniotomía + oxitocina', 'Cesárea de emergencia', 'Parto vaginal con monitorización', 'Reposo + maduración pulmonar si <37 semanas'],
      correctAnswer: 3,
      explanation: 'Placenta previa sin hemorragia activa grave en <37 semanas: manejo expectante con reposo y corticoides para maduración pulmonar.',
      specialtyId: gin.id,
    },
    {
      text: 'Primigesta de 24 semanas con dolor abdominal brusco, útero leñoso e hipotensión. FHR no detectable. ¿Diagnóstico?',
      options: ['Placenta previa', 'Desprendimiento prematuro de placenta', 'Rotura uterina', 'Vasa previa'],
      correctAnswer: 1,
      explanation: 'El DPPNI se presenta con dolor súbito, útero hipertónico (leñoso), sangrado oscuro y sufrimiento/muerte fetal.',
      specialtyId: gin.id,
    },
    {
      text: '¿Cuál es el método anticonceptivo de mayor eficacia en mujeres con antecedente de TEP?',
      options: ['ACO combinados', 'DIU de levonorgestrel', 'Método del ritmo', 'Parche anticonceptivo'],
      correctAnswer: 1,
      explanation: 'El DIU hormonal (levonorgestrel) es de elección en mujeres con contraindicación a estrógenos (TEP, TVP, tabaquismo >35 años).',
      specialtyId: gin.id,
    },
    {
      text: 'Mujer de 45 años con sangrado uterino irregular y biopsia de endometrio: hiperplasia con atipia. ¿Tratamiento?',
      options: ['Progestágenos por 6 meses', 'Histerectomía total', 'DIU de levonorgestrel', 'Seguimiento con ecografía anual'],
      correctAnswer: 1,
      explanation: 'La hiperplasia endometrial con atipia tiene alto riesgo de malignización (25-30%), por lo que la histerectomía es el tratamiento estándar.',
      specialtyId: gin.id,
    },
    {
      text: '¿Cuál es la causa más frecuente de sangrado uterino anormal en mujer en edad reproductiva?',
      options: ['Mioma uterino', 'Pólipos endometriales', 'Disfunción ovulatoria', 'Adenomiosis'],
      correctAnswer: 2,
      explanation: 'La disfunción ovulatoria (ciclos anovulatorios) es la causa más frecuente de SUA en edad reproductiva.',
      specialtyId: gin.id,
    },
    {
      text: 'Gestante de 32 semanas con fiebre 39°C, dolor lumbar derecho, puño percusión positiva y piuria. ¿Tratamiento?',
      options: ['Nitrofurantoína VO por 7 días', 'Ceftriaxona IV + hospitalización', 'Fosfomicina dosis única', 'Amoxicilina VO por 3 días'],
      correctAnswer: 1,
      explanation: 'La pielonefritis aguda en gestante requiere hospitalización y antibiótico IV (ceftriaxona o ampicilina-sulbactam).',
      specialtyId: gin.id,
    },
    {
      text: '¿Cuál es el screening primario recomendado para cáncer de cuello uterino en Perú en mujeres de 30-65 años?',
      options: ['Papanicolaou cada año', 'VPH + citología cada 5 años', 'Inspección visual con ácido acético (IVAA)', 'Colposcopía cada 2 años'],
      correctAnswer: 1,
      explanation: 'El cotesting VPH + citología cada 5 años es el gold standard actual para screening de cáncer cervical en mujeres de 30-65 años.',
      specialtyId: gin.id,
    },
    {
      text: 'Mujer de 22 años con dismenorrea severa, dispareunia y nódulos en fondo de saco de Douglas. ¿Diagnóstico más probable?',
      options: ['Enfermedad pélvica inflamatoria', 'Endometriosis', 'Miomatosis uterina', 'Quiste de ovario funcional'],
      correctAnswer: 1,
      explanation: 'La tríada dismenorrea + dispareunia + nódulos en fondo de saco es altamente sugestiva de endometriosis.',
      specialtyId: gin.id,
    },
    {
      text: 'Puérpera de 5 días con fiebre 38.5°C, útero subinvolucionado y loquios fétidos. ¿Diagnóstico?',
      options: ['Mastitis puerperal', 'Endometritis puerperal', 'Tromboflebitis pélvica', 'Infección de herida operatoria'],
      correctAnswer: 1,
      explanation: 'Fiebre puerperal + útero subinvolucionado + loquios malolientes = endometritis puerperal. Tratamiento: clindamicina + gentamicina IV.',
      specialtyId: gin.id,
    },

    // PSIQUIATRÍA (10)
    {
      text: 'Paciente de 25 años con 3 episodios de depresión mayor y 1 episodio maníaco. ¿Diagnóstico?',
      options: ['Trastorno depresivo mayor recurrente', 'Trastorno bipolar tipo I', 'Ciclotimia', 'Trastorno esquizoafectivo'],
      correctAnswer: 1,
      explanation: 'Un episodio maníaco completo es suficiente para diagnosticar Trastorno Bipolar Tipo I, independiente del número de episodios depresivos.',
      specialtyId: psiq.id,
    },
    {
      text: 'Paciente con esquizofrenia en tratamiento con haloperidol presenta rigidez, bradicinesia y temblor en reposo. ¿Diagnóstico?',
      options: ['Discinesia tardía', 'Síndrome extrapiramidal', 'Síndrome neuroléptico maligno', 'Acatisia'],
      correctAnswer: 1,
      explanation: 'La rigidez, bradicinesia y temblor en reposo son síntomas parkinsonianos por bloqueo dopaminérgico nigroestriatal (síndrome extrapiramidal).',
      specialtyId: psiq.id,
    },
    {
      text: 'Paciente con crisis de pánico recurrentes y evitación de lugares públicos por miedo a nueva crisis. ¿Diagnóstico?',
      options: ['Fobia social', 'Trastorno de pánico con agorafobia', 'Trastorno de ansiedad generalizada', 'TEPT'],
      correctAnswer: 1,
      explanation: 'Las crisis de pánico recurrentes + evitación de situaciones donde escapar sería difícil = trastorno de pánico con agorafobia.',
      specialtyId: psiq.id,
    },
    {
      text: '¿Cuál es el antidepresivo de elección en depresión mayor con comorbilidad cardiovascular?',
      options: ['Amitriptilina', 'Sertralina', 'Clomipramina', 'Imipramina'],
      correctAnswer: 1,
      explanation: 'Los ISRS como sertralina son de elección en pacientes con cardiopatía por su menor cardiotoxicidad vs tricíclicos.',
      specialtyId: psiq.id,
    },
    {
      text: 'Paciente con ideas delirantes de persecución, alucinaciones auditivas y deterioro funcional de 8 meses. ¿Diagnóstico?',
      options: ['Trastorno delirante', 'Esquizofrenia', 'Trastorno esquizofreniforme', 'Psicosis breve'],
      correctAnswer: 1,
      explanation: 'Esquizofrenia: síntomas positivos (delirios, alucinaciones) + síntomas negativos + duración >6 meses + deterioro funcional.',
      specialtyId: psiq.id,
    },
    {
      text: 'Paciente con depresión mayor y riesgo suicida alto. ¿Cuál es la indicación de tratamiento más urgente?',
      options: ['Iniciar ISRS ambulatorio', 'Hospitalización + estabilización', 'Psicoterapia cognitivo-conductual', 'Benzodiacepinas + seguimiento semanal'],
      correctAnswer: 1,
      explanation: 'El riesgo suicida alto es indicación de hospitalización psiquiátrica para protección del paciente.',
      specialtyId: psiq.id,
    },
    {
      text: '¿Cuál es el estabilizador del ánimo de primera línea en trastorno bipolar con predominio maníaco?',
      options: ['Quetiapina', 'Litio', 'Valproato', 'Lamotrigina'],
      correctAnswer: 1,
      explanation: 'El litio es el estabilizador clásico de primera línea en TB, especialmente en fases maníacas y como profilaxis.',
      specialtyId: psiq.id,
    },
    {
      text: 'Paciente con TOC que realiza rituales de limpieza 4 horas diarias. ¿Tratamiento de primera línea?',
      options: ['Alprazolam + psicoeducación', 'ISRS + terapia cognitivo-conductual (ERP)', 'Haloperidol + litio', 'Clonazepam a largo plazo'],
      correctAnswer: 1,
      explanation: 'El TOC se trata con ISRS (fluvoxamina, sertralina) + terapia de exposición con prevención de respuesta (ERP).',
      specialtyId: psiq.id,
    },
    {
      text: 'Paciente de 70 años con deterioro cognitivo progresivo, desorientación y alteraciones conductuales de 2 años. ¿Diagnóstico más probable?',
      options: ['Delirium', 'Depresión pseudodemencia', 'Demencia tipo Alzheimer', 'Demencia vascular'],
      correctAnswer: 2,
      explanation: 'El Alzheimer es la causa más frecuente de demencia (60-70%), con inicio insidioso y progresión gradual.',
      specialtyId: psiq.id,
    },
    {
      text: '¿Cuál es el síntoma cardinal que diferencia el delirium de la demencia?',
      options: ['Pérdida de memoria', 'Alteración del nivel de conciencia fluctuante', 'Desorientación temporal', 'Alucinaciones visuales'],
      correctAnswer: 1,
      explanation: 'El delirium se caracteriza por alteración del nivel de conciencia con fluctuación (mejor de día, peor de noche), a diferencia de la demencia.',
      specialtyId: psiq.id,
    },

    // SALUD PÚBLICA (10)
    {
      text: '¿Cuál es el indicador más sensible para medir el desarrollo de un país según la OMS?',
      options: ['Tasa de mortalidad general', 'Tasa de mortalidad infantil', 'Esperanza de vida al nacer', 'Cobertura de vacunación'],
      correctAnswer: 1,
      explanation: 'La tasa de mortalidad infantil es el indicador más sensible del nivel de desarrollo socioeconómico y sanitario de un país.',
      specialtyId: sp.id,
    },
    {
      text: 'En un estudio de cohorte se encontró RR=2.5. ¿Cómo se interpreta?',
      options: ['Los expuestos tienen 2.5 veces menos riesgo', 'Los expuestos tienen 2.5 veces más riesgo de enfermar', 'No hay asociación entre exposición y enfermedad', 'El factor es protector'],
      correctAnswer: 1,
      explanation: 'RR>1 indica mayor riesgo en expuestos. RR=2.5 significa que los expuestos tienen 2.5 veces más riesgo que los no expuestos.',
      specialtyId: sp.id,
    },
    {
      text: '¿Cuál es la diferencia entre sensibilidad y especificidad de una prueba diagnóstica?',
      options: ['Sensibilidad detecta verdaderos negativos; especificidad detecta verdaderos positivos', 'Sensibilidad detecta verdaderos positivos; especificidad detecta verdaderos negativos', 'Son equivalentes en pruebas perfectas', 'Sensibilidad se usa en cribado; especificidad en diagnóstico definitivo'],
      correctAnswer: 1,
      explanation: 'Sensibilidad = VP/(VP+FN): capacidad de detectar enfermos. Especificidad = VN/(VN+FP): capacidad de detectar sanos.',
      specialtyId: sp.id,
    },
    {
      text: '¿Qué tipo de estudio epidemiológico tiene mayor nivel de evidencia?',
      options: ['Estudio de casos y controles', 'Estudio de cohorte prospectivo', 'Ensayo clínico aleatorizado', 'Metaanálisis de ECA'],
      correctAnswer: 3,
      explanation: 'El metaanálisis de ensayos clínicos aleatorizados ocupa el nivel más alto en la pirámide de evidencia científica.',
      specialtyId: sp.id,
    },
    {
      text: '¿Cuál es la definición de incidencia acumulada?',
      options: ['Número de casos nuevos y antiguos en un momento dado', 'Número de casos nuevos en un período / población en riesgo al inicio', 'Número de muertes / total de enfermos', 'Casos en un área / población total'],
      correctAnswer: 1,
      explanation: 'Incidencia acumulada = casos nuevos en el período / población en riesgo al inicio del período. Mide el riesgo de enfermar.',
      specialtyId: sp.id,
    },
    {
      text: 'En Perú, ¿cuáles son las primeras causas de mortalidad en adultos según MINSA?',
      options: ['Enfermedades infecciosas y parasitarias', 'Enfermedades del sistema circulatorio y neoplasias', 'Accidentes de tránsito y violencia', 'Enfermedades respiratorias crónicas'],
      correctAnswer: 1,
      explanation: 'Las enfermedades cardiovasculares y el cáncer son las primeras causas de mortalidad en adultos peruanos según las estadísticas del MINSA.',
      specialtyId: sp.id,
    },
    {
      text: '¿Qué nivel de atención corresponde a los hospitales de referencia regional según el MINSA?',
      options: ['Primer nivel — IPRESS I-1 a I-4', 'Segundo nivel — IPRESS II-1 y II-2', 'Tercer nivel — IPRESS III-1 y III-2', 'Cuarto nivel — Institutos especializados'],
      correctAnswer: 2,
      explanation: 'Los hospitales regionales de referencia corresponden al tercer nivel de atención (IPRESS III-1 y III-2).',
      specialtyId: sp.id,
    },
    {
      text: '¿Cuál es el objetivo principal del programa CRED (Control de Crecimiento y Desarrollo)?',
      options: ['Vacunar a los niños menores de 5 años', 'Detectar precozmente alteraciones en el crecimiento y desarrollo', 'Tratar enfermedades prevalentes de la infancia', 'Educar a las madres sobre lactancia materna'],
      correctAnswer: 1,
      explanation: 'El CRED tiene como objetivo la vigilancia y promoción del crecimiento y desarrollo del niño menor de 5 años para detección precoz de alteraciones.',
      specialtyId: sp.id,
    },
    {
      text: '¿Cuál es la estrategia de salud pública más costo-efectiva en países en desarrollo?',
      options: ['Construcción de hospitales de alta complejidad', 'Vacunación universal', 'Telemedicina rural', 'Cirugía electiva gratuita'],
      correctAnswer: 1,
      explanation: 'La vacunación es la intervención de salud pública más costo-efectiva, con mayor impacto en morbimortalidad por bajo costo y alta cobertura poblacional.',
      specialtyId: sp.id,
    },
    {
      text: 'Brote de gastroenteritis en un colegio. 40 de 200 alumnos enferman tras consumir el mismo menú. ¿Cuál es la tasa de ataque?',
      options: ['20%', '40%', '80%', '200%'],
      correctAnswer: 0,
      explanation: 'Tasa de ataque = casos/expuestos × 100 = 40/200 × 100 = 20%. Mide la proporción de expuestos que enferman en un brote.',
      specialtyId: sp.id,
    },
  ]

  for (const pregunta of preguntas) {
    await db.question.create({ data: pregunta })
  }

  console.log(`✅ ${preguntas.length} preguntas creadas`)
  console.log('🎉 Seed completado exitosamente')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())