'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 
import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  // Estados para os campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeNaCamisa, setNomeNaCamisa] = useState('');
  const [numero, setNumero] = useState('');
  const [tamanho, setTamanho] = useState('M');
  const [tipo, setTipo] = useState('Masculina');
  const [modelo, setModelo] = useState('Com Patrocínio');

  // Estados para controlar a interface
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const PIX_KEY = '36417528847';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!nomeCompleto || !nomeNaCamisa || !numero) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('camisas')
      .insert([
        { 
          nome_completo: nomeCompleto, 
          nome_na_camisa: nomeNaCamisa, 
          numero: parseInt(numero), 
          tamanho: tamanho, 
          tipo: tipo, 
          modelo: modelo 
        },
      ]);

    if (insertError) {
      setError(`Erro ao cadastrar: ${insertError.message}`);
      console.error(insertError);
    } else {
      setSuccess(true);
      // Limpa o formulário
      setNomeCompleto('');
      setNomeNaCamisa('');
      setNumero('');
      setTamanho('M');
      setTipo('Masculina');
      setModelo('Com Patrocínio');
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8 bg-cover bg-center" style={{backgroundImage: "url('/stadium-bg.jpg')"}}>
      <div className="bg-black bg-opacity-70 p-10 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-sm border border-gray-700">
        
        {!success ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight">Cadastre sua camisa do futunidos</h1>
              <p className="text-gray-400 mt-2">Personalize e registre sua camisa oficial.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inputs */}
              <div>
                <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-300">Nome Completo</label>
                <input type="text" id="nomeCompleto" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white p-3"/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nomeNaCamisa" className="block text-sm font-medium text-gray-300">Nome na Camisa</label>
                  <input type="text" id="nomeNaCamisa" value={nomeNaCamisa} onChange={(e) => setNomeNaCamisa(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white p-3"/>
                </div>
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-300">Número</label>
                  <input type="number" id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white p-3"/>
                </div>
              </div>

              {/* Selects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="tamanho" className="block text-sm font-medium text-gray-300">Tamanho</label>
                  <select id="tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white p-3">
                    <option>PP</option>
                    <option>P</option>
                    <option>M</option>
                    <option>G</option>
                    <option>GG</option>
                    <option>GGG</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">Tipo</label>
                  <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white p-3">
                    <option>Masculina</option>
                    <option>Feminina</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="modelo" className="block text-sm font-medium text-gray-300">Modelo</label>
                  <select id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-white p-3">
                    <option>Com Patrocínio</option>
                    <option>Sem Patrocínio</option>
                  </select>
                </div>
              </div>
              
              {/* Botão de Cadastro */}
              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed">
                  {loading ? 'Cadastrando...' : 'Cadastrar Camisa'}
                </button>
              </div>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
          </>
        ) : (
          // Tela de Sucesso com QR Code
          <div className="text-center transition-opacity duration-500 ease-in">
            <h2 className="text-3xl font-bold text-green-400">Camisa Cadastrada com Sucesso!</h2>
            <p className="mt-4 text-gray-300">Para confirmar seu pedido, realize o pagamento via PIX utilizando o QR Code abaixo.</p>
            <div className="mt-6 flex justify-center bg-white p-4 rounded-lg">
              <QRCodeSVG value={PIX_KEY} size={256} />
            </div>
            <p className="mt-4 text-sm text-gray-400 break-all"><strong>Chave PIX (CPF):</strong> {PIX_KEY}</p>
            <button onClick={() => setSuccess(false)} className="mt-8 w-full py-3 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-400 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Cadastrar Nova Camisa
            </button>
          </div>
        )}

        {/* Botão para Gerar CSV */}
        <div className="mt-8 text-center">
            <a href="/api/export-csv" className="inline-block py-2 px-5 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
              Gerar Relatório CSV
            </a>
        </div>
      </div>
    </main>
  );
}