"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  Loader2, 
  Trash2, 
  RotateCcw, 
  AlertTriangle,
  Calendar
} from "lucide-react";

interface Order {
  id: string;
  cliente_nome: string;
  total: number;
  status: string;
  created_at: string;
  data_exclusao: string | null;
  itens: any[];
}

interface RestauranteInfo {
  id: string;
  nome: string;
}

export default function LixeiraPage() {
  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState<RestauranteInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchRestaurante() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          setLoading(false);
          return;
        }

        const { data: restData, error: restError } = await supabase
          .from('restaurantes')
          .select('id, nome')
          .eq('owner_id', authData.user.id)
          .single();

        if (restError || !restData) {
          setLoading(false);
          return;
        }

        setRestaurante(restData);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchRestaurante();
  }, []);

  const fetchLixeira = async () => {
    if (!restaurante?.id) return;
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('restaurante_id', restaurante.id)
        .eq('excluido', true)
        .gte('data_exclusao', thirtyDaysAgo.toISOString())
        .order('data_exclusao', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Erro ao buscar lixeira:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLixeira();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurante?.id]);

  const restaurarPedido = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ excluido: false, data_exclusao: null })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Erro ao restaurar pedido:", err);
      alert("Erro ao restaurar o pedido.");
    }
  };

  const excluirDefinitivo = async (orderId: string) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente este pedido? Esta ação não pode ser desfeita.")) return;
    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Erro ao excluir permanentemente:", err);
      alert("Erro ao excluir o pedido permanentemente.");
    }
  };

  const esvaziarLixeira = async () => {
    if (!restaurante?.id) return;
    if (!confirm("ATENÇÃO: Deseja excluir PERMANENTEMENTE todos os pedidos da lixeira? Esta ação não pode ser desfeita.")) return;
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // In Supabase, delete multiple rows based on conditions
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('restaurante_id', restaurante.id)
        .eq('excluido', true);

      if (error) throw error;
      setOrders([]);
    } catch (err) {
      console.error("Erro ao esvaziar lixeira:", err);
      alert("Erro ao esvaziar a lixeira.");
    }
  };

  const getNumeroPedido = (id: string) => '#' + id.substring(0, 8).toUpperCase();

  const getDiasRestantes = (dataExclusao: string | null) => {
    if (!dataExclusao) return 0;
    const dataExp = new Date(dataExclusao);
    dataExp.setDate(dataExp.getDate() + 30);
    const hoje = new Date();
    const diffTime = Math.abs(dataExp.getTime() - hoje.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-slate-400" />
            Lixeira
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Pedidos são excluídos permanentemente após 30 dias.
          </p>
        </div>
        
        {orders.length > 0 && (
          <button 
            onClick={esvaziarLixeira}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            Esvaziar Lixeira
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-1 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-slate-500 text-xs uppercase font-bold tracking-widest bg-white/[0.02]">
                <th className="px-6 py-4">Pedido / Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Data de Exclusão</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-500">
                    <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    Sua lixeira está vazia.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const diasRestantes = getDiasRestantes(order.data_exclusao);
                  return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-slate-300 mb-1">{getNumeroPedido(order.id)}</span>
                         <div className="font-bold text-slate-400 leading-none">{order.cliente_nome}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-300">
                          {order.data_exclusao ? new Date(order.data_exclusao).toLocaleDateString('pt-BR') : 'N/A'}
                        </span>
                        <span className="text-[10px] text-orange-400 font-medium flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" />
                          Exclui em {diasRestantes} dia{diasRestantes !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => restaurarPedido(order.id)}
                          className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 transition-all active:scale-95 shadow-lg flex items-center gap-2 font-bold text-xs"
                          title="Restaurar Pedido"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restaurar
                        </button>
                        <button 
                          onClick={() => excluirDefinitivo(order.id)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all active:scale-95 shadow-lg flex items-center gap-2 font-bold text-xs"
                          title="Excluir Definitivamente"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
