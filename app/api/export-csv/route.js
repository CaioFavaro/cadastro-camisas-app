import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('camisas')
      .select('nome_na_camisa, numero, tamanho, tipo, modelo')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const csv = Papa.unparse(data, {
        header: true,
        quotes: true,
        columns: [
            "nome_na_camisa",
            "numero",
            "tamanho",
            "tipo"
        ]
    });

    const headers = new Headers();
    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', 'attachment; filename="relatorio_camisas.csv"');

    return new NextResponse(csv, { status: 200, headers });

  } catch (err) {
    console.error('Erro ao gerar CSV:', err);
    return new NextResponse(JSON.stringify({ error: 'Falha ao gerar o arquivo CSV.' }), { status: 500 });
  }
}
