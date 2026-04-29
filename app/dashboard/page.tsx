"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  Loader2, 
  Printer, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  ShoppingBasket,
  Trash2,
  MessageCircle
} from "lucide-react";

interface Order {
  id: string;
  cliente_nome: string;
  cliente_telefone: string | null;
  total: number;
  status: string;
  pago: boolean;
  created_at: string;
  itens: any[];
  tipo_entrega: 'delivery' | 'local';
  mesa: string | null;
  endereco_entrega: string | null;
  motivo_cancelamento?: string | null;
  excluido?: boolean;
  data_exclusao?: string | null;
}

interface RestauranteInfo {
  id: string;
  nome: string;
  slug: string;
}

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState<RestauranteInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<'ativos' | 'concluidos'>('ativos');
  const [modalCancelamento, setModalCancelamento] = useState({ isOpen: false, pedidoId: '', motivo: '', avisarWhatsapp: true });
  
  // Metrics
  const [stats, setStats] = useState({
    faturamentoHoje: 0,
    totalPedidos: 0,
    ticketMedio: 0
  });

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
          .select('id, nome, slug')
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

  const calculateStats = (ordersList: Order[]) => {
    const faturamento = ordersList.reduce((acc, curr) => acc + curr.total, 0);
    const total = ordersList.length;
    const ticket = total > 0 ? faturamento / total : 0;

    setStats({
      faturamentoHoje: faturamento,
      totalPedidos: total,
      ticketMedio: ticket
    });
  };

  useEffect(() => {
    if (!restaurante?.id) return;

    const restauranteId = restaurante.id;
    let mounted = true;

    async function fetchInitialOrders() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('restaurante_id', restauranteId)
          .eq('excluido', false)
          .gte('created_at', today.toISOString())
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error("Erro ao buscar pedidos:", ordersError);
        } else if (mounted) {
          setOrders(ordersData || []);
          calculateStats(ordersData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchInitialOrders();

    // Setup Polling
    const interval = setInterval(fetchInitialOrders, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [restaurante?.id]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Update local state immediately for better UX
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status do pedido.");
    }
  };

  const notificarCliente = (pedido: Order, statusOverride?: string, motivoOverride?: string) => {
    if (!pedido.cliente_telefone) {
      alert("O cliente não informou um número de telefone.");
      return;
    }
    const tel = pedido.cliente_telefone.replace(/\D/g, '');
    if (!tel) return;

    const n = getNumeroPedido(pedido.id);
    const status = statusOverride || pedido.status;
    const motivo = motivoOverride || pedido.motivo_cancelamento || '';
    
    let msg = '';
    if (status === 'preparando') {
      msg = `Olá ${pedido.cliente_nome}! O seu pedido ${n} já está na cozinha sendo preparado com muito carinho! 👨‍🍳`;
    } else if (status === 'saiu_entrega') {
      msg = `Boas notícias, ${pedido.cliente_nome}! O seu pedido ${n} acabou de sair para entrega. Fique de olho! 🛵💨`;
    } else if (status === 'cancelado') {
      msg = `Olá ${pedido.cliente_nome}. Infelizmente seu pedido ${n} precisou ser cancelado. Motivo: ${motivo}. Qualquer dúvida, estamos à disposição.`;
    } else if (status === 'concluido') {
      msg = `Olá ${pedido.cliente_nome}! O seu pedido ${n} foi concluído. Agradecemos a preferência! 🍽️`;
    } else {
      msg = `Olá ${pedido.cliente_nome}! O seu pedido ${n} está com status: ${status}.`;
    }
    
    window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const confirmarCancelamento = async () => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: 'cancelado', motivo_cancelamento: modalCancelamento.motivo })
        .eq('id', modalCancelamento.pedidoId);

      if (error) throw error;
      
      const pedidoCancelado = orders.find(o => o.id === modalCancelamento.pedidoId);
      setOrders(prev => prev.map(o => o.id === modalCancelamento.pedidoId ? { ...o, status: 'cancelado' } : o));
      
      if (modalCancelamento.avisarWhatsapp && pedidoCancelado) {
        notificarCliente(pedidoCancelado, 'cancelado', modalCancelamento.motivo);
      }

      setModalCancelamento({ isOpen: false, pedidoId: '', motivo: '', avisarWhatsapp: true });
    } catch (err) {
      console.error("Erro ao cancelar:", err);
      alert("Erro ao cancelar o pedido.");
    }
  };

  const togglePaymentStatus = async (orderId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ pago: !currentStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state immediately for better UX
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, pago: !currentStatus } : o));
    } catch (err) {
      console.error("Erro ao atualizar pagamento:", err);
      alert("Erro ao atualizar status de pagamento.");
    }
  };

  const removerPedido = async (orderId: string) => {
    if (!confirm("Deseja realmente enviar este pedido para a lixeira?")) return;
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ excluido: true, data_exclusao: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Erro ao excluir pedido:", err);
      alert("Erro ao excluir o pedido.");
    }
  };

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=350,height=600');
    if (!printWindow) return;

    const dataPedido = new Date(order.created_at).toLocaleString('pt-BR');

    const itemsHtml = order.itens.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span style="flex: 1; min-width: 0;">${item.quantidade}x ${item.produto?.nome || 'Produto'}
          ${item.observacao ? `<br><small style="margin-left: 15px;">Obs: ${item.observacao}</small>` : ''}
        </span>
        <span style="margin-left: 10px;">R$ ${((item.produto?.preco || 0) * item.quantidade).toFixed(2)}</span>
      </div>
    `).join('');

    const canceladoHtml = order.status === 'cancelado' ? `
      <div style="text-align: center; border: 2px solid black; padding: 10px; margin-bottom: 15px; font-weight: bold; font-size: 1.2em;">
        * PEDIDO CANCELADO *
        <div style="font-size: 0.8em; margin-top: 5px; font-weight: normal;">Motivo: ${order.motivo_cancelamento || 'Não informado'}</div>
      </div>
    ` : '';

    const html = `
      <html>
        <head>
          <title>Cupom - ${getNumeroPedido(order.id)}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0; padding: 10px; }
            }
            body { 
              font-family: monospace; 
              width: 80mm; 
              margin: 0 auto; 
              padding: 10px;
              color: black;
              background: white;
            }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed black; padding-bottom: 10px; }
            .header h2 { margin: 0 0 5px 0; font-size: 1.3em; }
            .header p { margin: 2px 0; font-size: 0.9em; }
            .modalidade { text-align: center; font-size: 1.4em; font-weight: bold; margin: 15px 0; padding: 5px 0; border-top: 1px solid black; border-bottom: 1px solid black; }
            .content { margin-bottom: 15px; border-bottom: 1px dashed black; padding-bottom: 10px; font-size: 0.9em; line-height: 1.4; }
            .items { margin-bottom: 15px; border-bottom: 1px dashed black; padding-bottom: 10px; font-size: 0.9em; }
            .footer { font-size: 0.95em; }
            .total { font-weight: bold; font-size: 1.2em; text-align: right; margin-bottom: 5px; }
            .status-pagamento { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${restaurante?.nome || 'Restaurante'}</h2>
            <p>Data: ${dataPedido}</p>
            <p style="font-weight: bold; font-size: 1.1em; margin-top: 5px;">Pedido ${getNumeroPedido(order.id)}</p>
          </div>
          
          ${canceladoHtml}

          <div class="modalidade">
            ${order.tipo_entrega === 'delivery' ? '🛵 DELIVERY' : '🍽️ COMER NO LOCAL'}
          </div>

          <div class="content">
            <p style="margin:0;"><strong>Cliente:</strong> ${order.cliente_nome}</p>
            ${order.tipo_entrega === 'delivery' ? `
              <p style="margin:2px 0;"><strong>Endereço:</strong> ${order.endereco_entrega}</p>
              ${order.cliente_telefone ? `<p style="margin:0;"><strong>Tel:</strong> ${order.cliente_telefone}</p>` : ''}
            ` : `
              <p style="margin:2px 0;"><strong>MESA:</strong> ${order.mesa || 'N/A'}</p>
            `}
          </div>

          <div class="items">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid black; padding-bottom: 3px;">
              <span>Qtd Item</span>
              <span>Subtotal</span>
            </div>
            ${itemsHtml}
          </div>

          <div class="footer">
            <div class="total">
              Total: R$ ${order.total.toFixed(2)}
            </div>
            <div class="status-pagamento">
              Pagamento: ${order.pago ? 'PAGO' : 'PENDENTE'}
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(o => 
    filtroStatus === 'ativos' ? (o.status !== 'concluido' && o.status !== 'cancelado') : o.status === 'concluido'
  );

  const getNumeroPedido = (id: string) => '#' + id.split('-')[0].toUpperCase();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Painel de Controle Live
        </h1>
        <p className="text-slate-400 mt-1">Gestão em tempo real da sua operação hoje.</p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/5 border border-indigo-500/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <DollarSign className="w-20 h-20 text-indigo-500" />
          </div>
          <p className="text-indigo-300/80 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Faturamento Hoje
          </p>
          <h2 className="text-4xl font-black text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.faturamentoHoje)}
          </h2>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-20 h-20 text-emerald-500" />
          </div>
          <p className="text-emerald-300/80 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Total de Pedidos
          </p>
          <h2 className="text-4xl font-black text-white">{stats.totalPedidos}</h2>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-orange-500/40 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-20 h-20 text-orange-500" />
          </div>
          <p className="text-orange-300/80 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Ticket Médio
          </p>
          <h2 className="text-4xl font-black text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.ticketMedio)}
          </h2>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-1 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              Pedidos
            </h3>
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setFiltroStatus('ativos')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  filtroStatus === 'ativos' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => setFiltroStatus('concluidos')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                  filtroStatus === 'concluidos' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Concluídos
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Auto-update (10s)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-slate-500 text-xs uppercase font-bold tracking-widest bg-white/[0.02]">
                <th className="px-6 py-4">Pedido / Cliente</th>
                <th className="px-6 py-4">Itens</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                    <ShoppingBasket className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    Nenhum pedido {filtroStatus === 'ativos' ? 'ativo' : 'concluído'} para exibir.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-indigo-400 mb-2">{getNumeroPedido(order.id)}</span>
                         <span className="text-[10px] font-black tracking-widest text-slate-500 mb-1">MODALIDADE</span>
                         {order.tipo_entrega === 'delivery' ? (
                            <div className="mb-2"><span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-[10px] uppercase tracking-wide">🛵 ENTREGA</span></div>
                         ) : (
                            <div className="mb-2"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-wide">🍽️ NO LOCAL</span></div>
                         )}
                         <span className="font-bold text-white leading-none mb-1">{order.cliente_nome}</span>
                         {order.tipo_entrega === 'delivery' ? (
                           <div className="text-[10px] text-slate-400 mt-1 pl-1 border-l border-white/10">
                             {order.endereco_entrega} <br />
                             {order.cliente_telefone && <span className="mt-0.5 block font-bold text-indigo-300">{order.cliente_telefone}</span>}
                           </div>
                         ) : (
                           <div className="text-[10px] text-slate-400 mt-1 pl-1 border-l border-white/10 flex items-center gap-2">
                             Mesa: <span className="font-bold text-white text-xs">{order.mesa || 'N/A'}</span>
                           </div>
                         )}
                         <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-3 font-medium bg-white/5 w-fit px-2 py-1 rounded">
                           <Clock className="w-3 h-3" />
                           {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-slate-300 max-w-[200px] truncate">
                        {order.itens.map((item: any) => `${item.quantidade}x ${item.produto.nome}`).join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => togglePaymentStatus(order.id, order.pago)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95 border ${
                          order.pago 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}
                      >
                        {order.pago ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {order.pago ? "Pago" : "Pendente"}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 items-center">
                        <select 
                          value={order.status}
                          onChange={(e) => {
                             if (e.target.value === 'cancelado') {
                                setModalCancelamento({ isOpen: true, pedidoId: order.id, motivo: '', avisarWhatsapp: true });
                             } else {
                                updateOrderStatus(order.id, e.target.value);
                             }
                          }}
                          className={`text-xs font-bold rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer ${
                            order.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            order.status === 'cancelado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            order.status === 'preparando' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            order.status === 'saiu_entrega' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-[#050505] text-indigo-400 border-indigo-500/20'
                          }`}
                        >
                          <option value="pendente" className="bg-[#050505] text-white">Pendente</option>
                          <option value="preparando" className="bg-[#050505] text-white">Preparando</option>
                          <option value="saiu_entrega" className="bg-[#050505] text-white">Saiu para Entrega</option>
                          <option value="concluido" className="bg-[#050505] text-white">Concluído</option>
                          <option value="cancelado" className="bg-[#050505] text-white">Cancelado</option>
                        </select>
                        {order.cliente_telefone && (
                          <button 
                            onClick={() => notificarCliente(order)}
                            className="p-2 h-full aspect-square rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 transition-all active:scale-95 shadow-lg flex items-center justify-center shrink-0"
                            title="Avisar Cliente no WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handlePrint(order)}
                          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95 shadow-lg"
                          title="Imprimir Pedido"
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => removerPedido(order.id)}
                          className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all active:scale-95 shadow-lg"
                          title="Excluir Pedido"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cancelamento */}
      {modalCancelamento.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-white mb-2">Motivo do Cancelamento</h3>
            <p className="text-sm text-slate-400 mb-6">Informe o motivo para histórico e transparência.</p>
            
            <textarea
              className="w-full h-24 bg-[#050505] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none mb-4"
              placeholder="Ex: Produto em falta..."
              value={modalCancelamento.motivo}
              onChange={e => setModalCancelamento(prev => ({ ...prev, motivo: e.target.value }))}
            />

            <label className="flex items-center gap-2 mb-6 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={modalCancelamento.avisarWhatsapp}
                onChange={e => setModalCancelamento(prev => ({ ...prev, avisarWhatsapp: e.target.checked }))}
                className="w-4 h-4 rounded border-white/10 bg-[#050505] text-red-500 focus:ring-red-500/50 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Avisar cliente no WhatsApp</span>
            </label>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModalCancelamento({ isOpen: false, pedidoId: '', motivo: '', avisarWhatsapp: true })}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={confirmarCancelamento}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
