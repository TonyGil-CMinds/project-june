const privacySections = [
  {
    title: '1. Informacion que recopilamos',
    body: [
      'Cuando usas NaturaTech ID, podemos recopilar la siguiente informacion:',
    ],
    list: [
      'Nombre',
      'Direccion de correo electronico',
      'ID de usuario o identificador de cuenta',
      'Informacion de autenticacion proporcionada por Google OAuth u otros proveedores de identidad',
      'Actividad de inicio de sesion',
      'Direccion IP',
      'Informacion del navegador y del dispositivo',
      'Registros de seguridad y acceso',
    ],
    after: [
      'Solo recopilamos la informacion necesaria para autenticar usuarios, proteger cuentas y brindar acceso a los servicios de NaturaTech.',
    ],
  },
  {
    title: '2. Informacion recopilada a traves de Google OAuth',
    body: [
      'Si inicias sesion con Google, podemos recibir informacion basica de tu cuenta de Google, como:',
    ],
    list: [
      'Tu nombre',
      'Tu direccion de correo electronico',
      'Tu identificador de perfil',
      'Tu foto de perfil, si Google la pone a disposicion',
    ],
    after: [
      'Usamos esta informacion solo para autenticar tu identidad y brindarte acceso a los servicios de NaturaTech.',
      'No vendemos datos de usuarios de Google.',
      'No usamos datos de usuarios de Google con fines publicitarios.',
      'No compartimos datos de usuarios de Google con terceros no autorizados.',
    ],
  },
  {
    title: '3. Como usamos la informacion',
    body: ['Usamos la informacion recopilada para:'],
    list: [
      'Autenticar usuarios',
      'Proporcionar acceso seguro a las aplicaciones de NaturaTech',
      'Administrar cuentas de usuario',
      'Monitorear y prevenir accesos no autorizados',
      'Detectar actividad sospechosa o fraudulenta',
      'Mantener la seguridad del sistema',
      'Cumplir con requisitos legales u operativos',
    ],
  },
  {
    title: '4. Comparticion de datos',
    body: [
      'No vendemos, rentamos ni comercializamos informacion personal.',
      'Podemos compartir informacion limitada solo cuando sea necesario con:',
    ],
    list: [
      'Proveedores de servicios que nos ayudan a operar nuestros sistemas',
      'Proveedores de seguridad, infraestructura y autenticacion',
      'Autoridades legales o regulatorias, cuando lo exija la ley',
    ],
    after: [
      'Se espera que cualquier proveedor de servicios que utilicemos proteja la informacion y la use solo para los fines necesarios para prestar sus servicios.',
    ],
  },
  {
    title: '5. Seguridad de los datos',
    body: [
      'Tomamos medidas tecnicas y organizativas razonables para proteger la informacion de los usuarios, incluyendo:',
    ],
    list: [
      'Autenticacion segura',
      'Autenticacion de dos factores cuando corresponda',
      'Rotacion de llaves API',
      'Monitoreo de acceso',
      'Revision de actividad de cuentas',
      'Acceso restringido a sistemas sensibles',
    ],
    after: [
      'Sin embargo, ningun metodo de transmision o almacenamiento es completamente seguro, por lo que no podemos garantizar seguridad absoluta.',
    ],
  },
  {
    title: '6. Conservacion de datos',
    body: [
      'Conservamos la informacion de los usuarios solo durante el tiempo necesario para prestar el servicio, mantener la seguridad, cumplir obligaciones legales o apoyar necesidades operativas.',
      'Cuando la informacion ya no sea necesaria, podremos eliminarla, anonimizarla o archivarla de forma segura.',
    ],
  },
  {
    title: '7. Derechos de los usuarios',
    body: [
      'Dependiendo de tu ubicacion y de las leyes aplicables, puedes tener derecho a:',
    ],
    list: [
      'Solicitar acceso a tu informacion personal',
      'Solicitar la correccion de informacion inexacta',
      'Solicitar la eliminacion de tu informacion',
      'Oponerte a ciertas actividades de tratamiento',
      'Retirar tu consentimiento cuando corresponda',
    ],
    after: [
      'Para realizar una solicitud, contactanos usando la informacion de contacto indicada abajo.',
    ],
  },
  {
    title: '8. Cookies y seguimiento',
    body: [
      'NaturaTech ID puede usar cookies o tecnologias similares solo cuando sean necesarias para autenticacion, gestion de sesiones, seguridad o funcionalidad del servicio.',
      'No usamos datos de autenticacion para seguimiento publicitario.',
    ],
  },
  {
    title: '9. Privacidad de menores',
    body: [
      'NaturaTech ID no esta destinado para uso de menores de 13 anos, o la edad minima requerida por la ley aplicable.',
      'No recopilamos intencionalmente informacion personal de menores.',
    ],
  },
  {
    title: '10. Cambios a este Aviso de Privacidad',
    body: [
      'Podemos actualizar este Aviso de Privacidad periodicamente. Cuando lo hagamos, actualizaremos la fecha de vigencia en la parte superior de esta pagina.',
      'El uso continuo del servicio despues de una actualizacion significa que reconoces el Aviso de Privacidad revisado.',
    ],
  },
  {
    title: '11. Contacto',
    body: [
      'Si tienes preguntas sobre este Aviso de Privacidad o sobre como se maneja tu informacion, contactanos en:',
      'Correo electronico: support@naturatech.org',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <article className="privacy-policy-page">
      <header className="privacy-policy-hero">
        <p className="privacy-policy-eyebrow">NaturaTech ID</p>
        <h1>Aviso de Privacidad</h1>
        <p className="privacy-policy-updated">Actualizado: 12 de Mayo 2026</p>
        <p className="privacy-policy-intro">
          NaturaTech respeta tu privacidad. Este Aviso de Privacidad explica como recopilamos,
          usamos, almacenamos y protegemos informacion cuando utilizas NaturaTech ID y servicios
          relacionados.
        </p>
        <p className="privacy-policy-consent">
          Al usar NaturaTech ID, aceptas las practicas descritas en este Aviso de Privacidad.
        </p>
      </header>

      <div className="privacy-policy-body">
        {privacySections.map((section) => (
          <section className="privacy-policy-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.after?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
