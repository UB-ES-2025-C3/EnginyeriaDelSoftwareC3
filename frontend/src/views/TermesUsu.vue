<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-black text-gray-100 flex flex-col">
    <section class="flex-1">
      <div class="max-w-4xl mx-auto px-6 py-16">
        <header class="mb-12 text-center">
          <p class="text-sm uppercase tracking-widest text-purple-400 mb-2">Condicions legals</p>
          <h1 class="text-4xl md:text-5xl font-extrabold text-white">Termes d'ús</h1>
          <p class="text-gray-400 mt-4">
            Llegeix amb atenció aquestes condicions abans d'utilitzar CheckPoint. Fer servir la plataforma implica
            l'acceptació íntegra dels termes descrits a continuació.
          </p>
        </header>

        <div class="bg-gray-900/60 border border-gray-800 rounded-3xl shadow-2xl divide-y divide-gray-800">
          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Acceptació dels Termes</h2>
            <p>
              L'accés i ús de CheckPoint implica que acceptes aquests Termes d'ús i qualsevol norma addicional que s'hi
              publiqui. Si no hi estàs d'acord, has de deixar d'utilitzar el servei.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Descripció del Servei</h2>
            <p>
              CheckPoint ofereix un espai per descobrir, puntuar i comentar videojocs. El servei es proporciona tal com
              és, amb possibles limitacions d'accés, funcionalitats en evolució i actualitzacions periòdiques.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Compte d'usuari i seguretat</h2>
            <p>
              En registrar-te, garanteixes que la informació facilitada és veraç i actualitzada. Ets responsable de
              preservar la confidencialitat de les teves credencials i de qualsevol activitat que es realitzi des del teu
              compte. Notifica'ns immediatament qualsevol accés no autoritzat.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Normes d'ús</h2>
            <ul class="list-disc pl-6 space-y-2 text-gray-300">
              <li>No utilitzis la plataforma per difondre contingut il·lícit, ofensiu o que vulneri drets de tercers.</li>
              <li>No interfereixis en el funcionament del servei ni executis activitats que en comprometin la seguretat.</li>
              <li>Respecta la comunitat i evita qualsevol comportament abusiu, assetjament o llenguatge discriminatori.</li>
            </ul>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Contingut d'usuari</h2>
            <p>
              En publicar contingut, concedeixes a CheckPoint una llicència mundial, no exclusiva i gratuïta per emmagatzemar,
              mostrar i distribuir aquest material dins del servei. Ens reservem el dret de moderar o retirar contingut que
              incompleixi les normes.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Propietat intel·lectual</h2>
            <p>
              Les marques, logotips, codi i materials del servei són propietat de CheckPoint o de tercers amb llicència.
              No es permet fer-los servir sense autorització expressa, excepte per l'ús estrictament personal del servei.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Limitació de responsabilitat</h2>
            <p>
              CheckPoint es proporciona "tal qual" i no garantim la disponibilitat ininterrompuda ni l'absència d'errors.
              No serem responsables de danys indirectes, pèrdues de dades o danys derivats de l'ús del servei.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Suspensió i terminació</h2>
            <p>
              Podem suspendre o tancar comptes que incompleixin greument aquests termes, que amenacin la seguretat del servei
              o que hagin estat inactius durant períodes prolongats, prèvia notificació quan sigui possible.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Modificacions dels Termes</h2>
            <p>
              Podem actualitzar aquests Termes per adaptar-nos a canvis legals o operatius. Comunicarem les modificacions
              rellevants i indicarem la data d'actualització perquè puguis revisar-les.
            </p>
            <p class="text-gray-400 text-sm">Darrera actualització: 1 de desembre de 2025.</p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Llei aplicable i jurisdicció</h2>
            <p>
              Els presents Termes es regeixen per la legislació vigent a Espanya i qualsevol controvèrsia es sotmetrà als
              jutjats i tribunals de Barcelona, excepte quan la normativa de consum estableixi una altra cosa.
            </p>
          </section>

          <section class="p-8 space-y-4">
            <h2 class="text-2xl font-semibold text-white">Contacte</h2>
            <p>
              Si tens dubtes legals o vols exercir algun dret, escriu-nos a
              <span class="text-white font-medium">legal@checkpoint.app</span>.
            </p>
          </section>
        </div>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import FooterComponent from '@/components/FooterComponent.vue';

const pageTitle = "Termes d'ús | CheckPoint";
const description =
  'Consulta les condicions de CheckPoint sobre acceptació del servei, normes d’ús i responsabilitats.';

let previousTitle = document.title;
let previousDescription = '';
let metaDescription: HTMLMetaElement | null = null;

onMounted(() => {
  previousTitle = document.title;
  document.title = pageTitle;

  metaDescription = document.querySelector('meta[name=\"description\"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  previousDescription = metaDescription?.getAttribute('content') || '';
  metaDescription?.setAttribute('content', description);
});

onUnmounted(() => {
  document.title = previousTitle;
  if (metaDescription) {
    metaDescription.setAttribute('content', previousDescription);
  }
});
</script>
