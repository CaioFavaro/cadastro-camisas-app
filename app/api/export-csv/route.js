import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

// Inicializa o cliente Supabase com variáveis de ambiente do SERVIDOR
// É mais seguro usar process.env diretamente no lado do servidor
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

export async function GET() {
  try {
    // 1. Buscar todos os dados da tabela 'camisas'
    const { data, error } = await supabase
      .from('camisas')
      .select('nome_completo, nome_na_camisa, numero, tamanho, tipo, modelo, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // 2. Converter os dados JSON para o formato CSV usando papaparse
    const csv = Papa.unparse(data, {
        header: true,
        quotes: true,
        // Mapeia os nomes das colunas para um cabeçalho mais amigável
        columns: [
            "nome_na_camisa",
            "numero",
            "tamanho",
            "tipo"
        ]
    });

    // 3. Configurar os headers da resposta para forçar o download
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', 'attachment; filename="relatorio_camisas.csv"');

    // 4. Retornar a resposta com o CSV
    return new NextResponse(csv, { status: 200, headers });

  } catch (err) {
    console.error('Erro ao gerar CSV:', err);
    return new NextResponse(JSON.stringify({ error: 'Falha ao gerar o arquivo CSV.' }), { status: 500 });
  }
}
