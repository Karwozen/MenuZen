"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  Loader2, 
  Search, 
  Printer, 
  Download, 
  Calendar,
  XCircle,
  Eye,
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
}

export default function HistoricoPedidos() {
  const [loading, setLoading] = useState(true);
  const [restaurante, setRestaurante] = useState<RestauranteInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [modalCancelamento, setModalCancelamento] = useState({ isOpen: false, pedidoId: '', motivo: '', avisarWhatsapp: true });

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

  useEffect(() => {
    if (!restaurante?.id) return;
    const restauranteId = restaurante.id;

    async function fetchOrders() {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('pedidos')
          .select('*')
          .eq('restaurante_id', restauranteId)
          .eq('excluido', false)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error("Erro ao buscar pedidos:", ordersError);
        } else {
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [restaurante?.id]);

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
          <title>Cupom - #${order.id.substring(0, 8).toUpperCase()}</title>
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
            <p style="font-weight: bold; font-size: 1.1em; margin-top: 5px;">Pedido #${order.id.substring(0, 8).toUpperCase()}</p>
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

  const notificarCliente = (pedido: Order, statusOverride?: string, motivoOverride?: string) => {
    if (!pedido.cliente_telefone) {
      alert("O cliente não informou um número de telefone.");
      return;
    }
    const tel = pedido.cliente_telefone.replace(/\D/g, '');
    if (!tel) return;

    const n = '#' + pedido.id.substring(0, 8).toUpperCase();
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
      setOrders(prev => prev.map(o => o.id === modalCancelamento.pedidoId ? { ...o, status: 'cancelado', motivo_cancelamento: modalCancelamento.motivo } : o));
      
      if (modalCancelamento.avisarWhatsapp && pedidoCancelado) {
        notificarCliente(pedidoCancelado, 'cancelado', modalCancelamento.motivo);
      }

      setModalCancelamento({ isOpen: false, pedidoId: '', motivo: '', avisarWhatsapp: true });
    } catch (err) {
      console.error("Erro ao cancelar pedido:", err);
      alert("Erro ao cancelar o pedido.");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar o status.");
    }
  };

  const removerPedido = async (orderId: string) => {
    if (!confirm("Deseja enviar este pedido para a lixeira?")) return;
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ excluido: true, data_exclusao: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Erro ao remover pedido:", err);
      alert("Erro ao remover o pedido.");
    }
  };

  const getNumeroPedido = (id: string) => '#' + id.substring(0, 8).toUpperCase();

  const exportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ['Data', 'Pedido', 'Cliente', 'Total', 'Status'];
    const rows = filteredOrders.map(order => [
      new Date(order.created_at).toLocaleString('pt-BR'),
      getNumeroPedido(order.id),
      order.cliente_nome,
      order.total.toFixed(2).replace('.', ','),
      order.status
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "historico_pedidos.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(order => {
    // Busca por texto (nome ou id)
    const term = searchTerm.toLowerCase();
    const idStr = getNumeroPedido(order.id).toLowerCase();
    const matchText = order.cliente_nome.toLowerCase().includes(term) || idStr.includes(term);

    // Filtro de Data
    let matchDate = true;
    const orderDate = new Date(order.created_at);
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (orderDate < start) matchDate = false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (orderDate > end) matchDate = false;
    }

    // Filtro de Status
    let matchStatus = true;
    if (statusFilter === 'concluidos') {
      matchStatus = order.status === 'concluido';
    } else if (statusFilter === 'cancelados') {
      matchStatus = order.status === 'cancelado';
    }

    return matchText && matchDate && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Histórico de Pedidos
          </h1>
          <p className="text-slate-400 mt-1">Consulte e exporte os pedidos realizados.</p>
        </div>
        
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          <Download className="w-4 h-4" />
          Exportar Relatório
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Busca</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Nome, #Pedido..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data Início</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data Fim</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 px-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
            >
              <option value="todos">Todos</option>
              <option value="concluidos">Concluídos</option>
              <option value="cancelados">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-1 shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-slate-500 text-xs uppercase font-bold tracking-widest bg-white/[0.02]">
                <th className="px-6 py-4">Data / Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                    Nenhum pedido encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-white/[0.02] transition-colors group ${order.status === 'cancelado' ? 'bg-red-500/5' : ''}`}
                  >
                    <td className="px-6 py-5 relative">
                      {order.status === 'cancelado' && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-500"></div>
                      )}
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-indigo-400 mb-2">{getNumeroPedido(order.id)}</span>
                         <span className="text-[10px] font-black tracking-widest text-slate-500 mb-1">MODALIDADE</span>
                         {order.tipo_entrega === 'delivery' ? (
                            <div className="mb-1"><span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold text-xs uppercase tracking-wide">🛵 ENTREGA</span></div>
                         ) : (
                            <div className="mb-1"><span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-wide">🍽️ NO LOCAL</span></div>
                         )}
                         <div className="text-[10px] text-slate-500 font-medium mt-2">
                           {new Date(order.created_at).toLocaleString('pt-BR')}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {order.status === 'cancelado' && (
                        <div className="inline-block mb-2 px-2 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-md">
                          PEDIDO CANCELADO
                        </div>
                      )}
                      <div className="font-bold text-white leading-none mb-1">{order.cliente_nome}</div>
                      {order.status === 'cancelado' && order.motivo_cancelamento && (
                        <div className="text-[10px] text-red-400 mt-1 italic">
                          Motivo: {order.motivo_cancelamento}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                      </div>
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
                          <option value="todos" disabled className="bg-[#050505] text-white">Status</option>
                          <option value="pendente" className="bg-[#050505] text-white">Pendente</option>
                          <option value="preparando" className="bg-[#050505] text-white">Preparando</option>
                          <option value="saiu_entrega" className="bg-[#050505] text-white">Saiu para Entrega</option>
                          <option value="concluido" className="bg-[#050505] text-white">Concluído</option>
                          <option value="cancelado" className="bg-[#050505] text-white">Cancelado</option>
                        </select>
                        {order.cliente_telefone && (
                          <button 
                            onClick={() => notificarCliente(order)}
                            className="p-2 aspect-square rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 border border-green-500/20 transition-all active:scale-95 shadow-lg flex items-center justify-center shrink-0"
                            title="Avisar Cliente no WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handlePrint(order)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all active:scale-95 shadow-lg"
                          title="Imprimir Pedido"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removerPedido(order.id)}
                          className="p-2 rounded-xl bg-slate-500/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-500/20 transition-all active:scale-95 shadow-lg"
                          title="Enviar para Lixeira"
                        >
                          <Trash2 className="w-4 h-4" />
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
