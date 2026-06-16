import React from 'react';
import { HelpCircle, QrCode, Link as LinkIcon, PlusCircle, Smartphone, Camera, Download, Share2 } from 'lucide-react';

export function Ajuda() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#0f4c81]/10 rounded-full">
          <HelpCircle className="w-8 h-8 text-[#0f4c81]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Como funciona?</h1>
      </div>

      <div className="space-y-8">
        
        {/* Section 1: Intro */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#0f4c81] mb-4 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5" /> O Álbum EAC
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O Álbum do EAC é um espaço digital interativo para você colecionar figurinhas dos encontreiros e momentos especiais. Assim como um álbum físico, você tem páginas de figurinhas que podem ser preenchidas ao encontrar e interagir com outras pessoas que também possuem suas próprias figurinhas.
          </p>

          <div className="my-6 flex flex-col sm:flex-row items-center gap-6 p-6 bg-gradient-to-br from-[#0f4c81]/5 to-transparent rounded-xl border border-[#0f4c81]/10">
            <div className="w-36 flex-shrink-0">
              <div className="aspect-[3/4] bg-white rounded-lg shadow-lg border-[6px] border-white overflow-hidden relative rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                <div className="w-full h-3/4 bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" alt="Foto de exemplo" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-b from-[#07243c] to-[#0f4c81] flex flex-col items-center justify-center p-1 border-t-2 border-[#fcd116]">
                  <span className="text-white font-bold text-sm tracking-wide text-center leading-tight">JOÃO</span>
                  <span className="text-[10px] text-[#fcd116] font-medium tracking-wider mt-0.5">EAC 35</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Exemplo de Figurinha</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ao criar sua figurinha, ela terá a aparência acima: sua foto, o seu nome de encontro e o selo da edição que você realizou (ou se é membro do Núcleo).
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <strong>Dica:</strong> As figurinhas coladas são salvas apenas no seu próprio dispositivo atual, garantindo privacidade.
          </div>
        </section>

        {/* Section 2: Getting Stickers */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#e31837] mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" /> Como colar novas figurinhas?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <QrCode className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">1. Escaneando o QR Code</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Vá na aba "Escanear" e aponte a câmera para o QR Code da figurinha que a pessoa te mostrar. A figurinha será automaticamente colada no seu álbum.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <LinkIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">2. Adicionando por Link</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Se alguém te mandar o link da figurinha ("Compartilhar"), basta abrir o link. Lá haverá a opção de "Colar no meu Álbum".
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
               <div className="mt-1 flex-shrink-0">
                  <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">Id</span>
               </div>
               <div>
                  <h3 className="font-semibold text-gray-900">3. Usando o Código</h3>
                  <p className="text-gray-600 mt-1 text-sm">
                     Tem também a opção de abrir a figurinha pelo código, acessando a aba Álbum, e clicando em "Nova Figurinha".
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* Section 3: Creating Your Own */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-emerald-600 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5" /> Como criar a minha figurinha?
          </h2>
          <ol className="relative border-l border-gray-200 ml-3 space-y-6">                  
            <li className="pl-6">            
              <span className="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white text-emerald-600 font-bold text-xs">
                1
              </span>
              <h3 className="font-semibold text-gray-900">Vá em "Criar Figurinha"</h3>
              <p className="text-sm text-gray-600 mt-1">Acesse a aba Criar (menu abaixo ou no topo) para começar o processo.</p>
            </li>
            
            <li className="pl-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white text-emerald-600 font-bold text-xs">
                2
              </span>
              <h3 className="font-semibold text-gray-900">Preencha seus Dados</h3>
              <p className="text-sm text-gray-600 mt-1">Insira seu nome (será automaticamente o Nome da figurinha), selecione a sua data de nascimento (para fins de estatísticas), e informe o qual EAC você participou pela primeira vez. Não se preocupe se o EAC não estiver na lista!</p>
            </li>
            
            <li className="pl-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white text-emerald-600 font-bold text-xs">
                3
              </span>
              <h3 className="font-semibold text-gray-900">Faça o Upload e Recorte sua Foto</h3>
              <p className="text-sm text-gray-600 mt-1">Selecione uma foto da sua galeria. Você pode fazer o ajuste dando zoom e recortando o local exato com o seu rosto. Aperte "Confirmar" para confirmar o corte.</p>
            </li>

            <li className="pl-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full -left-3 ring-4 ring-white text-emerald-600 font-bold text-xs">
                4
              </span>
              <h3 className="font-semibold text-gray-900">Pronto!</h3>
              <p className="text-sm text-gray-600 mt-1">Ao finalizar, você acessará a página da sua própria figurinha. Mas, atenção: <strong className="text-emerald-700">Por padrão, a sua figurinha recém-criada NÃO vem no seu próprio álbum.</strong> Você pode apertar "Colar no meu Álbum" se desejar.</p>
            </li>
          </ol>
        </section>

        {/* Section 4: Sharing */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-amber-500 mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" /> Compartilhar ou Salvar Imagem
          </h2>
          <div className="space-y-4 text-gray-700 text-sm">
            <p>
              Ao visualizar a sua figurinha (ou de alguém), você terá botões para compartilhar ou salvar como imagem em seu celular.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
               <div className="bg-gray-50 flex-1 p-4 rounded border border-gray-100">
                  <strong className="flex items-center gap-1.5"><Download className="w-4 h-4"/> Salvar Figurinha</strong>
                  <p className="mt-1 text-gray-600">Gera um PNG para você divulgar no WhatsApp ou usar como foto de perfil.</p>
               </div>
               <div className="bg-gray-50 flex-1 p-4 rounded border border-gray-100">
                  <strong className="flex items-center gap-1.5"><QrCode className="w-4 h-4"/> Exibir QR Code</strong>
                  <p className="mt-1 text-gray-600">Mostre seu celular para outra pessoa escanear a sua imagem na hora!</p>
               </div>
            </div>
            
          </div>
        </section>

      </div>
    </div>
  );
}

// Just an icon wrapper since BookOpen is not cleanly importable above due to copy/paste fast layout
function BookOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
